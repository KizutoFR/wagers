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
        console.log(res.data);
        setData(res.data)
      })
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
        {data.matchInfo ? <p>{data.matchInfo.gameMode} {data.matchInfo.gameType}</p> : <p>Aucune partie en cours</p>}
    </div>
  )
}