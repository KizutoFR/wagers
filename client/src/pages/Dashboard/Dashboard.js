import React, {useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import LinkAccountInput from "../../Components/LinkAccountInput";

export default function Dashboard({ user_data, setToken }) {
    const [games, setGames] = useState([]);

    useEffect(() => {
        getGamesAccount()
    }, [user_data])

    async function getGamesAccount() {
        return await axios.get(process.env.REACT_APP_API_URL+'/games').then(res => {
            setGames(res.data.games)
        });
    }

    const handleClick = (e) => {
        e.preventDefault();
        localStorage.removeItem('wagers_auth_token')
        setToken(null)
    }

    return (
        <div>
            {user_data ? (
                <div>
                    <h1>Dashboard</h1>
                    <div className="row">
                        {games && games.map((game, index) => (
                            <LinkAccountInput data={game} linked_list={user_data.linked_account} user_id={user_data._id} available={game.type === "LOL"} key={index} />
                        ))}
                    </div>
                    <br />
                    <Link to="/profil">Profil</Link>
                    <br />
                    <br />
                    <button onClick={handleClick}>Logout</button>
                    
                </div>
               
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}