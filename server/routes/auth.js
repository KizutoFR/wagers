const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 @route POST users/login
 @description login user
 @access Public
 */
 router.post('/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
  
    User.findOne({ email: email }, {auth_token: 0})
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
        if(!user) {
          res.status(400).json({ success: false, message: 'Incorrect email or password'})
          return;
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if(err) throw err;
          if(isMatch) {
            const {password, ...rest} = user.toObject();
            const token = jwt.sign({ user: rest }, process.env.AUTH_SECRET_TOKEN, {expiresIn: 172800});
            User.updateOne({_id: user._id}, {$set : {auth_token: token}})
              .then(() => {
                user.auth_token = token;
                res.status(200).json({success: true, user, accessToken: token})
              });
          } else {
            res.status(200).json({ success: false, message: 'Incorrect email or password' })
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
      return res.send({ success: false, errors: errors })
    }
    User.findOne({$or : [{ email: email }, {username: username}]}).then(user => {
      if (user) {
        errors.push({ msg: 'Email or username already registered' });
        return res.send({ success: false, errors: errors })
      }
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
            .catch(err => console.log(err.message));
        });
      });
    });
  })

  module.exports = router;