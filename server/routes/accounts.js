const express = require('express');
const router = express.Router();

const LinkedAccount = require('../models/LinkedAccount');

router.post('/linked/modify', (req, res) => {
  let name = req.body.name;
  let linked_id = req.body.linked_id;
  LinkedAccount.updateOne({_id: linked_id}, {$set: {username: name}})
    .then(() => res.status(200).json({success: true, message: "Account's username updated successfully"}))
    .catch(err => res.status(400).json({success: false, message: err.message}))
})

module.exports = router;