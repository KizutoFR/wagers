import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

export default function Login({setToken}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const changePassword = (e) => {
    setPassword(e.target.value);
  }

  const changeEmail = (e) => {
    setEmail(e.target.value);
  }

  const sendUserCredentials = async (credentials) => {
      try {
          const res = await axios.post(process.env.REACT_APP_API_URL+'/users/login', credentials)
          if (res.data.success) {
              localStorage.setItem('wagers_auth_token', res.data.token);
              setToken(res.data.token)
          } else {
              setErrorMessage(res.data.message);
          }
      } catch (err) {
      }
  }

  const handleClick = (e) => {
    e.preventDefault();
    sendUserCredentials({email, password});
  }

  return (
    <div>
      <h1>Login</h1>
      {errorMessage !== '' ? <p>{errorMessage}</p> : ''}
      <form onSubmit={handleClick}>
        <input type="text" placeholder="Email" value={email} onChange={changeEmail} />
        <input type="password" placeholder="Password" value={password} onChange={changePassword} />
        <input type="submit" value="Log-in"/>
      </form>
    </div>
  )
}