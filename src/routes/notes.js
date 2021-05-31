const express = require('express');
const router = express.Router();
const Note = require ('../models/Note');
const { isAuthenticated } = require('../helpers/auth')

router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/new-notes');
});

router.post('/notes/new-note', isAuthenticated, async (req, res) => {
    const {title, description, tag} = req.body;
    let {pinned} = req.body;
    const errors = [];
    if (!title){
        errors.push({text: 'Please write a title'});
    }
    if (!description){
        errors.push({text: 'Please write a description'});
    }
    if (errors.length > 0){
        res.render('notes/new-notes', {
            errors,
            title,
            description
        })
    } else {
        pinned = (pinned === undefined) ? pinned = false : pinned = true;
        const newNote = new Note({title, description, tag, pinned});
        newNote.user = req.user.id;
        await newNote.save();
        req.flash('success_msg', 'Note Added Successfully')
        res.redirect('/notes')
    }
});


router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
    const note = await Note.findById(req.params.id).lean();
    res.render('notes/edit-note', {note});
});

router.get('/notes/edit/nopin/:id', isAuthenticated, async (req, res) => {
    const pinned = false
    await Note.findByIdAndUpdate(req.params.id, {pinned});
    res.redirect('/notes');
});

router.get('/notes/edit/pin/:id', isAuthenticated, async (req, res) => {
    const pinned = true
    await Note.findByIdAndUpdate(req.params.id, {pinned});
    res.redirect('/notes');
});


router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
    const {title, description} = req.body;
    await Note.findByIdAndUpdate(req.params.id, {title, description});
    req.flash('success_msg', 'Note Updated Successfully');
    res.redirect('/notes');
});


router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Note deleted Successfully');
    res.redirect('/notes');
});


router.get('/notes', isAuthenticated,  async (req, res) => {
    const notes_pinned = await Note.find({user: req.user.id}).find({pinned: true}).sort({date: 'desc'}).lean();
    const notes = await Note.find({user: req.user.id}).find({pinned: false}).sort({date: 'desc'}).lean();
    const empty = !(notes.empty === [] && notes_pinned.empty === [])
    console.log(empty)
    res.render('notes/all-notes', {notes_pinned, notes, empty});
});


module.exports = router;