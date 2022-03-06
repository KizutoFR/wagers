const mongoose = require('mongoose');

const ClaimedBattlePassCellSchema = new mongoose.Schema({
    pass_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BattlePass', 
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    cell_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BattlePassCell', 
        required: true
    },
    is_premium: {
        type: Boolean, 
        required: true
    }
});

module.exports = ClaimedBattlePassCell = mongoose.model('ClaimedBattlePassCell', ClaimedBattlePassCellSchema);