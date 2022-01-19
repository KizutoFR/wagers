const mongoose = require('mongoose');

const BattlePassCellSchema = new mongoose.Schema({
    id_rewards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rewards"
    }],
    exp: {
        type: Number,
        default: 1000
    }
});
module.exports = BattlePassCell = mongoose.model('BattlePassCell', BattlePassCellSchema);