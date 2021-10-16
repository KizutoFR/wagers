import React, {useContext, useEffect, useState} from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import './App.css';
import jwt_decode from "jwt-decode";

import Login from './pages/Login/Login.js';
import Homepage from './pages/Homepage/Homepage.js';
import Register from './pages/Register/Register.js';
import axios from "axios";
import {AuthContext} from "./context/AuthContext";

async function getUserIfAuthToken(user_id) {
  return await axios.get(process.env.REACT_APP_API_URL+'/users/verify-token/'+user_id).then(res => res.data.user);
}

async function fetchUserData(user_id) {
  return await axios.get(process.env.REACT_APP_API_URL+'/users/'+user_id).then(res => res.data.user);
}

async function removeUserAuthToken(user_id) {
  return await axios.delete(process.env.REACT_APP_API_URL+'/users/logout', {id: user_id}).then(() => true);
}

function App() {
  const [user, setUser] = useState(null);
  let { token } = useContext(AuthContext);
  if(!token) {
    token = localStorage.getItem('wagers_auth_token');
  }

  useEffect(() => {
    if (token) {
      const decryptedToken = jwt_decode(token);
      const currentDate = new Date();
      const expDate = new Date(decryptedToken.exp * 1000);
      if (currentDate <= expDate) {
        fetchUserData(decryptedToken.user_id).then(res => {
          if(res.auth_token === token) {
            setUser(res);
          }
        });
      } else {
        removeUserAuthToken(decryptedToken.user_id).then(() => {
          setUser(null);
          token = null;
          localStorage.removeItem('wagers_user_id');
          localStorage.removeItem('wagers_auth_token');
        });
      }
    } else {
      const user_id = localStorage.getItem('wagers_user_id');
      if (user_id) {
        getUserIfAuthToken(user_id).then(res => {
          if(res) {
            localStorage.setItem('wagers_auth_token', res.auth_token);
            token = res.auth_token;
            setUser(res.user);
          }
        })
      }
    }
  }, [token])

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          {token ? <Homepage user={user} /> : <Redirect to="/login" />}
        </Route>
        <Route path="/login">
          {token ? <Redirect to="/" user={user} /> : <Login />}
        </Route>
        <Route path="/register">
          {token ? <Redirect to="/" user={user} /> : <Register /> }
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
