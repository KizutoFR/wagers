import React, {useEffect,useState} from "react";
import {useParams} from 'react-router-dom';
import axios from 'axios';
import { SLUG } from '../../utils/config.json'
import './Game.css'
import BetPanel from '../../Components/BetPanel/BetPanel'

export default function Game({user_data}) {
  const [data, setData] = useState({});
  const [betList, setBetList] = useState([]);
  const [betPanel, setBetPanel] = useState(false);
  const [betAlreadyExist, setBetAlreadyExist] = useState(false);
  const {slug} = useParams();

  useEffect(() => {
    if(SLUG.includes(slug)){
      if(user_data){
        const linked = user_data.linked_account.find(element => element.account_type.slug === slug)
        getCurrentGameInfo(slug, linked.username);
        getBetList(slug, user_data._id);
      }
    } else {
      window.location.replace('/dashboard')
    }
  }, [user_data, slug])

  async function getCurrentGameInfo(game_slug, username){
    return await axios.get(process.env.REACT_APP_API_URL+'/games/'+game_slug+'/'+username)
      .then(res => {
        setData(res.data)
      })
  }

  async function getBetList(game_slug, user_id){
    return await axios.get(process.env.REACT_APP_API_URL+'/games/bet/'+game_slug+'/'+user_id)
      .then(res => {
        if(res.data.success){
          if (res.data.bet.length > 0) {
            setBetAlreadyExist(true)
          }
          setBetList(res.data.bet)
        }
      })

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
                  <BetPanel slug={slug} user_id={user_data._id} setBetList={setBetList} setBetPanel={setBetPanel} />
                ) : ''}
              </div>
            ) : ''}
            <p>{data.currentMatch.gameMode} {data.currentMatch.gameType}</p>
            <div className="match-container">
              {data.currentMatch.participants.map((part, num) => (
                <div key={num} className="match-item">
                  <img src={`http://ddragon.leagueoflegends.com/cdn/11.21.1/img/champion/${part.championName}.png`} />
                  <img src={"https://wagers.fr/assets/ranks/Emblem_"+part.rank+".png"} style={{width: 120+'px', height: 120+'px'}} />
                  <p>{part.teamId} {part.summonerName}</p>
                </div>
              ))}
            </div>
          </div>
        ) : <p>Aucune partie en cours</p>}
        /** TODO: Faire un composant Bet pour les paris */
        {betList.map((bet, index) => (
          <div key={index} style={{border: '1px solid black', padding: '10px'}}>
            <h4>Bet</h4>
            {bet.requirements.map((req, index) => (
              <p key={index}>- {req.label} : {typeof req.value === "boolean" ? 'Yes' : req.value}</p>
            ))}
            <p>Put : {bet.coin_put} (x{bet.multiplier}) </p>
            <p>Potential gain : {bet.coin_put * bet.multiplier}</p>
          </div>
        ))}
    </div>
  )
}