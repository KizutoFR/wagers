import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import './BattlePass.css';

import BattlePassCell from '../../components/BattlePassCell/BattlePassCell';
import Emitter from '../../services/Emitter';

export default function BattlePass({ user_data }) {
    const [pass, setPass] = useState();
    const [claimedCells, setClaimedCells] = useState([]);
    const cells = useRef([]);
    const battlepass = useRef();
    let pos = { left: 0, x: 0 };

    useEffect(() => {
        if (user_data) {
            getCurrentBattlePass();
        }
    }, [user_data])

    useEffect(() => {
        Emitter.on('CLAIM_REWARD', data => claimReward(data));
        cells.current.forEach(element => element.addEventListener('mousedown', handleMouseDown));
        return() => {
            Emitter.off('CLAIM_REWARD');
            cells.current.forEach(element => element.removeEventListener('mousedown', handleMouseDown));
        }
    }, [cells, user_data, pass])

    const claimReward = (data) => {
        axios.post(process.env.REACT_APP_API_URL+'/users/battlepass/cells/claim', {...data, pass_id: pass._id})
            .then((response) => setClaimedCells((prevState) => [...prevState, response.data.cell]))
            .catch(err => console.error(err));
    }

    const getCurrentBattlePass = async () => {
        const currentPass = await axios.get(process.env.REACT_APP_API_URL+'/users/battlepass');
        setPass(currentPass.data.pass);
        setClaimedCells(currentPass.data.claimedCells);
    }

    const handleMouseDown = (e) => {
        pos = {
            left: battlepass.current.scrollLeft,
            x: e.clientX,
        }
        battlepass.current.style.cursor = 'grabbing';
        battlepass.current.style.userSelect = 'none';
        battlepass.current.addEventListener('mousemove', handleMouseMove);
        battlepass.current.addEventListener('mouseup', handleMouseUp);
    }

    const getUserPassLevel = () => {
        return Math.floor(user_data.exp / pass.step_exp);
    }

    const isCellClaimed = (cell_id, premium) => {
        return claimedCells.some(c => c.cell_id === cell_id && c.is_premium === premium);
    }

    const isColumnClaimed = (column) => {
        let claimed = true;
        if(column.free_reward) {
            claimed = isCellClaimed(column._id, false);
        }
        
        if(column.premium_reward && claimed) {
            claimed = isCellClaimed(column._id, true);
        }

        return claimed;
    }

    const handleMouseMove = (e) => {
        const dx = e.clientX - pos.x;
        battlepass.current.scrollLeft = pos.left - dx;
    }

    const handleMouseUp = (e) => {
        battlepass.current.style.cursor = 'grab';
        battlepass.current.style.removeProperty('user-select');
        battlepass.current.removeEventListener('mousemove', handleMouseMove);
        battlepass.current.removeEventListener('mouseup', handleMouseUp);
    }

    if(!user_data || !pass) {
        return (
            <p>loading...</p>
        )
    }

    return (
        <div className='battlepass-container'>
            <div className='battlepass-categories'>
                <div>
                    <h1>free</h1>
                </div>
                <div>
                    <h1>premium</h1>
                </div>
            </div>
            <div className='battlepass-wrapper'>
                <div className='battlepass-subcontainer' ref={battlepass}>
                    {pass.cells.map((elem, index) => (
                        <div className="battlepass-col" ref={el => cells.current[index] = el} key={index}>
                            <BattlePassCell data={{reward: elem.free_reward, cell_id: elem._id, step_exp: pass.step_exp, step_level: index + 1}} is_free={true} user_level={getUserPassLevel()} claimed={isCellClaimed(elem._id, false)} />
                            <div className={(index + 1) <= getUserPassLevel() ? 'battlepass-jauge full' : 'battlepass-jauge'}>
                                {(index + 1) == getUserPassLevel() + 1 && 
                                    <div className='battlepass-jauge-current' 
                                        style={{
                                            width: 
                                                index > 0
                                                    ?  `${((user_data.exp / pass.step_exp) - index) * 100}%`
                                                    : `calc(50% + ${((user_data.exp / pass.step_exp) - index) * 100}%)`
                                        }}>
                                    </div>
                                }
                                <p className={(index + 1) <= getUserPassLevel() ? 'battlepass-cell-level battlepass-claim' : 'battlepass-cell-level'}>{isColumnClaimed(elem) ? (<img src="images/reward-check.svg" />) : index + 1}</p>
                            </div>
                            <BattlePassCell data={{reward: elem.premium_reward, cell_id: elem._id, step_exp: pass.step_exp, step_level: index + 1}} is_free={false} user_level={getUserPassLevel()} claimed={isCellClaimed(elem._id, true)}/>
                        </div>
                    ))}                    
                </div>
            </div>
        </div>
    )
}