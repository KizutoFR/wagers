const mongoose = require('mongoose');

const ChallengeProgressSchema = new mongoose.Schema({
    challenge_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Challenge',
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    progress: {
        type: Number,
        required: true
    }
});

module.exports = ChallengeProgress = mongoose.model('ChallengeProgress', ChallengeProgressSchema);