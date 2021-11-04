import React, {useEffect,useState} from "react";
import {useParams} from 'react-router-dom';
import axios from 'axios';
import { SLUG } from '../../utils/config.json'

export default function Game({user_data}) {
  const [data, setData] = useState({});
  const {slug} = useParams();

  useEffect(() => {
    if(SLUG.includes(slug)){
      if(user_data){
        const linked = user_data.linked_account.find(element => element.account_type.slug === slug)
        getCurrentGameInfo(linked.username);
      }
    } else {
      window.location.replace('/dashboard')
    }
  }, [user_data, slug])

  async function getCurrentGameInfo(username){
    return await axios.get(process.env.REACT_APP_API_URL+'/games/'+slug+'/'+username)
      .then(res => {
        console.log(res.data)
        setData(res.data)
      })
  }

  const getParticipantsData = () => {
    return (
      data.currentMatch.participants.forEach(part => {
        console.log(part.summonerName)
        return <p>ok</p>
      })
    )
  }

  return (
    <div>
        {data.accountInfo ? <h1>{data.accountInfo.overview.name} {data.accountInfo.overview.summonerLevel}</h1> : <p>Loading...</p>}
        {data.accountInfo ? data.accountInfo.rank.map((element, index) => (
          <div key={index}>
            <p>- {element.queueType}:</p>
            <img src={"https://wagers.fr/assets/ranks/Emblem_"+element.tier+".png"} />
          </div>
        )) : <p>Loading...</p>}
        {data.currentMatch ? (
          <div>
            <p>{data.currentMatch.gameMode} {data.currentMatch.gameType}</p>
            {data.currentMatch.participants.map((part, num) => (
              <div key={num}>
                <img src={`http://ddragon.leagueoflegends.com/cdn/11.21.1/img/champion/${part.championName}.png`} />
                <img src={"https://wagers.fr/assets/ranks/Emblem_"+part.rank+".png"} style={{width: 120+'px', height: 120+'px'}} />
                <p>{part.teamId} {part.summonerName}</p>
              </div>
            ))}
          </div>
        ) : <p>Aucune partie en cours</p>}
    </div>
  )
}