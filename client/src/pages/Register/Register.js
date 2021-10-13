import React, { useState, useRef } from 'react';
import axios from 'axios';

export default function Register() {
  const email = useRef();
  const password = useRef();
  const firstname = useRef();
  const lastname = useRef();
  const username = useRef();
  const confirmPassword = useRef();

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
      //TODO: redirect to dashboard
    } else {
      setErrors(result.data.errors)
    }
  }

  return (
    <div>
      <h1>Login</h1>
      {errors.length > 0 
        ? errors.map((err, index) => <p key={index}>{err.msg}</p>)
        : ''
      }
      <form onSubmit={register}>
        <input type="text" placeholder="Firstname" ref={firstname} />
        <input type="text" placeholder="Lastname" ref={lastname}/>
        <input type="text" placeholder="Username" ref={username}/>
        <input type="text" placeholder="Email" ref={email}/>
        <input type="password" placeholder="Password" ref={password}/>
        <input type="password" placeholder="Confirm Password" ref={confirmPassword}/>
        <input type="submit" value="Register"/>
      </form>
    </div>
  )
}