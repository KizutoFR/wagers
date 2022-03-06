const express = require('express');
const router = express.Router();

const AccountType = require('../models/AccountType');
const RiotAPI = require('../lib/RiotAPI.js');
const VictoryRequirements = require('../models/VictoryRequirements');
const Bet = require('../models/Bet');
const { getAverageValues, calculateCote } = require('../config/utils.js');

router.get('/', (req, res) => {
  AccountType.find()
    .then(games => res.status(200).send({success: true, games}))
    .catch(err => res.status(400).json({error: err}))
})

router.get('/:game/:username', async (req, res) => {
  const game_slug = req.params.game;
  const user_id = req.currentUser._id;
  const username = encodeURIComponent(req.params.username);
  try {
    const accountInfo = await RiotAPI.getSummonerOverview(username, 'EUW');
    const bet = await Bet.findOne({game_name: game_slug, user: user_id, /*account_id: accountInfo.id,*/ ended: false})
      .populate({
        path: 'requirements',
        model: 'VictoryRequirements'
      });
    const match_id = bet ? bet.match_id : null;
    const currentMatch = await RiotAPI.getCurrentMatch(username, match_id, 'EUW');
    const opgg = await RiotAPI.getOPGGByName(username, 'EUW');
    res.status(200).json({currentMatch, accountInfo, bet, opgg});
  } catch (err) {
    console.log(err);
    res.status(400).json({success: false, error: err})
  }
});

router.post('/requirements/add', (req, res) => {
  const {label, identifier, figure, value} = req.body;
  const requirements = new VictoryRequirements({
    label,
    figure,
    identifier,
    value
  })

  requirements.save()
    .then(r => res.status(200).json({success: true, data: r}))
    .catch(err => res.status(400).json({success: false, err: err.message}))
})

router.post('/bet/add', (req, res) => {
  const {game_name, match_id, predefined, requirements, multiplier, coin_put, account_id, user} = req.body;
  console.log(account_id);
  const bet = new Bet({
    game_name,
    match_id,
    predefined,
    requirements,
    multiplier,
    coin_put,
    account_id: account_id.value,
    user
  })

  bet.save()
    .then(b => {
      Bet.populate(b, {path: 'requirements', model: 'VictoryRequirements'}, (err, finalbet) => res.status(200).json({success: true, data: finalbet}))
    })
    .catch(err => res.status(400).json({success: false, err: err.message}))
})

router.post('/bet/save', (req, res) => {
  const {bet_id} = req.body;

  Bet.updateOne({_id: bet_id}, {ended: true})
    .then(() => res.status(200).json({success: true}))
    .catch(err => res.status(400).json({success: false, error: err}))
})

router.post('/bet/multiplier', async (req, res) => {
  const {requirements, summonerName} = req.body;
  const matches = await RiotAPI.getMatchHistory(encodeURIComponent(summonerName), 30, 'EUW');

  const averages = getAverageValues(matches);
  let final_cote = 1;
  console.log(averages);
  requirements.forEach(prop => {
    switch(prop.identifier) {
      case 'MATCH_WIN':
        console.log(prop);
        final_cote = final_cote * averages.win + 1;
      break;
      case 'KILLS_AMOUNT':
        final_cote = final_cote * calculateCote(prop, averages.kills);
      break;
      case 'DESTROYED_TURRETS':
      default:
        final_cote = final_cote * calculateCote(prop, averages.turretKills);
      break;
    }
  })

  res.status(200).json({multiplier: Math.round((final_cote + Number.EPSILON) * 10) / 10});
})

module.exports = router;