import axios from 'axios';
import { headers } from '../../utils/config';

export async function login(dispatch, payload) {
    try {
        dispatch({ type: "REQUEST_LOGIN" });
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, payload, headers);

        if (res.data.user) {
            dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
            localStorage.setItem('wagers_auth_token', res.data.accessToken);
            return res.data.user;
        }
       
        dispatch({ type: 'LOGIN_ERROR', error: res.data.message });
        return;
    } catch(err) {
        dispatch({ type: 'LOGIN_ERROR', error: err });
    }
}

export async function updateUser(dispatch, payload) {
    console.log(payload);
    dispatch({type: 'UPDATE_USER', payload})
}

export async function logout(dispatch) {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('wagers_auth_token');
  }