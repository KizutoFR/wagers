import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { FaAt,  FaKey} from 'react-icons/fa';
import axios from 'axios';
import './Login.css';
import { login, useAuthState, useAuthDispatch } from '../../context/Auth';
import { useTranslation } from "react-i18next";
import Lang from "../../components/Lang/Lang";

export default function Login({setToken}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAuthDispatch()
  const { loading, errorMessage } = useAuthState()

  const changePassword = (e) => {
    setPassword(e.target.value);
  }

  const changeEmail = (e) => {
    setEmail(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { email, password };
    try {
        const res = await login(dispatch, payload);
        if (!res) return;
        navigate('/dashboard');
    } catch(err) {
        console.error(err);
    }
  }

  return (
    <div className="login-container">
      <div className="form-container">
        <div className='logo'>
          <img src="/images/logo.svg" alt="logo"/>
        </div>
       {errorMessage !== '' ? <p className="error-message">{errorMessage}</p> : ''}
        <form>
          <div className="form-element">
            <input type="text" placeholder="Email" value={email} onChange={changeEmail} />
            <FaAt className="form-element-icon" />
          </div>
          <div className="form-element">
            <input type="password" placeholder="Password" value={password} onChange={changePassword} />
            <FaKey className="form-element-icon" />
          </div>      
          <div className="form-options">
            <Link to="/register">{t('login.register')}</Link>
            <button data-action="submit" onClick={e => handleSubmit(e)}>{t('login.log-in')}</button>
          </div>
        </form>
        <div className='login-lang'>
          <Lang/>
        </div>
      </div>
      <div className="login-video-container">
        <video autoPlay loop muted>
          <source src='/videos/leagues.mp4' type="video/mp4" />
        </video>
      </div>
    </div>
  )
}