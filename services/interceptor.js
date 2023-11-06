const cacheService = require('./cacheService');

const axios = require('axios').default;

const Axios = axios.create({
    baseURL: process.env.BACKEND_SERVER_URL,
});

Axios.interceptors.request.use(
    async config => {
        const userData = await cacheService.getUserData();            
        config.headers['Authorization'] = `Bearer ${userData?.auth_token}`;
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

module.exports = Axios;