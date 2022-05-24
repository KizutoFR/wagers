import axios from 'axios';
import React, {useState, useEffect} from 'react';
import Emitter from '../../services/Emitter';
import { FaPlus, FaCaretLeft, FaTrash } from 'react-icons/fa';
import { headers, VICTORY_REQUIREMENTS } from '../../utils/config'
import './BetPanel.css';
import Swal from 'sweetalert2'
import { useTranslation } from "react-i18next";

import SelectVictoryRequirement from '../SelectVictoryRequirement/SelectVictoryRequirement';
import { useAuthState } from '../../context/Auth';

export default function BetPanel({slug, match_id, setBet, summonerName}) {
  const auth = useAuthState();
  const [list, setList] = useState([]);
  const [step, setStep] = useState(1);
  const [multiplier, setMultiplier] = useState(1.5);
  const [stake, setStake] = useState(100);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(false);
    document.body.classList.add('remove-scroll');
    return () => {
      document.body.classList.remove('remove-scroll');
    }
  })

  useEffect(() => {
    if(step === 4) {
      setLoading(true);
      calculateMultiplier();
    }
  }, [step])

  const calculateMultiplier = async () => {
    await axios.post(process.env.REACT_APP_API_URL+'/games/bet/multiplier', {requirements: list, summonerName}, headers)
      .then(response => {
        setMultiplier(response.data.multiplier)
        setLoading(false);
        setStep(step + 1)
      })
  }

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
    await Promise.all(list.map(el => axios.post(process.env.REACT_APP_API_URL+'/games/requirements/add', el, headers)))
      .then(async res => {
        const requirements = res.map(r => r.data.data._id);
        await axios.post(process.env.REACT_APP_API_URL+'/games/bet/add', {
          game_name: slug,
          match_id: match_id ? match_id : 0,
          predefined: false,
          requirements,
          multiplier: multiplier,
          coin_put: stake,
          account_id: auth.user.linked_account.find((acc) => acc.account_type.type === slug),
          user: auth.user._id
        }, headers)
        .then(async finalbet => {
          setBet(finalbet.data.data);
          await axios.post(process.env.REACT_APP_API_URL+'/users/update-wallet', {user_id: auth.user._id, new_coins: (auth.user.coins - stake)}, headers)
            .then(() => {
              auth.user.coins = auth.user.coins - stake;
              Emitter.emit('CLOSE_BET_PANEL');
              Emitter.emit('UPDATE_COINS', auth.user.coins);
              Swal.fire({
                title: 'Good Luck !',
                text: `Bet created successfully`,
                icon: 'success',
                confirmButtonText: 'Ok'
              })
            })
        })
        .catch(err => {
          console.error(err)
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
    if(stake > auth.user.coins) {
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
                <h1>{t('betPanel.option')} </h1>
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
                <h1>{t('betPanel.victoryRequirements')}</h1>
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
            <button className='betpanel-next' onClick={() => validateVictoryRequirements()}>{t('betPanel.next')}</button>
          </div>
        ) : ''}

        {/* STEP 3 */}
        {step === 3 ? (
          <div>
            <div className="betpanel-header">
              <div>
                <FaCaretLeft className="betpanel-back-icon" onClick={() => setStep(step - 1)} />
                <h1>{t('betPanel.stake')}</h1>
              </div>
              <button className="betpanel-close" onClick={() => Emitter.emit('CLOSE_BET_PANEL')}>X</button>
            </div>
            <div className='stake'>
              <h1>{stake} <img src="images/PIEPECES.svg" alt="coins icon"></img></h1>
              <input type="range" min="100" max={auth.user.coins} value={stake} onChange={(e) => setStake(e.target.value)} />
              <div className='stake-controls'>
                <p onClick={() => setStake(10)}>Min</p>
                <p onClick={() => setStake(auth.user.coins/2)}>1/2</p>
                <p onClick={() => setStake(auth.user.coins)}>Max</p>
              </div>
              <div className='balance-info'>
                <p>{t('betPanel.stake')}</p>
                <p>{auth.user.coins} <img src="images/PIEPECES.svg" alt="coins icon"></img></p>
              </div>
            </div>
            <button className='betpanel-next' onClick={validateStake}>{t('betPanel.next')}</button>
          </div>
        ) : ''}

        {/* STEP 4 */}
        {step === 4 ? (
          <div>
            <div className="betpanel-header">
              <div>
                <FaCaretLeft className="betpanel-back-icon" onClick={() => setStep(step - 1)} />
                <h1>Stake</h1>
              </div>
              <button className="betpanel-close" onClick={() => Emitter.emit('CLOSE_BET_PANEL')}>X</button>
            </div>
            <div className='multiplier-calcul'>
              <h3>Calculation of the current multiplier</h3>
              <div className="multiplier-loader"></div>
            </div>
          </div>
        ) : ''}

        {/* STEP 5 */}
        {step === 5 ? (
          <div>
            <div className="betpanel-header">
              <div>
                <FaCaretLeft className="betpanel-back-icon" onClick={() => setStep(step - 1)} />
                <h1>{t('betPanel.betValidation')}</h1>
              </div>
              <button className="betpanel-close" onClick={() => Emitter.emit('CLOSE_BET_PANEL')}>X</button>
            </div>
            <div className='betpanel-validation'>
              <h2>{t('betPanel.victoryRequirements2')}</h2>
              <ul>
                {list.map((requirement, index) => (
                  <li key={index}>
                    <p>{requirement.label}</p>
                    <span></span>
                    <p>{requirement.value === true ? 'Yes' : requirement.value}</p>
                  </li>
                ))}
              </ul>
              <h2>{t('betPanel.balanceStatus')}</h2>
              <ul>
                <li>
                  <p>{t('betPanel.currentBalence')}</p>
                  <span></span>
                  <p>{auth.user.coins} <img src="images/PIEPECES.svg" alt="coins icon" /></p>
                </li>
                <li>
                  <p>{t('betPanel.stake')}</p>
                  <span></span>
                  <p style={{color: "#E16868"}}>-{stake} <img src="images/PIEPECES.svg"  alt="coins icon" /></p>
                </li>
                <li>
                  <p>{t('betPanel.afterBet')}</p>
                  <span></span>
                  <p>{auth.user.coins - stake} <img src="images/PIEPECES.svg"  alt="coins icon" /></p>
                </li>
                <li>
                  <p>Multiplier</p>
                  <span></span>
                  <p>{multiplier}</p>
                </li>
                <li>
                  <p>{t('betPanel.potentielGain')}</p>
                  <span></span>
                  <p style={{color: "#69DF8C"}}>+{Math.ceil(stake * multiplier)} <img src="images/PIEPECES.svg" alt="coins icon" ></img></p>
                </li>
              </ul>
            </div>
            <button className='betpanel-next' onClick={confirmBetCreation}>{t('betPanel.confirmBet')}</button>
          </div>
        ) : ''}
      </div>
    </div>
  )
}
