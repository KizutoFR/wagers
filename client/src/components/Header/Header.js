import React, { useEffect, useState } from "react";
import Emitter from '../../services/Emitter';
import './Header.css';
import Lang from "../Lang/Lang";
import { useTranslation } from "react-i18next";

export default function Header({user_data}) {
  const [coins, setCoins] = useState(0);
  const { t } = useTranslation();
  
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  useEffect(() => {
    if(user_data){
      setCoins(user_data.coins)
      Emitter.on('UPDATE_COINS', (val) => setCoins(val));
    }
    return () => {
      Emitter.off('UPDATE_COINS')
    }
  }, [user_data]);

  return (
	<div className={click ?"header fixed" : "header"}>
		<div className="logo-nav">
			<div className="logo-container">
				<a href="/dashboard">
					<img src="images/logo.svg" className="logo-header" />
				</a>
			</div>

			<div className={click ? "nav-options active" : "nav-options"}>
				<div className="option" onClick={closeMobileMenu}>
					<a href="/dashboard">{t('header.dashboard')}</a>
				</div>
				<div className="option" onClick={closeMobileMenu}>
					<a href="/pass">{t('header.battlepass')}</a>
				</div>
				<div className="option" onClick={closeMobileMenu}>
					<a href="/shop">{t('header.shop')}</a>
				</div>
				<div className="option" onClick={closeMobileMenu}>
					<a href="/about">{t('header.how-it-works')}</a>
				</div>
				<div className="option" onClick={closeMobileMenu}>
					<a href="/contact">{t('header.contact')}</a>
				</div>
				<div className="container-right">
					{/* <div className="container-right"> */}
						<Lang/>
						<div className="banner-left" onClick={closeMobileMenu}>
							<button>{t('header.make-a-bet')}</button>
						</div>
						<div className="coins">
							{coins}
							<img className="coins-piece" src="/images/PIEPECES.svg" alt="coins icon" />
							<div onClick={closeMobileMenu}>
								<img src="/images/plus-solid.svg" alt="plus icon" />
							</div>
						</div>
						<div className="pdp" onClick={closeMobileMenu}>
							<a href={`/profil`}><img src="/images/PP.svg" alt="profile picture"/></a>
						</div>
					{/* </div> */}
				</div>
			</div>

		</div>
		
		
		
		<div className="mobile-menu" onClick={handleClick}>
			{click ? (
				<img src="/images/x.svg" className="menu-icon" />
			) : (
				<img src="/images/menu.svg" className="menu-icon" />
			)}
		</div>
	</div>

		)
	}