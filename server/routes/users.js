const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/User');
const AccountType = require('../models/AccountType');
const LinkedAccount = require('../models/LinkedAccount');

/**
 @route GET /
 @description get all users
 @access Public
 */
router.get('/', (req, res) => {
  User.find()
      .then(users => res.status(200).json({users}))
      .catch(err => res.status(400).json({error: err}))
})

/**
 @route POST users/login
 @description login user
 @access Public
 */
router.post('/login', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  User.findOne({ email: email })
      .then(user => {
        if(!user) {
          res.status(400).json({ success: false, message: 'No user exist with this email'})
          return;
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if(err) throw err;
          if(isMatch) {
            const token = jwt.sign({ user_id: user._id }, process.env.AUTH_SECRET_TOKEN, {expiresIn: 172800});
            User.updateOne({_id: user._id}, {$set : {auth_token: token}})
                .then(() => res.status(200).json({success: true, user_id: user._id, token}));
          } else {
            res.status(400).json({ success: false, message: 'Wrong password' })
          }
        })
      })
})

/**
 @route POST users/register
 @description register user
 @access Public
 */
router.post('/register', (req, res) => {
  let { firstname, lastname, username, email, password, confirmPassword } = req.body;
  let errors = [];

  if (!firstname || !lastname || !username || !email || !password || !confirmPassword) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password !== confirmPassword) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 8 characters' });
  }

  if (errors.length > 0) {
    res.send({ success: false, errors: errors })
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.send({ success: false, errors: errors })
      } else {
        const newUser = new User({
          firstname,
          lastname,
          username,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(() => {
                res.json({ success: true, errors: errors })
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
})

/**
 @route GET users/:id
 @description get user by id
 @access Public
 */
router.get('/:id', (req, res) => {
  User.findOne({_id : req.params.id})
    .populate({
      path: 'linked_account',
      model: 'LinkedAccount',
      populate: {
        path: 'account_type',
        model: 'AccountType'
      },
    })
    .populate({
      path: 'friends',
      model: 'FriendShip',
      populate: [
        {
          path: 'from',
          model: 'User'
        },
        {
          path: 'to',
          model: 'User'
        }
      ]
    })
    .then(user => {
      res.status(200).json({success: true, user: user})
    })
    .catch(err => res.status(400).json({success: false, error: "Unknwow user : " + err}))
})

module.exports = router;