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
    password: {
        type: String,
        required: true
    },
    coins: {
        type: Number,
        default: 100
    },
    auth_token: {
      type: String,
      default: null
    },
    registered_at: {
        type: Date,
        default: Date.now
    },
    linked_account: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "LinkedAccount"
    }],
    updated_date: {
        type: Date,
        default: Date.now
    }
});
module.exports = User = mongoose.model('User', UserSchema);
