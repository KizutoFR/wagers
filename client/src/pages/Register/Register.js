import React, { useState, useRef } from 'react';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

export default function Register() {
  const email = useRef();
  const password = useRef();
  const firstname = useRef();
  const lastname = useRef();
  const username = useRef();
  const confirmPassword = useRef();
  const history = useHistory();
  const [errors, setErrors] = useState([]);

  const register = async (e) => {
    e.preventDefault();
    const data = {
      firstname: firstname.current.value, 
      lastname: lastname.current.value, 
      username: username.current.value, 
      email: email.current.value, 
      password: password.current.value, 
      confirmPassword: confirmPassword.current.value
    };
    const result = await axios.post(process.env.REACT_APP_API_URL+'/users/register', data);
    if (result.data.success) {
      history.push('/login');
    } else {
      setErrors(result.data.errors)
    }
  }

  return (
    <div className="register-container">
      <div className="form-container">
        <img src="/images/logo.svg" alt="logo"/>
        {errors.length > 0 
          ? errors.map((err, index) => <p className="error-message" key={index}>{err.msg}</p>)
          : ''}
        <form>
          <div className="form-row">
            <div className="form-element">
              <input type="text" placeholder="Firstname" ref={firstname} />
            </div>
            <div className="form-element">
              <input type="text" placeholder="Lastname" ref={lastname}/>
            </div>
          </div>
          <div className="form-row">
            <div className="form-element">
              <input type="text" placeholder="Username" ref={username}/>
            </div>
            <div className="form-element">
              <input type="text" placeholder="Email" ref={email}/>
            </div>
          </div>
          <div className="form-element">
            <input type="password" placeholder="Password" ref={password}/>
          </div>
          <div className="form-element">
            <input type="password" placeholder="Confirm Password" ref={confirmPassword}/>
          </div>
          <div className="form-options">
            <Link to="/login">Log-In</Link>
            <button onClick={register}>Register</button>
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