const express = require('express');
const router = express.Router();

const FriendShip = require('../models/FriendShip');
const User = require('../models/User');


/**
 @route GET /friends/requested/:from/:to
 @description get friends request status
 @access Public
 */
 router.get('/requested/:from/:to', (req, res) => {
  FriendShip.findOne({ from: req.params.from, to: req.params.to })
    .then(friendship => {
      if(friendship) {
        if(friendship.accepted){
          res.status(200).json({success: true, requested: false, accepted: friendship.accepted})
        } else {
          res.status(200).json({success: true, requested: true, accepted: friendship.accepted})
        }
      } else {
        res.status(200).json({success: false, requested: false, accepted: false})
      }
    })
    .catch(err => res.status(400).json({success: false, error: "Unknwow friendship : " + err}))
})

/**
 @route POST /friends/request
 @description create new friends request
 @access Public
 */
router.post('/request', (req, res) => {
  const newFriendRequest = new FriendShip({
    from: req.body.from,
    to: req.body.to,
    accepted: false
  })

  newFriendRequest.save()
    .then(newReq => {
      User.updateMany({$or: [{_id: req.body.from}, {_id: req.body.to}]}, {$push: {friends: newReq._id}})
        .then(() => res.status(200).json({success: true, message: "Request sent successfully"}))
    })
    .catch(err => res.status(400).json({success: false, messsage: "Friend request : " + err}));
})

/**
 @route POST /friends/remove
 @description create new friends request
 @access Public
 */
router.post('/remove', (req, res) => {
  FriendShip.findOneAndDelete({from: req.body.from, to: req.body.to})
  .then(delReq => {
    User.updateMany({$or: [{_id: req.body.from}, {_id: req.body.to}]}, {$pull: {friends: delReq._id}})
      .then(() => {
        res.status(200).json({success: true, message: "Friend successfully deleted"})
      })
  })
  .catch(err => res.status(400).json({success: false, messsage: "Friend remove : " + err}));
})

module.exports = router;