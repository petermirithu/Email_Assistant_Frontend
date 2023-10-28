if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}


class CacheService {
    setUserData= async (payload) => {    
        localStorage.setItem('user_profile', JSON.stringify(payload));        
    }

    getUserData= async () => {    
        const cachedUser = localStorage.getItem('user_profile') || null;        

        if (cachedUser!=null ){
            return JSON.parse(cachedUser)
        }
        else{
            return null
        }
    }

    clearCache = async () => {
        localStorage.clear()
    }
   
}

const cacheService = new CacheService();

module.exports = cacheService;