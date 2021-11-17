const mongoose = require('mongoose');

const BetSchema = new mongoose.Schema({
    game_name: {
        type: String,
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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        default: null
    }
});

module.exports = Bet = mongoose.model('Bet', BetSchema);