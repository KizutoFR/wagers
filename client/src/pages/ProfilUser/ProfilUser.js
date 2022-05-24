import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from "react-i18next";
import './ProfilUser.css';
import ProfilContent from './parts/ProfilContent';
import ProfilUpdate from './parts/ProfilUpdate';
import { headers } from '../../utils/config';
import { useAuthState, logout, useAuthDispatch } from '../../context/Auth';

export default function ProfilUser(){
    const [requestList, setRequestList] = useState([]);
    const [modifying, setModifying] = useState(false);
    const {user} = useAuthState();
    const dispatch = useAuthDispatch();
    const { t } = useTranslation();

    useEffect(() => {
        getPendingRequest(user._id)
    }, [])

    const _logout = () => {
        logout(dispatch);
    }

    const getPendingRequest = async (id) => {
        await axios.get(process.env.REACT_APP_API_URL+'/friends/requests/list/'+id, headers).then(res => setRequestList(res.data.list))
    }

    return (
        <div className="wrapperProfil">
            {user ? (
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
                        <h2>{user.username}</h2>
                        <div className="containerProfilInfo1">
                            <p onClick={() => setModifying(!modifying)}>{!modifying ? t('profil.modif') : t('profil.cancel')}</p>
                            <button onClick={_logout}>{t('profil.logout')}</button>
                        </div>
                    </div>
                    {!modifying ? <ProfilContent /> : <ProfilUpdate />}
               </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    )
}