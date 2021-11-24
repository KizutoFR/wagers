import React, {useEffect,useState} from "react";
import Emitter from '../../services/Emitter';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import { SLUG, VICTORY_REQUIREMENTS } from '../../utils/config.json'
import './Game.css'
import Swal from 'sweetalert2'
import BetPanel from '../../components/BetPanel/BetPanel'

export default function Game({user_data}) {
  const [data, setData] = useState({});
  const [currentBet, setBet] = useState();
  const [betPanel, setBetPanel] = useState(false);
  const [betAlreadyExist, setBetAlreadyExist] = useState(false);
  const [verifying, setVerifying] = useState(false)
  const {slug} = useParams();

  useEffect(() => {
    if(SLUG.includes(slug)){
      if(user_data){
        const linked = user_data.linked_account.find(element => element.account_type.slug === slug)
        getCurrentGameInfo(slug, linked.username);
      }
    } else {
      window.location.replace('/dashboard')
    }
  }, [user_data, slug])

  const getCurrentGameInfo = async (game_slug, username) => {
    return await axios.get(process.env.REACT_APP_API_URL+'/games/'+game_slug+'/'+user_data._id+'/'+username)
      .then(res => {
        setData({currentMatch: res.data.match.currentMatch, accountInfo: res.data.accountInfo, matchDetails: res.data.match.matchDetails})
        if(res.data.bet){
          setBet(res.data.bet);
          setBetAlreadyExist(true);
        }
      })
      .catch(err => console.error(err))
  }

  const createBet = async (data) => {
    setBet(data);
    await axios.post(process.env.REACT_APP_API_URL+'/users/update-wallet', {user_id: user_data._id, new_coins: (user_data.coins - data.coin_put)});
    user_data.coins = user_data.coins - data.coin_put;
    Emitter.emit('UPDATE_COINS', user_data.coins);
  }

  const verifyBetWin = async () => {
    setVerifying(true)
    let valideBet = true;
    const linked = user_data.linked_account.find(element => element.account_type.slug === slug)
    await getCurrentGameInfo(slug, linked.username);
    if(data.matchDetails) {
      currentBet.requirements.map(r => {
        switch(r) {
          case "MATCH_WIN":
            if(r.value !== data.matchDetails.info.participants.win) valideBet = false;
            break;
          case "KILLS_AMOUNT":
            if(r.value > data.matchDetails.info.participants.kills) valideBet = false;
            break;
        }
      })
      if(valideBet){
        await axios.post(process.env.REACT_APP_API_URL+'/users/update-wallet', {user_id: user_data._id, new_coins: (currentBet.coin_put * currentBet.multiplier)});
        user_data.coins = currentBet.coin_put * currentBet.multiplier;
        Emitter.emit('UPDATE_COINS', user_data.coins);
        Swal.fire({
          title: 'You won your bet!',
          text: `+${currentBet.coin_put * currentBet.multiplier} coins`,
          icon: 'success',
          confirmButtonText: 'Ok'
        })
      }else {
        Swal.fire({
          title: 'You lost your bet :/',
          text: `-${currentBet.coin_put} coins`,
          icon: 'error',
          confirmButtonText: 'Ok'
        })
      }
      await axios.post(process.env.REACT_APP_API_URL+'/games/bet/save', {bet_id: currentBet._id});
      setBet(null);
    } else {
      Swal.fire({
        title: 'Your match may not be completely ended',
        text: `Wait few minutes before trying again :)`,
        icon: 'warning',
        confirmButtonText: 'Ok'
      })
    }
    setVerifying(false)
  }

  return (
    <div>
        {data.accountInfo ? (
          <div>
            <h1>{data.accountInfo.overview.name} {data.accountInfo.overview.summonerLevel}</h1>
            <p>{data.opgg} </p>
            {data.accountInfo.rank.map((element, index) => (
              <div key={index}>
                <p> - {element.queueType}:</p>
                <img src={"https://wagers.fr/assets/ranks/Emblem_"+element.tier+".png"} alt={element.tier} title={element.tier}/>
              </div>
            ))}
          </div>
        ) : <p>Loading...</p>}
        {data.currentMatch ? (
          <div>
            {!betAlreadyExist ? (
              <div>
                <button onClick={() => {setBetPanel(!betPanel)}}>Bet on this match</button>
                {betPanel ? (
                  <BetPanel slug={slug} user_id={user_data._id} user_coins={user_data.coins} match_id={data.currentMatch.gameId} setBet={createBet} setBetAlreadyExist={setBetAlreadyExist} />

                ) : ''}
              </div>
            ) : ''}
            <p>{data.currentMatch.gameMode} {data.currentMatch.gameType}</p>
            <div className="match-container">
              {data.currentMatch.participants.map((part, num) => (
                <div key={num} className="match-item">
                  <img src={`http://ddragon.leagueoflegends.com/cdn/11.21.1/img/champion/${part.championName}.png`} alt='champion' />
                  <img src={"https://wagers.fr/assets/ranks/Emblem_"+part.rank+".png"} style={{width: 120+'px', height: 120+'px'}} alt='rank' />
                  <p>{part.teamId} {part.summonerName}</p>
                </div>
              ))}
            </div>
          </div>
        ) : <p>Aucune partie en cours</p>}
        {currentBet ? (
          <div style={{border: '1px solid black', padding: '10px'}}>
            <h4>Bet</h4>
            {currentBet.requirements.map((req, index) => (
              <p key={index}>- {req.label} : {typeof req.value === "boolean" ? (req.value ? 'Yes' : 'No') : req.value} </p>
            ))}
            <p>Put : {currentBet.coin_put} (x{currentBet.multiplier}) </p>
            <p>Potential gain : {currentBet.coin_put * currentBet.multiplier}</p>
            {!verifying ? <button onClick={verifyBetWin}>Verify win conditions</button> : <button disabled>Verifying...</button>}

        </div>
        ) : ''}
    </div>
  )
}