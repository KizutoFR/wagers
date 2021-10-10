const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    coins: {
        type: Number,
        required: true
    },
    registered_at: {
        type: Date,
    },
    updated_date: {
        type: Date,
        default: Date.now
    }
});
  
module.exports = User = mongoose.model('users', UserSchema);