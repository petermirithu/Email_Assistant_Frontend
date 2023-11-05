const subscriptionService = require('../services/subscription');

module.exports = function (io) {
    io.on('connection', (socket) => {
        socket.on('total_emails', (value) => {
            console.log('Socket says the  value is : ' + value);
        });
    });

    subscriptionService.emailAuthError$.subscribe(
        (data) => {
            if (data != null) {
                io.emit("email_auth_error", data);
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
}