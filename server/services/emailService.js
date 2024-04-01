// services/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_PASS
    }
});

exports.sendEmail = (to, subject, html) => {
    console.log('Sending email: ', to, subject);
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};