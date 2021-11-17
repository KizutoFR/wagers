const express = require('express');
const router = express.Router();

const AccountType = require('../models/AccountType');
const RiotAPI = require('../lib/RiotAPI.js');
const VictoryRequirements = require('../models/VictoryRequirements');
const Bet = require('../models/Bet');

router.get('/', (req, res) => {
  AccountType.find()
    .then(games => res.status(200).send({success: true, games}))
    .catch(err => res.status(400).json({error: err}))
})

router.get('/league-of-legends/:username', async (req, res) => {
  try {
    const accountInfo = await RiotAPI.getSummonerOverview(req.params.username, 'EUW');
    const currentMatch = await RiotAPI.getCurrentMatch(req.params.username, 'EUW');  
    res.status(200).json({currentMatch, accountInfo});
  } catch (err) {
    console.error(err)
  }
});

router.post('/requirements/add', (req, res) => {
  const {label, identifier, value} = req.body;

  const requirements = new VictoryRequirements({
    label,
    identifier,
    value
  })

  requirements.save()
    .then(r => res.status(200).json({success: true, data: r}))
    .catch(err => res.status(400).json({success: false, err: err.message}))
})

router.get('/bet/:game/:user', (req, res) => {
  const game_slug = req.params.game;
  const user_id = req.params.user;

  Bet.find({game_name: game_slug, user: user_id})
    .populate({
      path: 'requirements',
      model: 'VictoryRequirements'
    })
    .then(bet => {
      res.status(200).json({success: true, bet: bet})
    })
    .catch(err => res.status(400).json({success: false, error: "No bet founded : " + err}))
})

router.post('/bet/add', (req, res) => {
  const {game_name, predefined, requirements, multiplier, coin_put, user} = req.body;

  const bet = new Bet({
    game_name,
    predefined,
    requirements,
    multiplier,
    coin_put,
    user
  })

  bet.save()
    .then(b => {
      Bet.populate(b, {path: 'requirements', model: 'VictoryRequirements'}, (err, finalbet) => res.status(200).json({success: true, data: finalbet}))
    })
    .catch(err => res.status(400).json({success: false, err: err.message}))
})

module.exports = router;