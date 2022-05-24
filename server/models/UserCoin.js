const mongoose = require('mongoose');


const UserCoinSchema = new mongoose.Schema({
    date : {
        type: Date,
        required: true
    },
    coin: {
      type: Number,
      required: true
    }
});

module.exports = UserCoin = mongoose.model('UserCoin', UserCoinSchema);
