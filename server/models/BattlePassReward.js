const mongoose = require('mongoose');
const ENUM = require('../config/enum.json');

const BattlePassRewardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ENUM.REWARDS_TYPE,
    },
    figure: {
        type: String,
        required: true
    },
    value:{
        type: String,
        required:true
    }
});
module.exports = BattlePassReward = mongoose.model('BattlePassReward', BattlePassRewardSchema);