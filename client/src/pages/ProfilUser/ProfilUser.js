import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import Lang from "../../components/Lang/Lang";

export default function ProfilUser({user_data}){
    const [requestList, setRequestList] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        if (user_data) {
            getPendingRequest(user_data._id)
        }
    }, [user_data])

    async function getPendingRequest(id) {
        await axios.get(process.env.REACT_APP_API_URL+'/friends/requests/list/'+id).then(res => setRequestList(res.data.list))
    }

    return (
        <div>
            {user_data ? (
                <div>
                    <h1>Profil</h1>
                    <p>{t('profilUser.firstname')} : {user_data.firstname}</p>
                    <p>{t('profilUser.lastname')} : {user_data.lastname}</p>
                    <p>{t('profilUser.username')} : {user_data.username}</p>
                    <p>{t('profilUser.email')} : {user_data.email}</p>
                    <p>{t('profilUser.coin')} : {user_data.coins}</p>

                    <h3>{t('profilUser.friendslist')}</h3>
                    {user_data && user_data.friends.length > 0 ? (
                        user_data.friends.map((elem, index) => 
                            <div key={index}>
                                {elem.from._id === user_data._id ? (
                                    <p><a href={'/profil/'+elem.to._id}>{elem.to.username}</a></p>
                                ) : (
                                    <p><a href={'/profil/'+elem.from._id}>{elem.from.username}</a></p>
                                )}
                            </div>
                        )
                    ) : (
                        <p>{t('profilUser.friendsLists')}</p>
                    )}
                    <h3>{t('profilUser.requestlist')}</h3>
                    {requestList.length > 0 ? (
                        requestList.map((elem, index) => 
                            <p key="index"><a href={'/profil/'+elem.from._id}>{elem.from.username}</a></p>
                        )
                    ) : (
                        <p>{t('profilUser.friendsRequest')}</p>
                    )}
                    <footer>
                    <Link to="/update">Modification</Link>
                    <br />
                    <Link to="/dashboard">Dashboard</Link>
                    </footer>
               </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    )
}