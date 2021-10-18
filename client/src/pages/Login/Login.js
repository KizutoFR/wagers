import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.js';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { isFetching, dispatch } = useContext(AuthContext);

  const changePassword = (e) => {
    setPassword(e.target.value);
  }

  const changeEmail = (e) => {
    setEmail(e.target.value);
  }

  const sendUserCredentials = async (credentials, dispatch) => {
      dispatch({type: "LOGIN_START"});
      try {
          const res = await axios.post(process.env.REACT_APP_API_URL+'/users/login', credentials)
          if (res.data.success) {
              localStorage.setItem('wagers_auth_token', res.data.token);
              localStorage.setItem('wagers_user_id', res.data.user_id);
              dispatch({type: "LOGIN_SUCCESS", payload: res.data.token})
          } else {
              setErrorMessage(res.data.message);
              dispatch({type: "LOGIN_FAILURE", payload: res.data.message});
          }
      } catch (err) {
          dispatch({type: "LOGIN_FAILURE", payload: err});
      }
  }

  const handleClick = (e) => {
    e.preventDefault();
    sendUserCredentials({email, password}, dispatch);
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