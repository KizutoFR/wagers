import React, { useEffect, useState } from "react";
import Emitter from '../../services/Emitter';
import './Header.css';

import SearchBar from "../SearchBar/SearchBar";

export default function Header({user_data}) {
  const [coins, setCoins] = useState(0);
  
  useEffect(() => {
    if(user_data){
      setCoins(user_data.coins)
      Emitter.on('UPDATE_COINS', (val) => setCoins(val));
    }
    return () => {
      Emitter.off('UPDATE_COINS')
    }
  }, [user_data])

  return (
    <div className="container">
      <div className="logo"></div>
      {user_data ? (<SearchBar user_data={user_data} />) : ''}
      <p>{coins} coins</p>
    </div>
  )
}