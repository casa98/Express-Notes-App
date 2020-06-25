const express = require('express');
const router = express.Router();

router.get('/users/signin', (req, res)=>{
    res.render('users/signin');
});

router.get('/users/signup', (req, res)=>{
    res.render('users/signup');
});

router.post('/users/signup', (req, res)=>{
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
        res.send('Okay!');
    }
});

module.exports = router;