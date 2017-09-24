'use strict'
const nodemailer = require('nodemailer');
const moment = require('moment');
const log = require("loglevel");
let transporter;
let lastMail;
let freqMail;

module.exports.init = (config) => {
    freqMail = config.myFreqMail;
    transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "lamponepi89@gmail.com", // generated ethereal user
            pass: "l4mp0n3p189!" // generated ethereal password
        }
    });
}


module.exports.sendEmail = (level, destinary, text) => {
    // CHECK 
    if (!transporter || !config) throw new Error('Missing Email init()');
    if (lastMail && moment().diff(lastMail, 'minutes') < freqMail) return;
    //SENDING MAIL
    let mailOptions = prepareMail(level, destinary, text);
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return log.error(error);
        }
        log.info('Message sent: %s', info.messageId);
        lastMail = moment();
    });
}



function prepareMail(level, destinary, text) {
    let mailOptions = {
        from: '"🌩️ Lightning PI 🌩️" <lamponepi89@gmail.com>', // sender address
        to: destinary, // list of receivers
    };

    if (/<[a-z][\s\S]*>/.test(text)) {
        mailOptions.html = text;
    } else {
        mailOptions.text = text;
    }
    switch (level) {
        case 'ALERT':
            mailOptions.subject = 'Fulmini Alert! 🌩️ (' + moment().format('D/M/YYYY - HH:mm') + ')' // Subject line
            break;
        case 'WARNING':

            break;
        default:
            break;
    }
    return mailOptions
}