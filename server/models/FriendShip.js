const mongoose = require('mongoose');

const FriendShipSchema = new mongoose.Schema({
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    accepted: {
      type: Boolean,
      required: false,
      default: false
    }
});

module.exports = FriendShip = mongoose.model('FriendShip', FriendShipSchema);
