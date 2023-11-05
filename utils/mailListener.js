var { MailListener } = require("mail-listener5");
const subscriptionService = require('../services/subscription');

class NodeMailListener {
    constructor() {
        this.mailListener = null;
    }

    initListener = (email, password) => {
        email="pyramyra33@gmail.com",
        password="ofqklekyeygzpcbe",

        this.mailListener = new MailListener({
            username: email,
            password: password,            
            host: "smtp.gmail.com",
            port: 993,
            tls: true,
            connTimeout: 30000,
            authTimeout: 10000,
            keepalive: true,
            // debug: console.log, // Or your custom function with only one incoming argument. Default: null
            autotls: 'never', // default by node-imap
            tlsOptions: { rejectUnauthorized: false },
            mailbox: "INBOX", // mailbox to monitor
            searchFilter: ["UNSEEN"], // the search filter being used after an IDLE notification has been retrieved
            markSeen: true, // all fetched email willbe marked as seen and not fetched next time
            fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
            attachments: true, // download attachments as they are encountered to the project directory
            attachmentOptions: { directory: "attachments/" } // specify a download directory for attachments
        });

        this.mailListener.on("server:connected", function () {
            console.log("imapConnected");
        });

        this.mailListener.on("mailbox", function (mailbox) {
            console.log("Total number of mails: ", mailbox.messages.total); // this field in mailbox gives the total number of emails                        
            subscriptionService.updateMailBoxTotal(mailbox.messages.total);
        });

        this.mailListener.on("server:disconnected", function () {
            console.log("imapDisconnected");
        });

        this.mailListener.on("error", function (err) {
            console.log(err)
            if (err?.textCode == "AUTHENTICATIONFAILED") {                
                subscriptionService.sendEmailAuthError("The password you entered for your email iMAP is wrong. Please correct your password.\nNo email tracking is happenning now!");                
            }
            else if(err?.textCode == "ETIMEDOUT"){
                subscriptionService.sendEmailAuthError("Ooops! Stopped listening to emails due to in activity! Login again to verify that your still around.");                                
            }
            else {
                subscriptionService.sendEmailAuthError("Ooops! Something went wrong while trying to listen to your emails");                                
            }
        });

        this.mailListener.on("headers", function (headers, seqno) {
            // do something with mail headers
            // console.log("***** Header **** --- "+seqno)
            // console.log(headers)
        });

        this.mailListener.on("body", function (body, seqno) {
            // do something with mail body
            console.log("***** Email Body ****  --- " + seqno)
            console.log(body)

        })

        this.mailListener.on("attachment", function (attachment, path, seqno) {
            // do something with attachment
        });

        this.mailListener.on("mail", function (mail, seqno) {
            // do something with the whole email as a single object
            // console.log("***** Mail **** --- "+seqno)
            // console.log(mail)
        })

    }

    startMailListener = () => {
        this.mailListener.start(); // start listening
    }

    stopMailListener = () => {
        this.mailListener.stop(); // stop listening
    }
}

// Sites to checkout!!!!!!!!!!!
// https://github.com/Akinmyde/email-reader

const nodeMailListener = new NodeMailListener();

module.exports = nodeMailListener;