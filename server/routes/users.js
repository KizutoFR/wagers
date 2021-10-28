const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();

const User = require('../models/User');
const AccountType = require('../models/AccountType');
const LinkedAccount = require('../models/LinkedAccount');

/**
 @route GET users/
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
  let captcha_token = req.body.captcha_token;

  axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_API_SECRET_KEY}&response=${captcha_token}`, {}, {headers: {'content-type': 'application/x-www-form-urlencoded'}})
    .then(result => {
      //TODO: Send email if score <= 0.3 to verify identity
      if(result.data.success && result.data.score > 0) {
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
      } else {
        res.status(400).json({ success: false, message: 'Invalid recaptcha score'})
        return;
      }
    })
    .catch(() => res.status(400).json({ success: false, message: 'Invalid recaptcha' }));
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

  if(!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    errors.push({msg: 'Email is not in a valid format'});
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
    User.findOne({$or : [{ email: email }, {username: username}]}).then(user => {
      if (user) {
        errors.push({ msg: 'Email or username already registered' });
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
 @route GET users/search/:username
 @description get users by username
 @access Public
 */
router.post('/search', (req, res) => {
  var regxp = new RegExp('.*'+req.body.username+'.*', 'i');
  User.find({$and: [{username: {$regex: regxp}}, {_id: {$ne: req.body.current_id}}]})
    .then(users => res.status(200).json({success: true, users: users}))
    .catch(err => res.status(400).json({success: false, error: "No users : " + err}))
})

/**
 @route GET users/:id
 @description get user by id
 @access Public
 */
router.get('/:id', (req, res) => {
  User.findOne({_id : req.params.id}, {password: 0, updated_date: 0, registered_at: 0})
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