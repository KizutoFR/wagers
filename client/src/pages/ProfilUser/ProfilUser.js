import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import Lang from "../../components/Lang/Lang";
import './ProfilUser.css';
import {Chart as Stat} from 'react-chartjs-2';
import Chart from 'chart.js/auto'
import ProfilContent from './parts/ProfilContent';
import ProfilUpdate from './parts/ProfilUpdate';

export default function ProfilUser({user_data, setToken, setUser}){
    const [requestList, setRequestList] = useState([]);
    const [modifying, setModifying] = useState(false);
    const { t } = useTranslation();
    
    const [token, setToken] = useState(localStorage.getItem('wagers_auth_token'));
    const [user, setUser] = useState(null);
    const categories = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const state = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
        datasets: [
          {
            label: 'Coins',
            fill: false,
            lineTension: 0.5,
            backgroundColor: '#B33CED',
            borderColor: '#F970FE',
            borderWidth: 3,
            data: [65, 59, 160, 56, 52, 46, 1, 90, 43, 12, 120, 86]
            
          }
        ]
      }

    useEffect(() => {
        if (user_data) {
            getPendingRequest(user_data._id)
        }
    }, [user_data])

    const _logout = () => {
        setToken(null);
        localStorage.removeItem('wagers_auth_token');
    }

    const getPendingRequest = async (id) => {
        await axios.get(process.env.REACT_APP_API_URL+'/friends/requests/list/'+id).then(res => setRequestList(res.data.list))
    }

    return (
        <div className="wrapperProfil">
            {user_data ? (
                <div className="containerProfil">
                    <div className="banniere">
                        <div className='bannierefondu'></div>
                        <div className='barredexperience'></div>
                        <div className="imageprofilrelative">
                            <div className="imageprofilabsolute">
                                <img src="/images/rl_thumbnail.jpg"/>
                            </div>
                            <div className="niveaurelative">
                                <p>99</p>
                            </div> 
                        </div>
                    </div> 
                    <div className="containerProfilInfo">
                        <h2>{user_data.username}</h2>
                        <div className="containerProfilInfo1">
                            <p onClick={() => setModifying(!modifying)}>{!modifying ? 'Modifier le profile' : 'Annuler'}</p>
                            <button onClick={_logout}>Déconnection</button>
                        </div>
                    </div>
                    {!modifying ? <ProfilContent user_data={user_data} /> : <ProfilUpdate user_data={user_data} setUser={setUser} />}
               </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    )
}