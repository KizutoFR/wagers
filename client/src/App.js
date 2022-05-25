import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { updateUser, useAuthDispatch, useAuthState } from "./context/Auth";
import './App.css';

import Contact from './pages/Contact/Contact.js'
import Login from './pages/Login/Login.js';
import Homepage from './pages/Homepage/Homepage.js';
import Register from './pages/Register/Register.js';
import Dashboard from './pages/Dashboard/Dashboard.js';
import ProfilUser from './pages/ProfilUser/ProfilUser.js';
import BattlePass from './pages/BattlePass/BattlePass.js';
import ProfilGlobal from './pages/ProfilGlobal/ProfilGlobal';
import Header from './components/Header/Header';
import axios from './utils/axiosconfig';
import Footer from './components/Footer/Footer';

import AuthRoute from './components/Route/AuthRoute';
import UnAuthRoute from './components/Route/UnAuthRoute';

export default function App() {
  const auth = useAuthState();
  const dispatch = useAuthDispatch();
  const location = useLocation();

  useEffect(() => {
    if (auth.auth_token) {
      axios.get(process.env.REACT_APP_API_URL + '/users/'+ auth.user._id, auth.config)
        .then((res) => {
          updateUser(dispatch, {user: res.data.user});
        })
    }
  }, [])

  const displayHeader = () => {
    const routes = ['login', 'register'];
    let valid = true;
    for(const route of routes) {
      if (location.pathname.includes(route)) valid = false
    }
    return valid;
  }

  return (
    <div>
      {displayHeader() && <Header />}
      <Routes>
        <Route exact path="/" element={<Homepage />} />
        <Route element={<AuthRoute redirect="/login" />}>
          <Route exact path='/dashboard' element={<Dashboard />} />
          <Route exact path="/profil/:id" element={<ProfilGlobal />} />
          <Route exact path="/profil" element={<ProfilUser />} />
          <Route exact path="/pass" element={<BattlePass />} />
          <Route exact path="/contact" element={<Contact />} />
        </Route>
        <Route element={<UnAuthRoute redirect="/" />}>
          <Route exact path='/login' element={<Login/>} />
          <Route exact path='/register' element={<Register/>} />
        </Route>
      </Routes>
      <Footer/>
    </div>
  )
}