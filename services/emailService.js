const nodeMailListener = require("../utils/mailListener");

class EmailService {
    startEmailTracking= async (email, password) => {                 
        nodeMailListener.initListener(email, password);        
        nodeMailListener.startMailListener();
    }

    stopEmailTracking= async (email, password) => {    
        nodeMailListener.stopMailListener();
    }    
}

const emailService = new EmailService();

module.exports = emailService;