const mongoose = require('mongoose');

const BattlePassSchema = new mongoose.Schema({
    cells: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BattlePassCell'
    }],
    step_exp: {
        type: Number,
        default: 1000
    },
    expire_at: {
        type: Date,
        required: true
    }
});
module.exports = BattlePass = mongoose.model('BattlePass', BattlePassSchema);