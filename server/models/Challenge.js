const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    game: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    coins: {
        type: Number,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    }
});

module.exports = Challenge = mongoose.model('Challenge', ChallengeSchema);