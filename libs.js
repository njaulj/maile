var nodemailer = require('nodemailer');
// create reusable transporter object using the default SMTP transport 
var transporter = nodemailer.createTransport('smtps://jliu@topxgun.com:Nodoubt11@smtp.mxhichina.com');
 
// setup e-mail data with unicode symbols 
var mailOptions = {
    from: '"Fred Foo 👥" <jliu@topxgun.com>', // sender address 
    to: 'liujun@runsoar.com', // list of receivers 
    subject: 'Hello ✔', // Subject line 
    html: '<b>Hello d 🐴</b>' // html body 
};

// send mail with defined transport object 
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});
