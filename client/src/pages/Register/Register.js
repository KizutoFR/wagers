import React, { useState, useRef } from 'react';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import './Register.css';
import { useTranslation } from "react-i18next";
import { FaAt,  FaKey} from 'react-icons/fa';
import Lang from "../../components/Lang/Lang";

export default function Register() {
  const email = useRef();
  const password = useRef();
  const firstname = useRef();
  const lastname = useRef();
  const username = useRef();
  const confirmPassword = useRef();
  const history = useHistory();
  const [errors, setErrors] = useState([]);
  const { t } = useTranslation();

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
    const result = await axios.post(process.env.REACT_APP_API_URL+'/auth/register', data);
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
              <input type="text" placeholder={t('register.firstname')} ref={firstname} />
            </div>
            <div className="form-element">
              <input type="text" placeholder={t('register.lastname')} ref={lastname}/>
            </div>
          </div>
          <div className="form-row">
            <div className="form-element">
              <input type="text" placeholder={t('register.username')} ref={username}/>
            </div>
            <div className="form-element">
              <input type="text" placeholder={t('register.email')} ref={email}/>
              <FaAt className="form-element-icon" />
            </div>
          </div>
          <div className="form-element pass">
            <input type="password" placeholder={t('register.password')} ref={password}/>
            <FaKey className="form-element-icon" />
          </div>
          <div className="form-element pass">
            <input type="password" placeholder={t('register.confirmPassword')} ref={confirmPassword}/>
            <FaKey className="form-element-icon" />
          </div>
          <div className="form-options">
            <Link to="/login">{t('register.log-in')}</Link>
            <button onClick={register}>{t('register.register')}</button>
          </div>
        </form>
        <div className='register-lang'>
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