var { BehaviorSubject } = require('rxjs');

class SubscriptionService {
  // *********** Listener for error messages ***********  
  showError = new BehaviorSubject(null);
  showError$ = this.showError.asObservable();

  setShowError = async (data) => {
    this.showError.next(data);
  }

  // *********** Listener for total emails in the mail box  ***********  
  mailBoxTotal = new BehaviorSubject(null);
  mailBoxTotal$ = this.mailBoxTotal.asObservable();

  updateMailBoxTotal = async (data) => {
    this.mailBoxTotal.next(data);
  }

  // *********** Listener to connection status of emails in the mail box  ***********  
  mailConnectionStatus = new BehaviorSubject(null);
  mailConnectionStatus$ = this.mailConnectionStatus.asObservable();

  updateMailConnectionStatus = async (data) => {
    this.mailConnectionStatus.next(data);
  }

  // *********** Listener to new emails that have been processed in the mail box  ***********  
  mailProcessed = new BehaviorSubject(null);
  mailProcessed$ = this.mailProcessed.asObservable();

  updateMailProcessed = async (data) => {
    this.mailProcessed.next(data);
  }

}

const subscriptionService = new SubscriptionService();

module.exports = subscriptionService;