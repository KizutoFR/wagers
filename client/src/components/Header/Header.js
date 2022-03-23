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
					<div className="links">
						<a href="/dashboard">{t('header.dashboard')}</a>
						<a href="/pass">{t('header.battlepass')}</a>
						<a href="/shop">{t('header.shop')}</a>
						<a href="/about">{t('header.how-it-works')}</a>
						<a href="/contact">{t('header.contact')}</a>
					</div>
					{/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
						<path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"/>
					</svg> */}
				</div>
				<div className="container-right">
					<Lang/>
					<div className="banner-left">
						<button>{t('header.make-a-bet')}</button>
					</div>
					<div className="coins">
						{coins}
						<img className="coins-piece" src="/images/PIEPECES.svg" alt="coins icon" />
						<div>
							<img src="/images/plus-solid.svg" alt="plus icon" />
						</div>
					</div>
					<div className="pdp">
						<a href={`/profil`}><img src="/images/PP.svg" alt="profile picture"/></a>
					</div>
				</div>
			</div>
		)
	}