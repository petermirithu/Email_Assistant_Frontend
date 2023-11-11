const subscriptionService = require('../services/subscription');
const userService = require('../services/userService');
const nodeMailSender = require('./mailSender');
const moment = require('moment');

module.exports = function (io) {
    io.on('connection', (socket) => {
        let emails = []
        let tasks = [];

        socket.on('fetch_mails', async () => {                        
            await userService.fetchProcessedEmails().then(response => {
                emails = response.data.emails;
                tasks = response.data.tasks;

                for (let email of emails) {
                    const timeAgo = moment(new Date(email.created_at)).fromNow()
                    email["timeAgo"] = timeAgo;

                    let namesList = email.from_email.split(" ");
                    if (namesList.length > 1) {
                        email["initials"] = `${namesList[0][0]}${namesList[1][0]}`.toUpperCase();
                    }
                    else {
                        email["initials"] = `${namesList[0][0]}`.toUpperCase();
                    }
                }

                for (let task of tasks) {
                    const timeAgo = moment(new Date(task.created_at)).fromNow()
                    task["timeAgo"] = timeAgo;
                }
                io.emit("display_mails_tasks", {emails:emails, tasks:tasks});
            }).catch(error => {
                console.log(error)
            });            
        });

        socket.on('get_mail', async (emailId) => {            
            const email = emails.find(x=>x?.id == emailId);
            const emailTasks = tasks.filter(x=>x?.email_id == emailId);
            io.emit("display_mail_task", {email:email, tasks:emailTasks});
        });

        socket.on('generate_reply_suggestion', async (emailDetailBody) => {            
            await userService.generateReplySuggestion({emailBody: emailDetailBody}).then(response=>{                
                io.emit("display_reply_suggestion", response.data);
            }).catch(error=>{
                console.log(error)
            });                        
        });       
        
        socket.on('send_reply', async (payload) => {   
            nodeMailSender.sendMail(payload);                                 
        });        

        socket.on('generate_mail_summary', async (emailDetailBody) => {   
            await userService.generateMailSummary({emailBody: emailDetailBody}).then(response=>{                
                io.emit("display_mail_summary", response.data);
            }).catch(error=>{
                console.log(error);
            });                               
        });                
    });

    subscriptionService.showError$.subscribe(
        (data) => {
            if (data != null) {
                io.emit("show_error", data);
                data = null;
            }
        });

    subscriptionService.mailBoxTotal$.subscribe(
        (data) => {
            if (data != null) {
                io.emit("mail_box_total", data);
                data = null;
            }
        });

    subscriptionService.mailConnectionStatus$.subscribe(
        (data) => {
            if (data != null) {
                io.emit("mail_connection_status", data);
                data = null;
            }
        });

    subscriptionService.mailProcessed$.subscribe(
        (data) => {
            if (data != null) {
                // ............................
                data = null;
            }
        });
}