const mongoose = require('mongoose');

const BattlePassCellSchema = new mongoose.Schema({
    free_reward: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reward',
    },
    premium_reward: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reward',
    }
});

module.exports = BattlePassCell = mongoose.model('BattlePassCell', BattlePassCellSchema);