const express = require('express');
const router = express.Router();

const Note = require('../models/note');
const {isAuthenticated} = require('../helpers/auth');

router.get('/notes/add', isAuthenticated, (req, res)=>{  // Returns a form to create a new note
    res.render('notes/new-note');
});

router.post('/notes/new-note', isAuthenticated, async (req, res)=>{    // Route in Server
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
        newNote.user = req.user.id;

        // Save into the db:
        await newNote.save();

        // Show a flash message
        req.flash('success_msg', 'Note Added Successfully');
        
        // Now, redirect to another place (list of notes):
        res.redirect('/notes');
    }
});

router.get('/notes', isAuthenticated, async (req, res)=>{
    const notes = await Note.find({user: req.user.id}).sort({date: 'desc'}).lean(); // Search filtering by userID
    res.render('notes/all-notes', {notes});
});

router.get('/notes/edit/:id', isAuthenticated, async (req, res)=>{
    const note = await Note.findById(req.params.id).lean();
    res.render('notes/edit-note', {note});
});

// I can use PUT method for the middleware I defined in 
// index.js (_method) and for the configuration made
// in the edit-note.hbs when sending data to server
// and the hidden input in the same file.
router.put('/notes/edit-note/:id', isAuthenticated, async (req, res)=>{
    const {title, description} = req.body;
    await Note.findByIdAndUpdate(req.params.id, {
        title,
        description
    });
    
    req.flash('success_msg', 'Note Updated Successfully');

    res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuthenticated, async (req, res)=>{
    await Note.findByIdAndDelete(req.params.id);

    req.flash('success_msg', 'Note Deleted Successfully');

    res.redirect('/notes');
});


module.exports = router;