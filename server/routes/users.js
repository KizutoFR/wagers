const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../models/User');

const { forwardAuthenticated } = require('../config/auth/auth');

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
router.get('/:id', forwardAuthenticated, (req, res) => {
  User.findOne({_id : req.params.id})
    .then(user => res.send(user))
    .catch(err => res.status(400).json({error: "Unknwow user : " + err}))
})

/** 
@route POST users/login
@description login
@access Public 
*/
router.post('/login', (req, res) => {
  passport.authenticate('local', {
    successRedirect: '/bet',
    failureRedirect: '/login',
    failureFlash: false
  })(req, res, next);
})

/** 
@route POST users/logout
@description logout
@access Public 
*/
router.post('/logout', forwardAuthenticated, (req, res) => {
  req.logout();
  res.redirect('/users/login');
})



module.exports = router;