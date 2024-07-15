const { OAuth2Client } = require('google-auth-library');
const dotenv = require('dotenv');
dotenv.config();

const googleClient = new OAuth2Client({
  clientId:
    '841375607580-rmo9s6sloclhbbuvlbpn4n3rt1e1d5q3.apps.googleusercontent.com',
  clientSecret: 'GOCSPX - YlPHgBRMiWsgpxtPKOugUDqgPwqa',
  redirectUri: 'http://localhost:3001/authGoogleCallback', // setting the default url as homepage.
});

module.exports = googleClient;
