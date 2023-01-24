//external chizo ko implement krate he to utility me daal dete he, helper fn vo hote he jo apn ne khud se bnaye he and used more than one file
//nodemailer server se users ko mail bhejta he

const {email, password} = require('../secrets');

// "use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
module.exports.sendMail = async function (str, data) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: email, // generated ethereal user
      pass: password, // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  let eSubj, eHtml;
  if (str == 'signup') {
    eSubj = `"Thank you for signing in" ${data.name}`;
    eHtml = `
      <h1>Welcome to Food App</h1>
      Name - ${data.name}
      Email - ${data.email}
    `;
  } else if (str == "forgetpassword") {
    eSubj = `Reset Password`;
    eHtml = `
      <h1>foodApp.com</h1>
      Here is your link to reset password : ${data.resetPasswordLink}
      `;
  }

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"FoodApp 👻" <${email}>`, // sender address
    to: data.email, // list of receivers
    subject: eSubj, // Subject line
    // text: "Hello world?", // plain text body
    html: eHtml, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account


}

// main().catch(console.error);
