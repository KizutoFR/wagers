import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';

export default function Homepage({ user_data }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        setUser(user_data)
    }, [user_data])

    return (
        <div>
            <h1>Homepage</h1>
            { user ? (
                <div>
                    <Link to="/dashboard">Dashboard</Link>
                    <br />
                    <Link to="/profil">Profil</Link>
                </div>
            ) : (
                <div>
                    <Link to="/login">Login</Link>
                    <br />
                    <Link to="/register">Register</Link>
                </div>
            ) }
        </div>
    )
}