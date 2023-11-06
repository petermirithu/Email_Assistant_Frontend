const subscriptionService = require('../services/subscription');

module.exports = function (io) {
    io.on('connection', (socket) => {
        socket.on('total_emails', (value) => {
            console.log('Socket says the  value is : ' + value);
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


}