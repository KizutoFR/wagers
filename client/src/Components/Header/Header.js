import React, { useEffect, useState } from "react";
import Emitter from '../../services/Emitter';
import './Header.css';
import Lang from "../Lang/Lang";
import { useTranslation } from "react-i18next";

export default function Header({user_data}) {
  const [coins, setCoins] = useState(0);
  const { t } = useTranslation();
  
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
				<a href="#">{t('header.how-it-works')}</a>
				<a href="#">{t('header.rewards')}</a>
				<a href="#">{t('header.contact')}</a>
				<a href="#">{t('header.make-a-bet')}</a>
		 	</div>
		 	<div className="container-right">
				<Lang/>
					<div className="banner-left">
					<button>{t('header.make-a-bet')}</button>
					
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