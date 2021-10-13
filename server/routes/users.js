const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const User = require('../models/User');

/** 
@route GET /
@description get all users
@access Public 
*/
router.get('/', (req, res) => {
  User.find()
    .then(users => res.send(users))
    .catch(err => res.status(400).json({error: err}))
})

/** 
@route GET users/:id
@description get user by id
@access Public 
*/
router.get('/:id', (req, res) => {
  User.findOne({_id : req.params.id})
    .then(user => res.send(user))
    .catch(err => res.status(400).json({error: "Unknwow user : " + err}))
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
        res.json({ user: null, message: 'No user exist with this email'})
        return;
      }
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if(err) throw err;
        if(isMatch) {
          res.json({ user: user, message: 'You are now connected' })
        } else {
          res.json({ user: null, message: 'Wrong password' })
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

  if (password != confirmPassword) {
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

module.exports = router;