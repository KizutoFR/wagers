import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';

export default function Homepage({ user_data }) {
    const [user, setUser] = useState();

    useEffect(() => {
        setUser(user_data)
    }, [user_data])

    return (
        <div>
            <h1>Homepage</h1>
            { user ? (
                <Link to="/dashboard">Dashboard</Link>
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