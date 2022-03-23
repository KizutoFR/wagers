import React, { useEffect, useState } from 'react';
import {useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

export default function ProfilGlobal({ logged_user }){
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [alreadyRequested, setAlreadyRequested] = useState(false)
  const [alreadyFriend, setAlreadyFriend] = useState(false)
  const [isSender, setIsSender] = useState(true);
  
  let history = useHistory();

  useEffect(() => {
    getUserData(id)
    if(logged_user) {
      if(logged_user._id !== id) {
        history.push('/profil')
      }
      isAlreadyRequested(logged_user._id, id);
    }
  }, [id, logged_user])

  async function getUserData(id) {
    return await axios.get(process.env.REACT_APP_API_URL+'/users/'+id).then(res => {
      setUserData(res.data.user)
    }).catch(err => console.error(err))
  }

  async function isAlreadyRequested(from, to) {
    return await axios.get(process.env.REACT_APP_API_URL+'/friends/requested/' + from + '/' + to).then(res => {
      setIsSender(res.data.sender === logged_user._id)
      setAlreadyRequested(res.data.requested);
      setAlreadyFriend(res.data.accepted);
    })
  }

  async function sendFriendRequest() {
    return await axios.post(process.env.REACT_APP_API_URL+'/friends/requests/create', {from: logged_user._id, to: id}).then(res => {
      setIsSender(true)
      setAlreadyRequested(true);
    })
  }

  async function removeFromFriends() {
    return await axios.post(process.env.REACT_APP_API_URL+'/friends/remove', {from: logged_user._id, to: id}).then(res => {
      setAlreadyFriend(false);
      setAlreadyRequested(false);
    })
  }

  async function acceptFriendRequest() {
    return await axios.post(process.env.REACT_APP_API_URL+'/friends/requests/update', {from: id, to: logged_user._id, accept: true}).then(res => {
      setAlreadyFriend(true);
      setAlreadyRequested(false);
    })
  }

  async function declineFriendRequest() {
    return await axios.post(process.env.REACT_APP_API_URL+'/friends/requests/update', {from: id, to: logged_user._id, accept: false}).then(res => {
      setAlreadyFriend(true);
      setAlreadyRequested(false);
    })
  }

  return (
    (userData ? (
      <div style={{color: '#fff'}}>
        <h1>Profil</h1>
        <p>{userData.firstname}</p>
        <p>{userData.lastname}</p>
        <p>{userData.username}</p>
        <p>{userData.email}</p>
        <p>{userData.coins}</p>
        {!alreadyRequested ? 
          (alreadyFriend ? 
            <button onClick={removeFromFriends}>Unfriend</button>  
          : <button onClick={sendFriendRequest}>Send friend request</button> ) 
        : isSender ? <button disabled>Pending request</button> : (
          <div>
            <button onClick={acceptFriendRequest}>Accept request</button>
            <button onClick={declineFriendRequest}>Decline request</button>
          </div>
        )}
      </div>
    ) : <p>Loading....</p>)
    
  )
}