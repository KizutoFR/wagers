import React, {useEffect, useState } from 'react';
import axios from 'axios';
import Emitter from '../../services/Emitter';
import { SLUG } from '../../utils/config.json'
import './Dashboard.css';
import Swal from 'sweetalert2'
import { useTranslation } from "react-i18next";

import CurrentBet from '../../components/CurrentBet/CurrentBet';
import CurrentMatch from '../../components/CurrentMatch/CurrentMatch';
import BetPanel from '../../components/BetPanel/BetPanel';
import Challenge from '../../components/Challenge/Challenge';

export default function Dashboard({ user_data, setToken }) {
    const [data, setData] = useState({});
    const [currentBet, setBet] = useState();
    const [scoreboard, setScoreboard] = useState([]);
    const [challenges, setChallenges] = useState([]);
    const [slug, setSlug] = useState('league-of-legends')
    const [betPanel, setBetPanel] = useState(false);
    const [linkedUsername, setLinkedUsername] = useState('');
    const { t } = useTranslation();
    const DEFAULT_LOOSE_XP = 25;

    useEffect(async () => {
        Emitter.on('CLOSE_BET_PANEL', () => setBetPanel(false));
        if(SLUG.includes(slug)){
            if(user_data){
                await getScoreBoard()
                const linked = user_data.linked_account.find(element => element.account_type.slug === slug)
                setLinkedUsername(linked.username);
                getChallenges(slug);
                await getCurrentGameInfo(slug, linked.username);
            }
        } else {
            setSlug('league-of-legends');
        }
        return () => {
            Emitter.off('CLOSE_BET_PANEL');
        }
    }, [user_data, slug]);

    const getChallenges = (slug) => {
        axios.get(process.env.REACT_APP_API_URL+'/challenges/'+slug).then(res => {
            setChallenges(res.data.challenges);
        })
    }

    async function getCurrentGameInfo(game_slug, username) {
        return await axios.get(process.env.REACT_APP_API_URL+'/games/'+game_slug+'/'+username).then(res => {
            setData({currentMatch: res.data.currentMatch, accountInfo: res.data.accountInfo, matchDetails: res.data.currentMatch.matchDetails, opgg:res.data.opgg})
            if(res.data.bet){
                setBet(res.data.bet);
            }
        })
        .catch(err => console.error(err))
    }

    async function getScoreBoard(){
        return await axios.get(process.env.REACT_APP_API_URL+'/users/scoreboard').then(res => {
            setScoreboard(res.data.users)
        })
    }

    // const handleLogout = (e) => {
    //     e.preventDefault();
    //     localStorage.removeItem('wagers_auth_token')
    //     setToken(null)
    // }

    const updateChallengesProgress = (id, value) => {
        axios.post(process.env.REACT_APP_API_URL+'/challenges/progress', {challenge_id: id, value});
        const newChallenges = challenges.map(chall => {
            chall.progress = (chall.progress || 0) + value;
            return chall;
        })
        setChallenges(newChallenges);
    }

    const checkChallengeProgress = (stats) => {
        for(const challenge of challenges) {
            switch(challenge.type) {
                case "MATCH_WIN":
                    updateChallengesProgress(challenge._id, 1);
                    break;
                case "DESTROYED_TURRET":
                    // updateChallengesProgress(challenge._id, stats.kills);
                    break;
                case "KILLS_AMOUNT":
                    updateChallengesProgress(challenge._id, stats.kills);
                    break;
                default:
                    break;
            }
        }
    }

    const verifyBetWin = async () => {
        let valideBet = true;
        const linked = user_data.linked_account.find(element => element.account_type.slug === slug)
        await getCurrentGameInfo(slug, linked.username);
        if(data.matchDetails && data.matchDetails.info.gameId === currentBet.match_id) {
            if(currentBet.account_id === linked.value) {
                checkChallengeProgress(data.matchDetails.info.participants);
                for(const r of currentBet.requirements) {
                    switch(r) {
                        case "MATCH_WIN":
                            if(r.value !== data.matchDetails.info.participants.win) valideBet = false;
                            break;
                        case "DESTROYED_TURRET":
                            break;
                        case "KILLS_AMOUNT":
                            if(r.value > data.matchDetails.info.participants.kills) valideBet = false;
                            break;
                        default:
                            valideBet = false;
                            break;
                    }
                }
            } else {
                valideBet = false;
            }
          if(valideBet){
            await axios.post(process.env.REACT_APP_API_URL+'/users/update-wallet', {user_id: user_data._id, new_coins: user_data.coins + Math.ceil(currentBet.coin_put * currentBet.multiplier)});
            await axios.post(process.env.REACT_APP_API_URL+'/users/update-exp', {user_id: user_data._id, new_exp: user_data.exp + (100 * currentBet.requirements.length)});
            user_data.exp = user_data.exp + (100 * currentBet.requirements.length);
            user_data.coins = user_data.coins + Math.ceil(currentBet.coin_put * currentBet.multiplier);
            Emitter.emit('UPDATE_COINS', user_data.coins);
            Swal.fire({
              title: 'You won your bet!',
              text: `+${Math.ceil(currentBet.coin_put * currentBet.multiplier)} coins & +${100 * currentBet.requirements.length}xp`,
              icon: 'success',
              confirmButtonText: 'Ok'
            })
          } else {
            await axios.post(process.env.REACT_APP_API_URL+'/users/update-exp', {user_id: user_data._id, new_exp: user_data.exp + DEFAULT_LOOSE_XP});
            user_data.exp = user_data.exp + DEFAULT_LOOSE_XP;
            Swal.fire({
              title: 'You lost your bet :/',
              text: `-${currentBet.coin_put} coins & +${DEFAULT_LOOSE_XP}xp`,
              icon: 'error',
              confirmButtonText: 'Ok'
            })
          }
          await axios.post(process.env.REACT_APP_API_URL+'/games/bet/save', {bet_id: currentBet._id});
          setBet(null);
        } else {
          Swal.fire({
            title: 'Your match may not be completely ended',
            text: `Wait few minutes before trying again :)`,
            icon: 'warning',
            confirmButtonText: 'Ok'
          })
        }
      }

    // TODO: Mettre le loader
    if(!user_data || !scoreboard || !data) {
        return (
            <div>loading</div>
        )
    }

    return (
        <div className="dashboard-container">
            {betPanel ? <BetPanel slug={slug} user_data={user_data} match_id={data.currentMatch.gameId} setBet={setBet} summonerName={linkedUsername} /> : ""}
            <div className="dashboard-banner">
                <div className="banner-left">
                    <h1>{slug.split('-').join(' ')}</h1>
                    {data.currentMatch && data.currentMatch.participants && !currentBet ? <button onClick={() => setBetPanel(true)}>{t('header.make-a-bet')}</button> : <button style={{cursor: "not-allowed"}} disabled>{t('header.make-a-bet')}</button>}
                </div>
                <div className='video-banner'>
                    <video autoPlay loop muted>
                        <source src='/videos/leagues.mp4' type="video/mp4" />
                    </video>
                </div>
            </div>
            <div className="dashboard-body">
                <div className="dashboard-content">
                    <div>
                        <div className="dashboard-profile">
                            <div className="dashboard-profile-image">
                                <img src={"images/lol_thumbnail.jpg"} alt="game thumbnail" />
                                <div>
                                    <p>user_data.current_title</p>
                                </div>
                            </div>
                            <div className="dashboard-profile-footer">
                                <h3>{user_data.username}</h3>
                                <p>Level 50</p>
                            </div>
                            <div className="dashboard-profile-xp">
                                <div></div>
                            </div>
                        </div>
                        <div className="dashboard-game-selector">
                            <div>
                                <img src={"images/r6_selector.svg"} alt="game selector figure"/>
                            </div>
                            <div className="active">
                                <img src={"images/lol_selector.png"} alt="game selector figure"/>
                            </div>
                            <div>
                                <img src={"images/valorant_selector.svg"} alt="game selector figure"/>
                            </div>
                        </div>
                        <div className="dashboard-scoreboard">
                            <h2>{t('header.leaderboard')}</h2>
                            <ul className="scoreboard-filters">
                                <li className="active">{t('header.global')}</li>
                                <li>{t('header.year')}</li>
                                <li>{t('header.month')}</li>
                            </ul>
                            <ul className="scoreboard-list">
                                {scoreboard.map((u, index) => (
                                    <li key={u._id}>
                                        <p>#{index + 1} {u.username}</p>
                                        <p>
                                            {u.coins}
                                            <img src="images/PIEPECES.svg" alt="coins icon"/>
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div>
                        <div className="dashboard-separator">
                            <h3>challenges</h3>
                            <div className="separator separator-little"></div>
                            <p>durée limitée</p>
                        </div>

                        {/* TODO: Faire un composant pour les challenges quand implentés */}
                        <div className="challenges">
                        {challenges.length > 0 ? challenges.map((challenge, index) => (
                            <Challenge challenge={challenge} key={index} />
                        )) : (
                            <p>Aucun challenges disponible...</p>
                        )}
                        </div>

                        <div className="dashboard-separator">
                            <h3>{t('header.current-match')}</h3>
                            <div className="separator"></div>
                            {data.currentMatch && data.currentMatch.participants && !currentBet ? <button onClick={() => setBetPanel(true)}>{t('header.make-a-bet')}</button> : <button style={{cursor: "not-allowed"}} disabled>{t('header.make-a-bet')}</button>}
                        </div>

                        <div className="dashboard-match">
                            <div className="match-background"></div>
                            <div className="match-details">
                                <div className="details">
                                    <CurrentMatch currentMatch={data.currentMatch} linkedUsername={linkedUsername} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="dashboard-row">
                    <div>
                        <div className="dashboard-separator">
                            <h3>{t('header.current-bet')}</h3>
                            <div className="separator"></div>
                        </div>
                        <CurrentBet current_bet={currentBet} verifyBetWin={verifyBetWin} />
                    </div>
                    <div>
                        <div className="dashboard-separator">
                            <h3>{t('header.shop')}</h3>
                            <div className="separator"></div>
                        </div>
                        <div className="dashboard-shop">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}