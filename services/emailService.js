const nodeMailListener = require("../utils/mailListener");
const subscriptionService = require("./subscription");

class EmailService {
    startEmailTracking= async (email, password) => {                 
        subscriptionService.updateMailConnectionStatus("connecting");
        nodeMailListener.initListener(email, password);        
        nodeMailListener.startMailListener();
    }

    stopEmailTracking= async (email, password) => {    
        nodeMailListener.stopMailListener();
    }        
}

const emailService = new EmailService();

module.exports = emailService;