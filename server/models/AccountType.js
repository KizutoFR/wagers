const mongoose = require('mongoose');

const AccountTypeSchema = new mongoose.Schema({
    thumbnail: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    }
});

module.exports = AccountType = mongoose.model('AccountType', AccountTypeSchema);
