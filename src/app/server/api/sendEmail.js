// sendEmail.js
const transporter = require('./mailer');
const dotenv = require('dotenv');
dotenv.config();

const sendEmail = async (to, subject, username) => {
  try {
    const htmlContent = `<p>${username} is now live</p>`;

    const info = await transporter.sendMail({
      from: process.env.GOOGLE_ID,
      to: to, // List of receivers
      subject: subject,
      text: `${username} is now live`,
      html: htmlContent,
    });

    console.log('sent');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
