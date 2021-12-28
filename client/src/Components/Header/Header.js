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
			<div className="container-left">
				<div className="logo"><img src="/images/logo.svg"></img></div>
				<div className=""><a href="">Comment ça marche ?</a></div>
				<div className=""><a href="">Récompenses</a></div>
				<div className=""><a href="">Contact</a></div>
			{/* {user_data ? (<SearchBar user_data={user_data} />) : ''} */}
		 	</div>
		 	<div className="container-right">
				<div className="banner-left"> <button>PARIER</button></div>
				<div className="coins">
					{coins}
					<img src="images/PIEPECES.svg"></img>
					<span className="plus">
						<a href=""><img src="images/plus-solid.svg"></img></a>
					</span>
				</div>
				<div className="pdp">
					<a href=""><img src="images/PP.svg"></img></a>
				</div>
			</div>
		</div>
		)
	}