import React, {useEffect,useState} from "react";
import {useParams} from 'react-router-dom';
import axios from 'axios';
import { SLUG } from '../../utils/config.json'
import './Game.css'
import BetPanel from '../../Components/BetPanel/BetPanel'

export default function Game({user_data}) {
  const [data, setData] = useState({});
  const [currentBet, setBet] = useState();
  const [betPanel, setBetPanel] = useState(false);
  const [betAlreadyExist, setBetAlreadyExist] = useState(false);
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

  async function getCurrentGameInfo(game_slug, username){
    return await axios.get(process.env.REACT_APP_API_URL+'/games/'+game_slug+'/'+user_data._id+'/'+username)
      .then(res => {
        console.log(res.data)
        setData({currentMatch: res.data.currentMatch, accountInfo: res.data.accountInfo, matchDetails: res.data.matchDetails})
        if(res.data.bet){
          setBet(res.data.bet);
          setBetAlreadyExist(true);
        }
      })
      .catch(err => console.error(err))
  }

  return (
    <div>
        {data.accountInfo ? (
          <div>
            <h1>{data.accountInfo.overview.name} {data.accountInfo.overview.summonerLevel}</h1>
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
                  <BetPanel slug={slug} user_id={user_data._id} match_id={data.currentMatch.gameId} setBet={setBet} setBetAlreadyExist={setBetAlreadyExist} />
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
              <p key={index}>- {req.label} : {typeof req.value === "boolean" ? 'Yes' : req.value}</p>
            ))}
            <p>Put : {currentBet.coin_put} (x{currentBet.multiplier}) </p>
            <p>Potential gain : {currentBet.coin_put * currentBet.multiplier}</p>
        </div>
        ) : ''}
    </div>
  )
}