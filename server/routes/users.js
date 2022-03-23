const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/User');
const BattlePass = require('../models/BattlePass');
const LinkedAccount = require('../models/LinkedAccount');
const AccountType = require('../models/AccountType');
const BattlePassCell = require('../models/BattlePassCell');
const ClaimedBattlePassCell = require('../models/ClaimedBattlePassCell')

const ENUM = require('../config/enum.json');

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
 @route GET users/
 @description get all users
 @access Public
 */
 router.get('/scoreboard', (req, res) => {
  User.find().sort({ coins: -1 }).limit(10)
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
        res.status(400).json({ success: false, message: 'Incorrect email or password'})
        return;
      }
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if(err) throw err;
        if(isMatch) {
          const token = jwt.sign({ user_id: user._id }, process.env.AUTH_SECRET_TOKEN, {expiresIn: 172800});
          User.updateOne({_id: user._id}, {$set : {auth_token: token}})
              .then(() => res.status(200).json({success: true, user_id: user._id, token}));
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
              .catch(err => console.log(err.message));
          });
        });
      }
    });
  }
})

/**
 @route POST users/update
 @description update user informations from modification page
 @access Public
 */
router.post('/update', async (req, res) => {
  let { firstname, lastname, username, email, id, password, confirmPassword} = req.body;
  let errors = [];

  if (!firstname || !lastname || !username || !email) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if(!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    errors.push({msg: 'Email is not in a valid format'});
  }

  /* TODO : if password == '' alors password = current.user.password */
  if (password.length < 6 && password != '') {
    errors.push({ msg: 'Password must be at least 8 characters' });
  }

  if(password != confirmPassword){
    errors.push({ msg: 'Password and Confirm Password are different' });
  }

  if (errors.length > 0) {
    res.send({ success: false, errors: errors })
  } else {

  const newpassword = await new Promise((resolve,reject)=>{
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });
  })
  
  User.updateOne({_id: id }, {firstname:firstname,lastname:lastname,username:username,email:email,password:newpassword}).then(user=>{
    User.findOne({_id : id}, {password: 0, updated_date: 0, registered_at: 0})
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
    .then(u =>res.status(200).json({success: true,user:u}))
    .catch(err => res.status(400).json({success: false, error: "Someting went wrong : " + err}))
    
  }).catch(err => res.status(400).json({success: false, error: "Someting went wrong : " + err}))
}
})

/**
 @route POST users/update-wallet
 @description update user wallet when create/win/loose a bet
 @access Public
 */
router.post('/update-wallet', (req, res) => {
  const {user_id, new_coins} = req.body;
  User.updateOne({_id: user_id}, {coins: parseInt(new_coins)})
    .then(() => res.status(200).json({success: true}))
    .catch(err => res.status(400).json({success: false, error: "Someting went wrong : " + err}))
})

/**
 @route POST users/update-exp
 @description update user exp when win/loose a bet
 @access Public
 */
 router.post('/update-exp', (req, res) => {
  const {user_id, new_exp} = req.body;
  User.updateOne({_id: user_id}, {exp: parseInt(new_exp)})
    .then(() => res.status(200).json({success: true}))
    .catch(err => res.status(400).json({success: false, error: "Someting went wrong : " + err}))
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
    .catch(err => res.status(400).json({success: false, error: "Someting went wrong : " + err}))
})

router.get('/battlepass', (req, res) => {
  const userId = req.currentUser._id;
  BattlePass.findOne().sort({ expire_at: -1 })
    .populate({
      path: 'cells',
      model: 'BattlePassCell',
      populate: [
          {
              path: 'free_reward',
              model: 'BattlePassReward'
          },
          {
              path: 'premium_reward',
              model: 'BattlePassReward'
          }
      ]
  })
  .then(async (pass) => {
    const claimedCells = await ClaimedBattlePassCell.find({pass_id: pass._id, user_id: userId});
    res.status(200).json({pass, claimedCells})
  }) 
  .catch(err => res.status(400).json({error: err}))
})

router.post('/battlepass/add', (req, res) => {
  const { date } = req.body;

  const bp = new BattlePass({
    cells: [],
    expire_at: date
  });

  bp.save()
    .then(() => {
      res.json({ success: true })
    })
    .catch(err => console.log(err.message));
});

router.post('/battlepass/cells/claim', async (req, res) => {
  const {cell_id, pass_id, is_premium, reward} = req.body;
  const user_id = req.currentUser._id;
  
  const newCell = new ClaimedBattlePassCell({
    pass_id,
    cell_id,
    user_id,
    is_premium
  })

  const user = await User.findOne({_id: user_id});

  switch(reward.type) {
    case ENUM.REWARDS_TYPE.TITLE:
      user.titles.push(reward._id);
      break;
    case ENUM.REWARDS_TYPE.BADGE:
      user.badges.push(reward._id);
      break;
    case ENUM.REWARDS_TYPE.COINS:
      user.coins += parseInt(reward.value);
      break;
    case ENUM.REWARDS_TYPE.BANNER:
      user.banners.push(reward._id);
      break;
    default:
      console.log("REWARD TYPE NOT FOUND");
      break;
  }

  await user.save();

  newCell.save()
    .then(() => res.status(200).json({success: true, cell: newCell}))
    .catch(err => res.status(400).json({error: err}));

  
})

router.post('/battlepass/cells/add', (req, res) => {
  const { free_id, premium_id, battlepass_id } = req.body;
  try {
    const cell = new BattlePassCell({
      free_reward: free_id === '' ? null : free_id,
      premium_reward: premium_id === '' ? null : premium_id
    })

    cell.save()
      .then(() => BattlePass.findOneAndUpdate({_id: battlepass_id}, {$push: { cells: cell._id } }));
    res.status(200).json({success: true})
  } catch(err) {
    res.status(400).json({success: false, err})
  }
  
});

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
    .then(user => res.status(200).json({success: true, user: user}))
    .catch(err => res.status(400).json({success: false, error: "Someting went wrong : " + err}))
})

module.exports = router;