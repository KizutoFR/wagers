import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import './Homepage.css';

const Homepage = () => {

    return (
        <div className ="home">
                <div className="Presentation">
                    <div className='presentationInnner'>
                        <div className="PresentationGauche">
                            <div className="PresentationGauchetxt">
                                <h1>WAGERS</h1>
                                Bet on your in-game performances to win coins
                                and be the one to dominate the leaderboard !
                            </div>
                            <div className="PresentationGauchebouton">
                                <Link to="/dashboard"><button>Get started</button></Link>
                            </div>
                        </div>
                        <div className="Presentationimg">
                            <img src="/images/presentation.svg" />
                        </div>
                    </div>
                </div>
                
                <div className="separator"></div>
           
                <div className="Presentation2">
                    <img className="bureau" src="/images/bureau.jpg" />
                </div>
                <div className="Presentation3">
                    <div className="Presentation3titre">
                        <h2>bet on</h2>
                        <h3>your skills</h3>
                    </div>
                    <div className='presentation3-wrapper'>
                        <div className="Presentation3imgtop">
                            <img className="gain" src="/images/svg_bet.svg" />
                        </div>
                        <div className="Presentation3imgbot">
                            <img className="profils" src="/images/profils.png" />
                        </div>
                    </div>
                </div>
                <div className="Prfil">
                    <div className="Profiltitre">
                        <h2>follow your</h2>
                        <h3>progress</h3>
                    </div>
                    <div className="Profilimgtop">
                        <img className="pfil" src="/images/pfil.png" />
                    </div>
                </div>
                 <div className="Yasuoimg">
                    <div className="Yasuoimg1">
                        <img className="yasuo" src="/images/yasuo.png" />
                    </div>
                </div>

        </div>
    )
}

export default Homepage;
