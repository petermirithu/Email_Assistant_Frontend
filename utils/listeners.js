const subscriptionService = require('../services/subscription');
const userService = require('../services/userService');
const nodeMailSender = require('./mailSender');
const moment = require('moment');
const fs = require('fs');
const pdf = require('pdf-parse');

module.exports = function (io) {
    io.on('connection', (socket) => {
        let emails = []
        let tasks = [];
        let attachments = [];

        socket.on('fetch_mails', async () => {
            await userService.fetchProcessedEmails().then(response => {
                emails = response.data.emails;
                tasks = response.data.tasks;
                attachments = response.data.attachments;

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

                for (let attachment of attachments) {
                    attachment["extension"] = attachment.name.split(".")[1]

                    const timeAgo = moment(new Date(attachment.created_at)).fromNow()
                    attachment["timeAgo"] = timeAgo;
                }

                io.emit("display_mails_tasks", { emails: emails, tasks: tasks, attachments: attachments });
            }).catch(error => {
                console.log(error)
            });
        });

        socket.on('get_mail', async (emailId) => {
            const email = emails.find(x => x?.id == emailId);
            const emailTasks = tasks.filter(x => x?.email_id == emailId && x?.belongs_to == "email");
            const emailAttachments = attachments.filter(x => x?.email_id == emailId) || [];

            io.emit("display_mail_task", { email: email, tasks: emailTasks, attachments: emailAttachments});
        });

        socket.on('generate_reply_suggestion', async (emailDetailBody) => {
            await userService.generateReplySuggestion({ emailBody: emailDetailBody }).then(response => {
                io.emit("display_reply_suggestion", response.data);
            }).catch(error => {
                console.log(error)
            });
        });

        socket.on('send_reply', async (payload) => {
            nodeMailSender.sendMail(payload);
        });

        socket.on('generate_mail_summary', async (emailDetailBody) => {
            await userService.generateMailSummary({ emailBody: emailDetailBody }).then(response => {
                io.emit("display_mail_summary", response.data);
            }).catch(error => {
                console.log(error);
            });
        });

        socket.on('get_attachment', async (attachmentId) => {
            const attachment = attachments.find(x => x?.id == attachmentId);            
            const email = emails.find(x => x?.id == attachment?.email_id);                        
            const emailTasks = tasks.filter(x => x?.email_id == attachment?.email_id && x?.belongs_to == "attachment");                                
            io.emit("display_attachment_task", { attachment: attachment, email: email, tasks: emailTasks});
        });

        socket.on('generate_attachment_summary', async (fileName) => {
            const dataBuffer = fs.readFileSync("public/attachments/"+fileName);
            // Convert the PDF buffer to text
            await pdf(dataBuffer).then(async data => {
                // Extracted text from the PDF                
                await userService.generateMailSummary({ emailBody: data.text }).then(response => {
                    io.emit("display_attachment_summary_reply", {text:response.data, option: "summary"});
                }).catch(error => {
                    console.log(error);
                });
            }).catch(error => {                
                console.error(error);
            });            
        });

        socket.on('generate_attachment_reply_suggestion', async (fileName) => {
            const dataBuffer = fs.readFileSync("public/attachments/"+fileName);
            // Convert the PDF buffer to text
            await pdf(dataBuffer).then(async data => {
                // Extracted text from the PDF                
                await userService.generateReplySuggestion({ attachmentBody: data.text }).then(response => {
                    io.emit("display_attachment_summary_reply", {text:response.data, option: "reply"});
                }).catch(error => {
                    console.log(error);
                });
            }).catch(error => {                
                console.error(error);
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
                io.emit("mail_processed", data);
                data = null;
            }
        });
}