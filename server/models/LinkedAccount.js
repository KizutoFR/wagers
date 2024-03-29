const mongoose = require('mongoose');

const LinkedAccountSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    username: {
      type: String,
      required: true
    },
    account_type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AccountType",
        required: true
    },
    value: {
        type: String,
        required: true,
        default: "none"
    }
});

module.exports = LinkedAccount = mongoose.model('LinkedAccount', LinkedAccountSchema);
