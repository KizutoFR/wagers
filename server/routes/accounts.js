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

router.post('/linked/create', (req, res) => {
  let user = req.body.user_id;
  let username = req.body.name;
  let account_type = req.body.account_id;

  const newLinkedAccount = new LinkedAccount({
    user,
    username,
    account_type
  })

  newLinkedAccount.save()
    .then(account => {
      User.updateOne({_id: user}, {$push: {linked_account: account._id}}).then(() => {
        res.status(200).json({success: true, message: "Account linked successfully"})
      })
    })
    .catch(err => res.status(400).json({success: false, message: err.message}))
})

module.exports = router;