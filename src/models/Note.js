const mongoose = require('mongoose');
const {Schema} = mongoose;

const NoteSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    tag: {type: String, required: false},
    pinned: {type: Boolean, required: false},
    date: {type: Date, default: Date.now},
    user: {type: String}
});

module.exports = mongoose.model('Note', NoteSchema);