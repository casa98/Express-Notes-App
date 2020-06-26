const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const User = require('../models/user');

passport.use(new localStrategy({
    usernameField: 'email'
}, async (email, password, done)=>{
    const user = await User.findOne({email: email});    // Returns Boolean
    if(!user){
        return done(null, false, {message: 'User not found'});  // To finish auth process
    }else{
        // User found, validate password:
        const match = await User.matchPassword(password);
        if(match){
            return done(null, user);
        }else{
            return done(null, false, {message: 'Incorrect password'});
        }
    }
}
));

passport.serializeUser((user, done)=>{
    done(null, user.id);
});

passport.deserializeUser((id, done)=>{
    User.findById(id, (err, user)=>{
        done(err, user);
    }); 
});