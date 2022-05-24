import React from "react";
import { FaEye} from 'react-icons/fa';
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
                  <div className="champ-banner" style={{backgroundImage: `url('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${part.championName}_0.jpg')`}}>
                    <div className="summoner-pic">
                      {/* Patch a retrouver sur : https://developer.riotgames.com/docs/lol */}
                      <img src={`https://ddragon.leagueoflegends.com/cdn/12.9.1/img/profileicon/${part.profileIconId}.png`} alt="game profil icon" />
                      <img src={"images/ranks/Emblem_"+part.rank+".png"} alt='rank' className="rank"/>
                    </div>
                    <p>{part.summonerName}</p>
                    <a href={part.opgg} target="_blank">{part.summonerName}<FaEye className="currentmatch-icon" /></a>
                  </div>
              </div>
            ))}
          </div>
        ) : <p className="no-match">Aucune partie en cours</p>}
    </div>
  )
}