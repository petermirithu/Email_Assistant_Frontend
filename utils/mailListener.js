var { MailListener } = require("mail-listener5");

class NodeMailListener {
    constructor() {        
        var mailListener = new MailListener({
            username: "pyramyra33@gmail.com",
            password: "ofqklekyeygzpcbe",
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
        
        mailListener.start(); // start listening

        // stop listening
        //mailListener.stop();

        mailListener.on("server:connected", function () {
            console.log("imapConnected");
        });

        mailListener.on("mailbox", function (mailbox) {
            console.log("Total number of mails: ", mailbox.messages.total); // this field in mailbox gives the total number of emails
        });

        mailListener.on("server:disconnected", function () {
            console.log("imapDisconnected");
        });

        mailListener.on("error", function (err) {
            console.log(err);
        });

        mailListener.on("headers", function (headers, seqno) {
            // do something with mail headers
            // console.log("***** Header **** --- "+seqno)
            // console.log(headers)
        });

        mailListener.on("body", function (body, seqno) {
            // do something with mail body
            console.log("***** Email Body ****  --- "+seqno)            
            console.log(body)
            
        })

        mailListener.on("attachment", function (attachment, path, seqno) {
            // do something with attachment
        });

        mailListener.on("mail", function (mail, seqno) {
            // do something with the whole email as a single object
            // console.log("***** Mail **** --- "+seqno)
            // console.log(mail)
        })
    }
}

// Sites to checkout!!!!!!!!!!!
// https://github.com/Akinmyde/email-reader

module.exports = NodeMailListener;