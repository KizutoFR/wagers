const express = require('express');
const router = express.Router();

const FriendShip = require('../models/FriendShip');
const User = require('../models/User');


/**
 @route GET /friends/requested/:from/:to
 @description get friends request status
 @access Public
 */
router.get('/requested/:requested_by/:received_by', (req, res) => {
  FriendShip.findOne({$or: [{ from: req.params.requested_by, to: req.params.received_by }, { from: req.params.received_by, to: req.params.requested_by }]})
    .then(friendship => {
      if(friendship) {
        if(friendship.accepted){
          res.status(200).json({success: true, requested: false, accepted: friendship.accepted, sender: friendship.from})
        } else {
          res.status(200).json({success: true, requested: true, accepted: friendship.accepted, sender: friendship.from})
        }
      } else {
        res.status(200).json({success: false, requested: false, accepted: false, sender: null})
      }
    })
    .catch(err => res.status(400).json({success: false, error: "Unknwow friendship : " + err}))
})

/**
 @route POST /friends/request/create
 @description create new friends request
 @access Public
 */
router.post('/requests/create', (req, res) => {
  const newFriendRequest = new FriendShip({
    from: req.body.from,
    to: req.body.to,
    accepted: false
  })

  newFriendRequest.save()
    .then(() => res.status(200).json({success: true, message: "Request sent successfully"}))
    .catch(err => res.status(400).json({success: false, message: "Friend request create : " + err}));
})

/**
 @route POST /friends/request/update
 @description accept or decline friend request
 @access Public
 */
router.post('/requests/update', (req, res) => {
  if (req.body.accept) {
    FriendShip.findOneAndUpdate({ from: req.body.from, to: req.body.to}, {accepted: true})
      .then(modReq => {
        User.updateMany({$or: [{_id: req.body.from}, {_id: req.body.to}]}, {$push: {friends: modReq._id}})
        .then(() => res.status(200).json({success: true, message: "Friend request successfully accepted"}))
      })
      .catch(err => res.status(400).json({success: false, message: "Friend request accept : " + err}));
  } else {
    FriendShip.deleteOne({ from: req.body.from, to: req.body.to})
      .then(() => res.status(200).json({success: true, message: "Friend request successfully declined"}))
      .catch(err => res.status(400).json({success: false, message: "Friend request decline : " + err}));
  }
})

/**
 @route POST /friends/request
 @description list pending friends request
 @access Public
 */
 router.get('/requests/list/:id', (req, res) => {
  FriendShip.find({to: req.params.id, accepted: false})
    .populate({
      path: 'from',
      model: 'User'
    })
    .then(result => res.status(200).json({success: true, list: result}))
    .catch(err => res.status(400).json({success: false, message: "Friend request list : " + err}));
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
      .then(() => res.status(200).json({success: true, message: "Friend successfully deleted"}))
  })
  .catch(err => res.status(400).json({success: false, message: "Friend remove : " + err}));
})

module.exports = router;