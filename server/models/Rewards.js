const mongoose = require('mongoose');
import * as ENUM  from '../config/enum.json';

const RewardsSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: ENUM.REWARDS_TYPE,
    },

    free:{
        type: Boolean,
        required:true
    },
    value:{
        type:String,
        required:true
    }
    
});
module.exports = Rewards = mongoose.model('Rewards', RewardsSchema);