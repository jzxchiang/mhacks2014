'use strict';

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'nodemailer122895@gmail.com',
        pass: 'mhacks2014'
    }
});

var mailOptions = {
    from: 'MHacks ✔ <nodemailer122895@gmail.com>', // sender address
    to: 'thebrianzeng@gmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world ✔', // plaintext body
    html: '<b>Hello world ✔</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
    }else{
        console.log('Message sent: ' + info.response);
    }
});