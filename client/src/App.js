import React, {useEffect, useState} from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import './App.css';
import jwt_decode from "jwt-decode";
import axios from "axios";

import Login from './pages/Login/Login.js';
import Homepage from './pages/Homepage/Homepage.js';
import Register from './pages/Register/Register.js';
import Dashboard from './pages/Dashboard/Dashboard.js'
import ProfilUser from './pages/ProfilUser/ProfilUser.js'
import ProfilGlobal from './pages/ProfilGlobal/ProfilGlobal';
import ModifUser from './pages/ModifUser/ModifUser';
import Header from './components/Header/Header';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('wagers_auth_token'));

  async function fetchUserData(user_id) {
    return await axios.get(process.env.REACT_APP_API_URL+'/users/'+user_id).then(res => res.data.user);
  }

  useEffect(() => {
    if(token){
      try {
        const decryptedToken = jwt_decode(token);
        const currentDate = new Date();
        const expDate = new Date(decryptedToken.exp * 1000);
        if (currentDate <= expDate) {
          fetchUserData(decryptedToken.user_id)
              .then(res => {
                setUser(res);
              })
              .catch(() => {
                setUser(null)
                setToken(null);
                localStorage.removeItem('wagers_auth_token');
              })
        } else {
          setUser(null)
          setToken(null);
          localStorage.removeItem('wagers_auth_token');
        }
      } catch(err) {
        setUser(null);
        setToken(null);
        localStorage.removeItem('wagers_auth_token');
      }
    }
  }, [token])

  useEffect(() => {
    if(user){
      console.log("user updated", user);
    }
  }, [user])

  return (
    <div>
      {token && <Header user_data={user} /> }
      <BrowserRouter>
            <Switch>
              <Route exact path="/">
                <Homepage user_data={user}/>
              </Route>
              <Route exact path="/dashboard">
                {token ? <Dashboard user_data={user} setToken={setToken}/> : <Redirect to="/login" />}
              </Route>
              <Route exact path="/login">
                {token ? <Redirect to="/" user_data={user}/> : <Login setToken={setToken} />}
              </Route>
              <Route exact path="/register">
                {token ? <Redirect to="/" user_data={user}/> : <Register />}
              </Route>
              <Route exact path="/profil/:id">
                {token ? <ProfilGlobal logged_user={user} /> : <Redirect to ='/login'/>}
              </Route>
              <Route exact path="/profil">
                {token ? <ProfilUser user_data={user}/> : <Redirect to ='/login' />}
              </Route>
              <Route exact path="/update">
                {token ? <ModifUser user_data={user} setUser={setUser}/> : <Redirect to ='/login' />}
              </Route>
            </Switch>
      </BrowserRouter>
    </div>
  )
}