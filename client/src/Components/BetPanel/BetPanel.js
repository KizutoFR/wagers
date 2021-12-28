import axios from 'axios';
import React, {useState, useEffect} from 'react';
import Emitter from '../../services/Emitter';
import { FaPlus, FaCaretLeft, FaTrash } from 'react-icons/fa';
import { VICTORY_REQUIREMENTS } from '../../utils/config.json'
import './BetPanel.css';
import Swal from 'sweetalert2'

import SelectVictoryRequirement from '../SelectVictoryRequirement/SelectVictoryRequirement';

export default function BetPanel({slug, user_data, match_id, setBet}) {
  const [list, setList] = useState([]);
  const [step, setStep] = useState(1);
  const [multiplier, setMultiplier] = useState(1.5);
  const [stake, setStake] = useState(100);

  useEffect(() => {
    document.body.classList.add('remove-scroll');
    return () => {
      document.body.classList.remove('remove-scroll');
    }
  })

  const addToList = (elem) => {
    let arr = list;
    arr.push(elem);
    setList([...arr]);
  }

  const removeFromList = (elem) => {
    let arr = list;
    let element_index = arr.findIndex(e => e.identifier === elem.identifier);
    if(element_index > -1) {
      arr.splice(element_index, 1);
      setList([...arr]);
    }
  }

  const validateVictoryRequirements = () => {
    if(list.length > 0) {      
      setStep(step + 1);
    }  
  }

  const confirmBetCreation = async () => {
    await Promise.all(list.map(el => axios.post(process.env.REACT_APP_API_URL+'/games/requirements/add', el)))
      .then(async res => {
        const requirements = res.map(r => r.data.data._id);
        await axios.post(process.env.REACT_APP_API_URL+'/games/bet/add', {
          game_name: slug,
          match_id: match_id ? match_id : 0,
          predefined: false,
          requirements,
          multiplier: 1.5,
          coin_put: stake,
          user: user_data._id
        })
        .then(async finalbet => {
          setBet(finalbet.data.data);
          await axios.post(process.env.REACT_APP_API_URL+'/users/update-wallet', {user_id: user_data._id, new_coins: (user_data.coins - stake)})
            .then(() => {
              console.log("Bet created successfully")
              user_data.coins = user_data.coins - stake;
              Emitter.emit('CLOSE_BET_PANEL');
              Emitter.emit('UPDATE_COINS', user_data.coins);
              Swal.fire({
                title: 'Good Luck !',
                text: `Bet created successfully`,
                icon: 'success',
                confirmButtonText: 'Ok'
              })
            })
        })
        .catch(err => {
          Swal.fire({
            title: 'Oops :/',
            text: `Someting wrong happened`,
            icon: 'error',
            confirmButtonText: 'Ok'
          })
        }) 
      })
  }

  const validateStake = () => {
    if(stake > user_data.coins) {
      Swal.fire({
        title: 'Oops :/',
        text: `You don't have enough coins to bet ${stake}`,
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      Emitter.emit('CLOSE_BET_PANEL');
    } else {
      setStep(step + 1);
    }
  }

  return (
    <div className='betpanel-container'>
      <div className='betpanel'>

        {/* STEP 1 */}
        {step === 1 ? (
          <div>
            <div className="betpanel-header">
              <div>
                <FaCaretLeft className="betpanel-back-icon" onClick={() => setStep(2)} />
                <h1>Select option</h1>
              </div>
              <button className="betpanel-close" onClick={() => Emitter.emit('CLOSE_BET_PANEL')}>X</button>
            </div>
            <SelectVictoryRequirement list={list} addToList={addToList} setStep={setStep} step={step} />
          </div>
        ) : ''}

        {/* STEP 2 */}
        {step === 2 ? (
          <div>
            <div className="betpanel-header">
              <div>
                <h1>Victory requirements</h1>
              </div>
              <button className="betpanel-close" onClick={() => Emitter.emit('CLOSE_BET_PANEL')}>X</button>
            </div>
            <ul className='requirements-list'>
              {list.map((requirement, index) => (
                <li key={index}>
                  <div>
                    <p>Option {index + 1}</p>
                    <h3>{requirement.label}</h3>
                  </div>
                  <div>
                    <p>{requirement.value === true ? 'Yes' : requirement.value}</p>
                    <FaTrash className='remove-icon' onClick={() => removeFromList(requirement)} />
                  </div>
                </li>
              ))}
            </ul>
            {list.length !== VICTORY_REQUIREMENTS.length ? <div className='add-requirement' onClick={() => setStep(1)}>
              <FaPlus />
            </div> : ''}
            <button className='betpanel-next' onClick={() => validateVictoryRequirements()}>NEXT STEP</button>
          </div>
        ) : ''}

        {/* STEP 3 */}
        {step === 3 ? (
          <div>
            <div className="betpanel-header">
              <div>
                <FaCaretLeft className="betpanel-back-icon" onClick={() => setStep(step - 1)} />
                <h1>Stake</h1>
              </div>
              <button className="betpanel-close" onClick={() => Emitter.emit('CLOSE_BET_PANEL')}>X</button>
            </div>
            <div className='stake'>
              <h1>{stake} <img src="images/PIEPECES.svg" alt="coins icon"></img></h1>
              <input type="range" min="100" max={user_data.coins} value={stake} onChange={(e) => setStake(e.target.value)} />
              <div className='stake-controls'>
                <p onClick={() => setStake(10)}>Min</p>
                <p onClick={() => setStake(user_data.coins/2)}>1/2</p>
                <p onClick={() => setStake(user_data.coins)}>Max</p>
              </div>
              <div className='balance-info'>
                <p>Current balance:</p>
                <p>{user_data.coins} <img src="images/PIEPECES.svg" alt="coins icon"></img></p>
              </div>
            </div>
            <button className='betpanel-next' onClick={validateStake}>NEXT STEP</button>
          </div>
        ) : ''}

        {/* STEP 4 */}
        {step === 4 ? (
          <div>
            <div className="betpanel-header">
              <div>
                <FaCaretLeft className="betpanel-back-icon" onClick={() => setStep(step - 1)} />
                <h1>Bet validation</h1>
              </div>
              <button className="betpanel-close" onClick={() => Emitter.emit('CLOSE_BET_PANEL')}>X</button>
            </div>
            <div className='betpanel-validation'>
              <h2>Victory requirements</h2>
              <ul>
                {list.map((requirement, index) => (
                  <li key={index}>
                    <p>{requirement.label}</p>
                    <span></span>
                    <p>{requirement.value === true ? 'Yes' : requirement.value}</p>
                  </li>
                ))}
              </ul>
              <h2>Balance status</h2>
              <ul>
                <li>
                  <p>Current balance</p>
                  <span></span>
                  <p>{user_data.coins} <img src="images/PIEPECES.svg" alt="coins icon" /></p>
                </li>
                <li>
                  <p>Stake</p>
                  <span></span>
                  <p style={{color: "#E16868"}}>-{stake} <img src="images/PIEPECES.svg"  alt="coins icon" /></p>
                </li>
                <li>
                  <p>After bet</p>
                  <span></span>
                  <p>{user_data.coins - stake} <img src="images/PIEPECES.svg"  alt="coins icon" /></p>
                </li>
                <li>
                  <p>Multiplier</p>
                  <span></span>
                  <p>{multiplier}</p>
                </li>
                <li>
                  <p>Potential gain</p>
                  <span></span>
                  <p style={{color: "#69DF8C"}}>+{stake * multiplier} <img src="images/PIEPECES.svg" alt="coins icon" ></img></p>
                </li>
              </ul>
            </div>
            <button className='betpanel-next' onClick={confirmBetCreation}>Confirm bet</button>
          </div>
        ) : ''}
      </div>
    </div>
  )
}
