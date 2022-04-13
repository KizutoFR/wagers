import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { useAuthState } from '../../context/Auth';
import './Homepage.css';

export default function Homepage() {
    const auth = useAuthState();

    return (
        <div>
            <h1>Homepage</h1>
            { auth.user ? (
                <div>
                    <Link to="/dashboard">Dashboard</Link>
                    <br />
                    <Link to="/profil">Profil</Link>
                    <br />
                    <Link to="/update">Modification</Link>
                    <br />
                    <Link to="/shop">Shop</Link>
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