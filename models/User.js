const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    login: {
        type: String,
        unique: true,
        required: [true, 'Username cannot be left blank']
    },

    password: {
        passwordHash: {
            type: String,
            required: true
        },
        salt: {
            type: String,
            required: true
        }
    },

    notes: [{
        title: {
            type: String,
            required: [true, 'Title is important']
        },
        text: {
            type: String,
            required: [true, 'Text is important']
        },
        date: {
            type: Date,
            default: Date.now
        }
    }]
});

module.exports = mongoose.model('users', usersSchema);
