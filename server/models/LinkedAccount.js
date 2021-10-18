const mongoose = require('mongoose');

const LinkedAccountSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    username: {
      type: String,
      required: true
    },
    account_type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account-type",
        required: true
    }
});

module.exports = LinkedAccount = mongoose.model('linked-account', LinkedAccountSchema);