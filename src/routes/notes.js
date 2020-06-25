const express = require('express');
const router = express.Router();

const Note = require('../models/note');

router.get('/notes/add', (req, res)=>{  // Returns a form to create a new note
    res.render('notes/new-note');
});

router.post('/notes/new-note', async (req, res)=>{    // Route in Server
    // Get the data from the form:
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
        // Using my data model:
        const newNote = new Note({
            title,
            description
        });

        // Save into the db:
        await newNote.save();
        
        // Now, redirect to another place (list of notes):
        res.redirect('/notes');
    }
});

router.get('/notes', async (req, res)=>{
    const notes = await Note.find().sort({date: 'desc'}).lean(); 
    res.render('notes/all-notes', {notes});
});

router.get('/notes/edit/:id', async (req, res)=>{
    const note = await Note.findById(req.params.id).lean();
    res.render('notes/edit-note', {note});
});

// I ca use PUT method for the middleware I defined in 
// index.js (_method) and for the configuration made
// in the edit-note.hbs when sending data to server
// and the hidden input in the same file.
router.put('/notes/edit-note/:id', async (req, res)=>{
    const {title, description} = req.body;
    await Note.findByIdAndUpdate(req.params.id, {
        title,
        description
    });
    res.redirect('/notes');
});

router.delete('/notes/delete/:id', async (req, res)=>{
    await Note.findByIdAndDelete(req.params.id);
    res.redirect('/notes');
});


module.exports = router;