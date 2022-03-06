import React, { useState, useEffect } from 'react';
import Emitter from '../../services/Emitter';
import './BattlePassCell.css';

export default function BattlePassCell({ data, is_free, user_level, claimed }) {
    const [rewardClaimed, setRewardClaimed] = useState(claimed);

    useEffect(() => {
        setRewardClaimed(claimed);
    }, [claimed])

    const claimReward = (e) => {
        e.target.style.display = "none";
        setRewardClaimed(true);
        Emitter.emit('CLAIM_REWARD', {cell_id: data.cell_id, is_premium: !is_free, reward: data.reward})
    }

    if(is_free && !data.reward) {
        return (
            <div className='battlepass-cell battlepass-empty'></div>
        )
    }

    return (
        <div className={is_free ? 'battlepass-cell battlepass-free ' : 'battlepass-cell'}>
            <div className={rewardClaimed || (data.step_level > user_level) ? 'battlepass-overlay hide-overlay' : 'battlepass-overlay'}>
                <div>
                    <h4>{data.reward.name}</h4>
                    <p>{data.reward.value}</p>
                    <button onClick={(e) => claimReward(e)}>Claim</button>
                </div>
            </div>
            {rewardClaimed && <div className='battlepass-claim-overlay'></div>}
            <img src={`images/rewards/${data.reward.figure}`} />
        </div>
    )
}