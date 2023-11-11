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

    fetchProcessedEmails = async () => {
        const userData = await cacheService.getUserData()                            
        return Axios.get("/fetch_processed_emails/"+userData.id);
    }

    generateReplySuggestion = async (payload) => {                                
        return Axios.post("/generate_reply_suggestion", payload);
    }
}

const userService = new UserService();

module.exports = userService;