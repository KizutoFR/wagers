const express = require('express');
const router = express.Router();

const AccountType = require('../models/AccountType');
const RiotAPI = require('../lib/RiotAPI.js');

const RiotAPI = require('../lib/RiotAPI.js');

// router.get('/add-types', (req, res) => {
//     AccountType.insertMany([
//         { thumbnail: 'lol_thumbnail.jpg', name: 'Leagues Of Legends', type: "LOL" },
//         { thumbnail: 'lol_thumbnail.jpg', name: 'Rocket League', type: "RL" },
//         { thumbnail: 'lol_thumbnail.jpg', name: 'Apex Legends', type: "AL" },
//         { thumbnail: 'lol_thumbnail.jpg', name: 'Rainbow Six Siege', type: "RSS" }
//     ]).then(() => res.status(200).json({message: 'ok'}));
// })

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
        console.log(err.message)
    }
});
module.exports = router;