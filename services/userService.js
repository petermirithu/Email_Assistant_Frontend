const cacheService = require('./cacheService');
const Axios = require('./interceptor');

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

    // Axios requests
    // Authentication section
    createUserAccount = async (payload) => {    
        return Axios.post("/sign_up_user", payload);    
    }

    loginUser = async (payload) => {
        return Axios.post("/sign_in_user", payload);    
    }

    // Processing the email section    
    processEmail = async (payload) => {        
        return Axios.post("/process_email", payload);    
    }

    fetchProcessedEmails = async (userId) => {
        return Axios.get("/fetch_processed_emails/"+userId);
    }
}

const userService = new UserService();

module.exports = userService;