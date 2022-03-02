const express = require('express');
const router = express.Router();

const Challenge = require('../models/Challenge');
const ChallengeProgress = require('../models/ChallengeProgress');

router.get('/:game', async (req, res) => {
    const user = req.currentUser;
    const game_name = req.params.game;
    try {
        let challenges = await Challenge.find({game: game_name, end_date : {$gt: Date.now()}});
        const progress = await ChallengeProgress.find({user_id: user._id});
        challenges = challenges.map((chall) => {
            const prog = progress.find(p => {
                return p.challenge_id.equals(chall._id)
            });
            if(prog) {
                chall.set('progress', prog.progress, {strict: false});
            }
            return chall;
        });
        res.status(200).json({challenges, success: true})
    } catch (err) {
        console.log(err);
        res.status(400).json({message: err, success: false})
    }
})

router.post('/progress', async (req, res) => {
    const {challenge_id, value} = req.body;
    const user = req.currentUser;

    try {
        let challProgress = await ChallengeProgress.findOne({challenge_id: challenge_id, user_id: user._id});
        console.log(challProgress);
        if (challProgress) {
            challProgress.progress += value;
        } else {
            challProgress = new ChallengeProgress({
                challenge_id: challenge_id,
                user_id: user._id,
                progress: value
            })
        }
        challProgress.save().then(() => res.status(200).json({success: true}));
    } catch (err) {
        res.status(400).json({success: false, message: err});
    }
})

module.exports = router;