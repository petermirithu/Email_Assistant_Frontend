const cacheService = require('./cacheService');

const axios = require('axios').default;

class UserService {
    isAuthenticated = async (req, res, next) => {
        const userData = await cacheService.getUserData()                
        
        if (userData) {
            return next();
        }
        else {            
            req.flash('info', 'Please Sign In if you have an Account'),
            res.redirect('/signIn');
        }
    }

    createUserAccount = async (payload) => {    
        return axios.post(process.env.BACKEND_SERVER_URL + "/sign_up_user", payload);    
    }

    loginUser = async (payload) => {
        return axios.post(process.env.BACKEND_SERVER_URL + "/sign_in_user", payload);    
    }
}

const userService = new UserService();

module.exports = userService;