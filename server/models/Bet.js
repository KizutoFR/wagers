const mongoose = require('mongoose');

const BetSchema = new mongoose.Schema({
    game_name: {
        type: String,
        required: true
    },
    match_id: {
        type: Number,
        required: true
    },
    predefined: {
        type: Boolean,
        required: false,
        default: false
    },
    requirements: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VictoryRequirements'
    }],
    multiplier: {
        type: Number,
        required: true
    },
    coin_put: {
        type: Number,
        required: true,
        max: 100000
    },
    account_id: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        default: null
    },
    ended: {
        type: Boolean,
        required: false,
        default: false
    }
});

module.exports = Bet = mongoose.model('Bet', BetSchema);