const express = require('express');
const router = express.Router();

router.get('/notes/add', (req, res)=>{  // Returns a form to create a new note
    res.render('notes/new-note');
});

router.post('/notes/new-note', (req, res)=>{    // Route in Server
    // Now, save this data into database
    console.log(req.body);
    const {title, description} = req.body;
    const errors = [];
    if(!title){
        errors.push({text: 'Please, insert a title'});
    }
    if(!description){
        errors.push({text: 'Please, insert a description'});
    }

    if(errors.length > 0){  // There are errors:
        res.render('notes/new-note', {
            errors,
            title,
            description
        });
    }else{
        res.send("Okay!");
    }
});

router.get('/notes', (req, res)=>{
    res.send('Notes of a user from database');
});


module.exports = router;