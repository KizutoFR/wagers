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
				<div className="logo">
					<img src="/images/logo.svg" alt="logo" />
				</div>
				<a href="#">Comment ça marche ?</a>
				<a href="#">Récompenses</a>
				<a href="#">Contact</a>
			{/* {user_data ? (<SearchBar user_data={user_data} />) : ''} */}
		 	</div>
		 	<div className="container-right">
				<div className="banner-left">
					<button>MAKE A BET</button>
				</div>
				<div className="coins">
					{coins}
					<img className="coins-piece" src="images/PIEPECES.svg" alt="coins icon" />
					<div>
						<img src="images/plus-solid.svg" alt="plus icon" />
					</div>
				</div>
				<div className="pdp">
					<a href="#"><img src="images/PP.svg" alt="profile picture"/></a>
				</div>
			</div>
		</div>
		)
	}