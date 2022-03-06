
import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {ProfilUser} from '../ProfilUser/ProfilUser.js';

export default function ModifUser({user_data,setUser}) {
  const firstname = useRef();
  const lastname = useRef();
  const username = useRef();
  const email = useRef();
  const history = useHistory();
  const [errors, setErrors] = useState([]);
  const update = async (e) => {
    e.preventDefault();
    const data = {
      firstname: firstname.current.value, 
      lastname: lastname.current.value, 
      username: username.current.value, 
      email: email.current.value, 
      id: user_data._id,

    };
    const result = await axios.post(process.env.REACT_APP_API_URL+'/users/update', data);
    if (result.data.success) {
      setUser(result.data.user)
      history.push("/profil");
    } else {
      setErrors(result.data.errors)
    }
  }
return (
  <div>
    {user_data ? (
      <div>
      <h1>Profil</h1>
       {errors.length > 0 
        ? errors.map((err, index) => <p key={index}>{err.msg}</p>)
        : ''
      }
      <form onSubmit={update}>
      <input type="text" placeholder= "firstname" defaultValue={user_data.firstname} ref={firstname} />
      <input type="text" placeholder="lastname" defaultValue={user_data.lastname} ref={lastname} />
      <input type="text" placeholder="username" defaultValue={user_data.username} ref={username} />
      <input type="text" placeholder="Email" defaultValue={user_data.email} ref={email} />
      <input type="submit" value="Envoyé vos modifications"/>
      </form>
      <Link to="/dashboard">Dashboard</Link>
      <br />
      <Link to="">Accueil</Link>
      </div>
    ): ''}
  </div>
)
  }
