import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const changePassword = (e) => {
    setPassword(e.target.value);
  }

  const changeEmail = (e) => {
    setEmail(e.target.value);
  }

  const login = (e) => {
    e.preventDefault();
    axios.post(process.env.REACT_APP_API_URL+'/users/login', {email, password})
      .then(res => {
        if (res.data.user) {
          localStorage.setItem('user', JSON.stringify(res.data.user))
        } else {
          setErrorMessage(res.data.message);
        }
      })
      .catch(err => console.error(err))
  }

  return (
    <div>
      <h1>Login</h1>
      {errorMessage !== '' ? <p>{errorMessage}</p> : ''}
      <form onSubmit={login}>
        <input type="text" placeholder="Email" value={email} onChange={changeEmail} />
        <input type="password" placeholder="Password" value={password} onChange={changePassword} />
        <input type="submit" value="Log-in"/>
      </form>
    </div>
  )
}