import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import { headers } from './utils/config';

export default function App() {
  const auth = useAuthState();
  const dispatch = useAuthDispatch();

  useEffect(() => {
    if (auth.auth_token) {
      axios.get(process.env.REACT_APP_API_URL + '/users/'+ auth.user._id, auth.config)
        .then((res) => {
          updateUser(dispatch, {user: res.data.user});
        })
    }
  }, [])

  return (
    <div>
      {auth.auth_token && <Header /> }
      <BrowserRouter>
        <Routes>
          <Route element={<AuthRoute redirect="/login" />}>
            <Route exact path="/" element={<Homepage />} />
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
      </BrowserRouter>
      {auth.auth_token && <Footer/>}
    </div>
  )
}