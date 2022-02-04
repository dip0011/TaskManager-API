const nodemailer = require('nodemailer');

// Create a SMTP transporter object
let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    },
    tls:{
        rejectUnauthorized: false
    }
});

const sendWelcomeEmail = (email, name)=>{
    const mailBody = {
        from: 'marco.bailey36@ethereal.email',
        to: email,
        subject: 'Thanks for joining in!',
        text: '',
        html: `<p>Welcome to the Task-Manager App, ${name}. Let us know how you get along with the app!</p>`
    };
    transporter.sendMail(mailBody, (err, info) => {
        if (err) {
            return console.log('Error: ' + err.message);
        }    
        console.log('Message sent:', info.messageId);
    
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    });
}

const sendCancleEmail = (email, name)=>{
    const mailBody = {
        from: 'marco.bailey36@ethereal.email',
        to: email,
        subject: 'Sorry to see you go!',
        text: '',
        html: `<p>GoodBye, ${name}. We hope to see you again.</p>`
    };
    transporter.sendMail(mailBody, (err, info) => {
        if (err) {
            return console.log('Error: ' + err.message);
        }    
        console.log('Message sent:', info.messageId);
    
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    });
}

module.exports = {
    sendWelcomeEmail,
    sendCancleEmail
};










// const nodemailer = require("nodemailer");

// // create reusable transporter object using the default SMTP transport
// let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: '<your-email>',
//         pass: '<you-email-password>'
//     },
//     tls:{
//         rejectUnauthorized: false
//     }
// });

// let mailOption = {
//     from: 'kaptan.200011@gmail.com', // sender address
//     to: "dipdhameliya2001@gmail.com", // list of receivers
//     subject: "Hello", // Subject line
//     text: '"Hello world?"', // plain text body
// }

// // send mail with defined transport object
// transporter.sendMail(mailOption, function(error, result){
//     if(error){
//         return console.log(error);
//     }
//     console.log('Email sent successfully!');
// });
