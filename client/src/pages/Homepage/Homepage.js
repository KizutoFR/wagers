import React, {useContext, useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.js';
import axios from "axios";

import './Homepage.css';

export default function Homepage(props) {
    const [user, setUser] = useState();
    const {dispatch} = useContext(AuthContext);

    useEffect(() => {
        setUser(props.user)
    }, [setUser, props])

    const logoutUser = (user_id, dispatch) => {
        axios.post(process.env.REACT_APP_API_URL+'/users/logout', {id: user._id})
            .then(() => {
                localStorage.removeItem('wagers_auth_token');
                localStorage.removeItem('wagers_user_id');
                setUser(null);
                dispatch({type: "LOGOUT_SUCCESS", payload: null});
            })
            .catch(err => dispatch({type: "LOGOUT_FAILURE", payload: err}));
    }

    const handleClick = (e) => {
        e.preventDefault();
        logoutUser(user._id, dispatch)
    }

    return (
        <div>
            <h1>Homepage</h1>
            { user ? (
                <div>
                    <Link to="/dashboard">Dashboard</Link>
                    <br/>
                    <button onClick={handleClick}>Logout</button>
                </div>
            ) : (
                <div>
                    <Link to="/login">Login</Link>
                    <br/>
                    <Link to="/register">Register</Link>
                </div>
            ) }
        </div>
    )
}