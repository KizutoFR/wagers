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
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "FriendShip"
    }],
    linked_account: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "LinkedAccount"
    }],
    exp: {
        type: Number,
        default: 0
    },
    battle_pass_level: {
        type: Number,
        default: 0,
    },
    title: {
        type: String,
        default: "",
    },
    profile_picture: {
        type: String,
        default: 'default.jpg'
    },
    profile_banner: {
        type: String,
        default: 'default_banner.jpg'
    },
    registered_at: {
        type: Date,
        default: Date.now
    },
    updated_date: {
        type: Date,
        default: Date.now
    }
});
module.exports = User = mongoose.model('User', UserSchema);
