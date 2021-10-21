import React from 'react';
export default function ProfilUser({user_data}){
    return (
        <div>
            <h1>Profil</h1>
            <p>{user_data.firstname}</p>
            <p>{user_data.lastname}</p>
            <p>{user_data.username}</p>
            <p>{user_data.email}</p>
            <p>{user_data.coins}</p>

            <h3>Friendslist</h3>
            {user_data.friends.length > 0 ? (
                user_data.friends.map((elem => 
                    elem.from._id == user_data._id ? (
                        <p><a href={'/profil/'+elem.to._id} >{elem.to.username}</a></p>
                    ) : (
                        <p><a href={'/profil/'+elem.from._id} >{elem.to.username}</a></p>
                    )
                ))
            ) : (
                <p>Aucun amis</p>
            )}
        </div>
    )
}