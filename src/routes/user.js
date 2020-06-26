const express = require('express');
const router = express.Router();

const User = require('../models/user');

router.get('/users/signin', (req, res)=>{
    res.render('users/signin');
});

router.get('/users/signup', (req, res)=>{
    res.render('users/signup');
});

router.post('/users/signup', async (req, res)=>{
    const {name, email, password, confirm_password} = req.body;
    const errors = [];
    if(name.length == 0){
        errors.push({text: 'Please, insert a name'});
    }
    if(password != confirm_password){
        errors.push({text: 'Passwords don\'t match'});
    }
    if(password.length < 6){
        errors.push({text: 'Password must be at least 8 chararters'});
    }
    if(errors.length > 0){
        // Render view again, but show error messages
        res.render('users/signup', {errors, name, email});
    }else{
        // Verifiy that email is not registered already
        const emailUser = await User.findOne({email: email });
        if(emailUser){
            req.flash('error_msg', 'Email already registered');
            res.redirect('/users/signup');
        }else{
            const newUser = new User({
                name,
                email,
                password
            });
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg', 'You were successfully registered');
            res.redirect('/users/signin');
        }
    }
});

module.exports = router;