import React, {useEffect,useState} from "react";
import {useParams} from 'react-router-dom';
import axios from 'axios';

export default function Game({user_data}) {
  const [linkedAccountId, setLinkedAccountID] = useState(null);
  const [CurrentGameInfo, setCurrentGameInfo] = useState(null);
  const {slug} = useParams();
  async function getCurrentGameInfo(linkedAccountId){
    return await axios.get(process.env.REACT_APP_API_URL+'/games/'+slug+'/'+linkedAccountId).then(res =>{
      setCurrentGameInfo(res.data)
    })
  }

  useEffect(() => {
    if(user_data){
      setLinkedAccountID(user_data.linked_account.find(element => {
        console.log(element.account_type)
        return element.account_type.slug=== slug
      }))
      getCurrentGameInfo(linkedAccountId)
    }

}, [user_data])


  return (
    <div>
        {CurrentGameInfo}
    </div>
  )
}