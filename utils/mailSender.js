const cacheService = require('../services/cacheService');
var nodemailer = require('nodemailer');

class NodeMailSender {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }  

  sendMail = async (mailOptions) => {
    const userData = await cacheService.getUserData();
    mailOptions.from = userData.email;


    console.log(mailOptions);
    // return

    this.transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  };

}

const nodeMailSender = new NodeMailSender();

module.exports = nodeMailSender;