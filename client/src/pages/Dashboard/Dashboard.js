import React, {useEffect, useContext, useState } from 'react';
import {AuthContext} from "../../context/AuthContext";
import axios from 'axios';
import './Dashboard.css';
import LinkAccountInput from "../../Components/LinkAccountInput";

export default function Dashboard({ user_data }) {
    const [games, setGames] = useState([]);
    const { dispatch } = useContext(AuthContext);

    useEffect(() => {
        getGamesAccount()
        console.log(user_data)
    }, [user_data])

    async function getGamesAccount() {
        return await axios.get(process.env.REACT_APP_API_URL+'/games').then(res => {
            setGames(res.data.games)
        });
    }

    const logoutUser = async (user, dispatch) => {
        dispatch({type:"LOGOUT_START", payload: user.token});
        try {
            const res = await axios.post(process.env.REACT_APP_API_URL+'/users/logout', {id: user._id});
            if(res.data.success) {
                localStorage.removeItem('wagers_auth_token')
                localStorage.removeItem('wagers_user_id');
                dispatch({type:"LOGOUT_SUCCESS", payload: null});
            } else {
                dispatch({type:"LOGOUT_FAILURE", payload: res.data.error});
            }
        } catch (err) {
            dispatch({type:"LOGOUT_FAILURE", payload: err});
        }
    }

    const handleClick = (e) => {
        e.preventDefault();
        logoutUser(user_data, dispatch)
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <div className="row">
                {games && games.map((game, index) => (
                    <LinkAccountInput data={game} linked_list={user_data.linked_account} user_id={user_data._id} available={game.type === "LOL"} key={index} />
                ))}
            </div>
            <button onClick={handleClick}>Logout</button>
        </div>
    );
}