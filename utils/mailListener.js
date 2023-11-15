var { MailListener } = require("mail-listener5");
const subscriptionService = require('../services/subscription');
const userService = require("../services/userService");
const cacheService = require("../services/cacheService");
const pdf = require('pdf-parse');

class NodeMailListener {
    constructor() {
        this.mailListener = null;
        this.username = null;
        this.password = null;
    }

    initListener = (email, password) => {
        this.username = email,
            this.password = password,

            this.mailListener = new MailListener({
                username: this.username,
                password: this.password,
                host: "smtp.gmail.com",
                port: 993,
                tls: true,
                connTimeout: 30000,
                authTimeout: 10000,
                keepalive: true,
                // debug: null, // Or your custom function with only one incoming argument. Default: null
                autotls: 'never', // default by node-imap
                tlsOptions: { rejectUnauthorized: false },
                mailbox: "INBOX", // mailbox to monitor
                searchFilter: ["UNSEEN"], // the search filter being used after an IDLE notification has been retrieved
                markSeen: true, // all fetched email will be marked as seen and not fetched next time
                fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
                attachments: true, // download attachments as they are encountered to the project directory
                attachmentOptions: { directory: "public/attachments/" } // specify a download directory for attachments
            });

        this.mailListener.on("server:connected", function () {
            subscriptionService.updateMailConnectionStatus("connected");
        });

        this.mailListener.on("mailbox", function (mailbox) {
            subscriptionService.updateMailBoxTotal(mailbox.messages.total); // this field in mailbox gives the total number of emails                        
        });

        this.mailListener.on("server:disconnected", function () {
            subscriptionService.updateMailConnectionStatus("disconnected");
        });

        this.mailListener.on("error", function (err) {
            console.log(err);
            subscriptionService.updateMailConnectionStatus("disconnected");
            if (err?.textCode == "AUTHENTICATIONFAILED") {
                subscriptionService.setShowError("The password you entered for your email iMAP is wrong. Please correct your password.\nNo email tracking is happenning now!");
            }
            else if (err?.code == "ETIMEDOUT") {
                subscriptionService.setShowError("Ooops! Stopped listening to emails due to in activity! Login again to verify that your still around.");
            }
            else {
                subscriptionService.setShowError("Ooops! Something went wrong while trying to listen to your emails");
            }
        });

        this.mailListener.on("headers", function (headers, seqno) {
            // do something with mail headers            
        });

        this.mailListener.on("body", async function (body, seqno) {
            // do something with mail body            
        })

        this.mailListener.on("attachment", function (attachment, path, seqno) {
            // do something with attachment                                                
        });

        this.mailListener.on("mail", async function (mail, seqno) {
            // do something with the whole email as a single object              
            const userProfile = await cacheService.getUserData();            

            const payload = {
                userId: userProfile?.id,
                subject: mail.subject,
                fromEmail: mail.from.text,
                body: mail.text,
                htmlBody: mail.textAsHtml,
                messageId: mail.messageId,
                attachments: []
            }
            
            if (mail?.attachments?.length > 0) {
                for (let attachment of mail?.attachments) {
                    const pdfBuffer = Buffer.from(attachment.content, 'base64');
                    await pdf(pdfBuffer).then(async (data) => {                        
                        payload.attachments.push({fileName: attachment.filename, fileText: data.text});                        
                    }).catch((error) => {
                        console.error('Error extracting text from PDF:', error);
                    });
                }
            }

            await userService.processEmail(payload).then(response => {
                subscriptionService.updateMailProcessed("fetchAll");
            }).catch(error => {
                subscriptionService.setShowError("Oops! Something went wrong while processing one of your email");
            });
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