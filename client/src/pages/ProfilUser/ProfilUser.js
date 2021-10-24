import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ProfilUser({user_data}){
    const [requestList, setRequestList] = useState([]);

    useEffect(() => {
        console.log(user_data)
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
                    <p>{user_data.firstname}</p>
                    <p>{user_data.lastname}</p>
                    <p>{user_data.username}</p>
                    <p>{user_data.email}</p>
                    <p>{user_data.coins}</p>

                    <h3>Friendslist</h3>
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
                        <p>No friends here...</p>
                    )}
                    <h3>Request list</h3>
                    {requestList.length > 0 ? (
                        requestList.map((elem, index) => 
                            <p key="index"><a href={'/profil/'+elem.from._id}>{elem.from.username}</a></p>
                        )
                    ) : (
                        <p>No friend requests...</p>
                    )}
               </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    )
}