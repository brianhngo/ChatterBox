const dotenv = require('dotenv');
dotenv.config();
const nodemailer = require('nodemailer');

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
    user: process.env.GOOGLE_ID,
    pass: process.env.GOOGLE_PW,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take our messages:', success);
  }
});

module.exports = transporter;
