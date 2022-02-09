const gaxios = require('axios');

const axios = gaxios.create({
    headers: {
        Authorization : localStorage.getItem('wagers_auth_token')
    }
})

export default axios;