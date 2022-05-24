import axios from 'axios';

const instance = axios.create();

instance.interceptors.response.use((response) => {
    return response
}, (error) => {
    if (error.response.status === 401) localStorage.removeItem('wagers_auth_token');
    return error;
})

export default instance;