import React, { useEffect, useState } from 'react';
import {useParams, Redirect, useHistory } from 'react-router-dom';
import axios from 'axios';

export default function ProfilGlobal({ logged_user }){
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [alreadyRequested, setAlreadyRequested] = useState(false)
  const [alreadyFriend, setAlreadyFriend] = useState(false)
  let history = useHistory();

  useEffect(() => {
    getUserData(id)
    isAlreadyRequested(logged_user._id, id);
  }, [id])

  async function getUserData(id) {
    return await axios.get(process.env.REACT_APP_API_URL+'/users/'+id).then(res => {
      setUserData(res.data.user)
    }).catch(() => history.push('/dashboard'))
  }

  async function isAlreadyRequested(from, to) {
    return await axios.get(process.env.REACT_APP_API_URL+'/friends/requested/' + from + '/' + to).then(res => {
      setAlreadyRequested(res.data.requested);
      setAlreadyFriend(res.data.accepted);
    })
  }

  async function sendFriendRequest() {
    return await axios.post(process.env.REACT_APP_API_URL+'/friends/request', {from: logged_user._id, to: id}).then(res => {
      console.log(res.data.message)
      setAlreadyRequested(true);
    })
  }

  async function removeFromFriends() {
    return await axios.post(process.env.REACT_APP_API_URL+'/friends/remove', {from: logged_user._id, to: id}).then(res => {
      console.log(res.data.message)
      setAlreadyFriend(false);
      setAlreadyRequested(false);
    })
  }

  if (id === logged_user._id) {
    return <Redirect to="/profil" />
  }

  return (
    (userData ? <div>
      <h1>Profil</h1>
      <p>{userData.firstname}</p>
      <p>{userData.lastname}</p>
      <p>{userData.username}</p>
      <p>{userData.email}</p>
      <p>{userData.coins}</p>
      {!alreadyRequested ? (alreadyFriend ? <button onClick={removeFromFriends}>Unfriend</button>  : <button onClick={sendFriendRequest}>Send friend request</button> ) : <button disabled>Pending request</button>}
  </div> : <p>Loading....</p>)
  )
}