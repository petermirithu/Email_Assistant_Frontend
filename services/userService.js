const axios = require('axios').default;

class UserService {

    createUserAccount = async (payload) => {    
        return axios.post(process.env.BACKEND_SERVER_URL + "/sign_up_user", payload);    
    }

    loginUser = async (payload) => {
        return axios.post(process.env.BACKEND_SERVER_URL + "/sign_in_user", payload);    
    }
}

const userService = new UserService();

module.exports = userService;