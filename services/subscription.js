var {BehaviorSubject} = require('rxjs');

class SubscriptionService { 
  // *********** Listener for error messages when logging into the iMAP  ***********  
  emailAuthError = new BehaviorSubject(null);
  emailAuthError$ = this.emailAuthError.asObservable();  

  sendEmailAuthError = async (data) => {    
    this.emailAuthError.next(data);    
  }

  // *********** Listener for total emails in the mail box  ***********  
  mailBoxTotal = new BehaviorSubject(null);
  mailBoxTotal$ = this.mailBoxTotal.asObservable();  

  updateMailBoxTotal = async (data) => {    
    this.mailBoxTotal.next(data);    
  }

  
}

const subscriptionService = new SubscriptionService();

module.exports = subscriptionService;