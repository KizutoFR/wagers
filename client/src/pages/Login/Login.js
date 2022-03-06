import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import { FaAt,  FaKey} from 'react-icons/fa';
import axios from 'axios';
import './Login.css';
import { useTranslation } from "react-i18next";
import Lang from "../../components/Lang/Lang";

export default function Login({setToken}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { t } = useTranslation();

  const changePassword = (e) => {
    setPassword(e.target.value);
  }

  const changeEmail = (e) => {
    setEmail(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(process.env.REACT_APP_API_URL+'/users/login',{email,password});
      if (res.data.success) {
          localStorage.setItem('wagers_auth_token', res.data.token);
          setToken(res.data.token)
      } else {
          setErrorMessage(res.data.message);
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <div className="login-container">
      <div className="form-container">
      <img src="/images/logo.svg" alt="logo"/>
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
            <Lang/>
            <button data-action="submit" onClick={e => handleSubmit(e)}>{t('login.log-in')}</button>
          </div>
        </form>
      </div>
      <div className="login-video-container">
        <video autoPlay loop muted>
          <source src='/videos/leagues.mp4' type="video/mp4" />
        </video>
      </div>
    </div>
  )
}