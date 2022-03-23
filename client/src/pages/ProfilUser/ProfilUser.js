import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import Lang from "../../components/Lang/Lang";
import './ProfilUser.css';


export default function ProfilUser({user_data}){
    const [requestList, setRequestList] = useState([]);
    const { t } = useTranslation();
    
    const [token, setToken] = useState(localStorage.getItem('wagers_auth_token'));
    const [user, setUser] = useState(null);


    function _logout(){
        if (token){
            setUser(null);
            setToken(null);
            localStorage.removeItem('wagers_auth_token');
            console.log("Log out");
            window.location.reload();
        } else {
            console.log("Vous ne pouvez pas vous déconnecter car vous n'êtes même pas connecté");
        }
    }

    useEffect(() => {
        if (user_data) {
            getPendingRequest(user_data._id)
        }
    }, [user_data],_logout)

    async function getPendingRequest(id) {
        await axios.get(process.env.REACT_APP_API_URL+'/friends/requests/list/'+id).then(res => setRequestList(res.data.list))
    }

    return (
        <div className="body">
            {user_data ? (
                <div className="containerProfil">
                    <div className="banniere">
                    
                        <div className='bannierefondu'>
                        </div>
                    </div> 
                        <div className='barredexperience'>
                    
                        </div>
                    <div className="imageprofilrelative">
                        <div className="imageprofilabsolute">
                            <img src="/images/rl_thumbnail.jpg"/>
                        </div>
                        <div className="niveaurelative">
                            <img src="/images/rl_thumbnail.jpg"/>
                        </div>
                        
                    </div>
                    <div className="containerProfilInfo">
                        <h2><p>{user_data.username}</p></h2>
                        <div className="containerProfilInfo1">
                            <a href="./ModifUser">Edit Profil</a>
                        </div>
                    </div>
                    <div className="statsfirst">
                        <div className="statsf">
                            <h3>STATISTIQUES</h3>
                        </div>
                        <div className="statsline">
                        </div>
                    </div>
                    <div className="stats">
                        <div className="statsgauche">
                            <div className="statsgauchehaut">
                            
                                <div className="statsgauchehaut1">
                                    <div className="statsgauchehaut1rond">
                                        <h3>65<span>%</span></h3>
                                        <h4>de victoire </h4>
                                        <div className="statsgauchehaut1carré">
                                        </div>
                                     </div>
                                </div>

                            </div>
                            <div className="statsgauchebas">
                                <img className="imggauchebas" src="/images/vague2.svg"/>
                                <div className="statsgauchebas1">
                                    <img src="/images/award.svg"/>
                                    <div className="statsgauchebas2">
                                        <h2>100</h2>
                                        <p>Total Wins</p>
                                    </div>
                                   
                                </div>
                            </div>
                        </div>
                        <div className="statsdroit">
                             <h3>Balance Evolution</h3>
                         </div>
                    </div>
                    <div className="betfirst">
                        <div className="bet">
                            <h3>BET HISTORY</h3>
                        
                        </div>
                        <div className="betline">
                        </div>
                    </div>
                    <div className="bethistory"> 
                      
                      <table cellspacing="0" cellpadding="0">
                          <thead>
	                        <tr>
                                <th>Date</th>
		                        <th>Game</th>
                                <th>Stack</th>
                                <th>Multiplier</th>
                                <th>Stats</th>
	                        </tr>
                        </thead>
                        <tbody>
	                        <tr>
                                <td>09/02/2022</td>
		                        <td>League of Legends</td>
                                <td>700</td>
                                <td>x1.5</td>
                                <td>Win</td>
	                        </tr>
                            <tr>
                                <td>09/02/2022</td>
		                        <td>League of Legends</td>
                                <td>750</td>
                                <td>x1.75</td>
                                <td>Loose</td>
	                        </tr>
                            <tr>
                                <td>09/02/2022</td>
		                        <td>League of Legends</td>
                                <td>750</td>
                                <td>x1.75</td>
                                <td>Loose</td>
	                        </tr>
                            <tr>
                                <td>09/02/2022</td>
		                        <td>League of Legends</td>
                                <td>700</td>
                                <td>x1.5</td>
                                <td>Win</td>
	                        </tr>
                        </tbody>
                      </table>
                      
                    </div>
               </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    )
}