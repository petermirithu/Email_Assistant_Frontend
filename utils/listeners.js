const subscriptionService = require('../services/subscription');
const userService = require('../services/userService');
const moment = require('moment');

module.exports = function (io) {
    io.on('connection', (socket) => {
        socket.on('fetch_mails', async (value) => {
            await userService.fetchProcessedEmails().then(response => {
                for (let email of response.data.emails) {
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

                for (let task of response.data.tasks) {
                    const timeAgo = moment(new Date(task.created_at)).fromNow()
                    task["timeAgo"] = timeAgo;
                }

                io.emit("display_mails_tasks", response.data);

            }).catch(error => {
                console.log(error)
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