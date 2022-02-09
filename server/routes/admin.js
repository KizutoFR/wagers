const express = require('express');
const router = express.Router();

const BattlePass = require('../models/BattlePass');
const BattlePassCell = require('../models/BattlePassCell');
const BattlePassReward = require('../models/BattlePassReward');

router.get('/', async (req, res) => {
    try {
        const allBattlePass = await BattlePass.find();
        res.render('index', {allBattlePass});
    }
    catch(err) {
        console.error(err)
        res.status(400).json({success: false});
    }
})

router.get('/battlepass/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const currentPass = await BattlePass.findOne({_id: id})
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
            });
        const availableRewards = await BattlePassReward.find();
        res.render('pass', {currentPass, availableRewards});
    }
    catch(err) {
        console.error(err)
        res.status(400).json({success: false});
    }
})

module.exports = router;