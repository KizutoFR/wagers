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

  const handleSubmit = (e) => {
    e.preventDefault();
    window.grecaptcha.ready(function() {
      window.grecaptcha.execute('6Lcn2_gcAAAAAPO4_cXw7cDGOiJbIQY4qF_e8PAO', {action: 'submit'}).then(function(token) {
        sendUserCredentials({email, password, captcha_token: token});
      });
    });
  }

  return (
    <div>
      <h1>Login</h1>
      {errorMessage !== '' ? <p>{errorMessage}</p> : ''}
      <form id="login-form">
        <input type="text" placeholder="Email" value={email} onChange={changeEmail} />
        <input type="password" placeholder="Password" value={password} onChange={changePassword} />
        {/* <input type="submit" value="Log-in"/> */}
       
        <button data-action="submit" onClick={e => handleSubmit(e)}>Login</button>
      </form>
    </div>
  )
}