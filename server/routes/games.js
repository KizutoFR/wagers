const express = require('express');
const router = express.Router();

const User = require('../models/User');
const AccountType = require('../models/AccountType');
const LinkedAccount = require('../models/LinkedAccount');

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
        .then(games => res.send({success: true, games}))
        .catch(err => res.status(400).json({error: err}))
})


//GET SUMMONER Current Match
router.get('/league-of-legends/:id', (req, res, next) => {
    console.log("route lol id", req.params.id);
    LinkedAccount.findOne({_id: req.params.id}).then(async (account)=>{
        console.log("route lol findone");
        const currentMatch = await RiotAPI.getLastMatch(account.value, 'EUW');  
        console.log(currentMatch);
        res.status(200).json(currentMatch);
    })
    
});
module.exports = router;