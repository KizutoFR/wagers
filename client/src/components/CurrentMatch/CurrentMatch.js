import React from "react";
import './CurrentMatch.css'

export default function CurrentMatch({currentMatch, linkedUsername}) {
 

  return (
    <div style={{height: "100%"}}>
        {currentMatch && currentMatch.participants ? (
          <div className="match-container">
            <video muted autoPlay loop className="ongoing-match" width={500} height={700}>
              <source src="/videos/sword.webm" type="video/webm" />
              Sorry, your browser doesn't support embedded videos.
            </video>
            {currentMatch.participants.map((part, index) => (
              <div key={index} className={(part.summonerName === linkedUsername ? 'match-item active' : 'match-item')}>
                  <div className="champ-banner" style={{backgroundImage: `url('http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${part.championName}_0.jpg')`}}>
                    <div className="summoner-pic">
                      <img src={`http://ddragon.leagueoflegends.com/cdn/11.24.1/img/profileicon/${part.profileIconId}.png`} alt="game profil icon" />
                      <img src={"images/ranks/Emblem_"+part.rank+".png"} alt='rank' className="rank"/>
                    </div>
                    <p>{part.summonerName}</p>
                  </div>
              </div>
            ))}
          </div>
        ) : <p className="no-match">Aucune partie en cours</p>}
    </div>
  )
}