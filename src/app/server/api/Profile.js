const router = require('express').Router();
const supabase = require('../database/supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const axios = require('axios');
dotenv.config();
const authenticateToken = require('./ProfileMiddleware');
const googleClient = require('./GoogleAuth');
const cors = require('cors');
const OTPAuth = require('otpauth');
const { encode } = require('hi-base32');
const QRCode = require('qrcode');
const crypto = require('crypto');
router.use(cors());

// GET /api/profile/
router.get('/', async (req, res) => {
  res.send('hi');
});

const generateBase32Secret = () => {
  try {
    const buffer = crypto.randomBytes(20);
    const base32 = encode(buffer).replace(/=/g, '').substring(0, 24);
    return base32;
  } catch (error) {
    throw error;
  }
};

// Two steps required to get Token => credentials = true && FA = True;

// PUT /api/profile/loginuser => Logs in a user
router.put('/loginuser', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Credentials - Get the encrypted password from supabase
    if (email && password) {
      const { data, error } = await supabase
        .from('Profile')
        .select('*')
        .eq('email', email);

      if (error !== null || data.length < 1) {
        // Doesnt exist in the db
        res.status(404).send(false);
      }

      // decrypting the password
      let decryptPassword = await bcrypt.compare(password, data[0].password);

      if (decryptPassword) {
        const base32_secret = generateBase32Secret(); // generate a secret key
        req.body.secret = base32_secret;

        // This Generates the code for QR
        let totp = new OTPAuth.TOTP({
          issuer: 'StonksAssignment.com',
          label: 'StonksAssignment',
          algorithm: 'SHA1',
          digits: 6,
          secret: base32_secret,
        });

        let otpauth_url = totp.toString();

        // Generate and send the QR code as a response
        QRCode.toDataURL(otpauth_url, (err) => {
          if (err) {
            return res.status(500).json({
              status: 'fail',
              message: 'Error while generating QR Code',
            });
          }
          // Success we return an object containing qrCodeUrl, secret, and status of completion
          res.send(200).json({
            status: true,
            qrCodeUrl: otpauth_url,
            secret: base32_secret,
          });
        });
      } else {
        res.status(404).send(false);
      }
    }
  } catch (error) {
    console.error(error);
  }
});

// put /api/profile/verify2fa

router.put('/verify2fa', (req, res) => {
  const { qrCodeUrl2, secret, token } = req.body;
  // Verify the TOTP token
  let totp = new OTPAuth.TOTP({
    issuer: 'YourSite.com',
    label: 'YourSite',
    algorithm: 'SHA1',
    digits: 6,
    secret: secret,
  });

  let delta = totp.validate({ token });

  const token2 = jwt.sign({ username: data[0].username }, process.env.JWT_KEY, {
    // jwt token
    expiresIn: '24h',
  });

  if (delta) {
    res.json(token2);
  } else {
    res.status(401).json(false);
  }
});

// PUT /api/profile/createuser => Creates new User

router.put('/createuser', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Checks if username and password exist in the db
    if (username && password && email) {
      const { data, error } = await supabase
        .from('Profile')
        .select('*')
        .eq('username', username)
        .eq('email', email);

      // if the length is 0, we know that the username and email is available
      if (data && data.length > 0) {
        res.status(404).json(false);
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);

        const { data, error } = await supabase
          .from('Profile')
          .insert([
            { username: username, password: hashedPassword, email: email },
          ]);

        // Creating the token
        const token = jwt.sign({ email: email }, process.env.JWT_KEY, {
          expiresIn: '24h',
        });

        if (error) {
          throw error;
        }
        res.status(200).json(token);
      }
    } else {
      throw 'Failed Error';
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/profile/googleLogin => Logins in via Google. If doesnt exist, make new entry

router.put('/googleLogin', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email exists in the database
    const { data: existingUser, error: fetchError } = await supabase
      .from('Profile')
      .select('email')
      .eq('email', email);

    if (fetchError) {
      console.error(fetchError);
      return res.status(500).send({ error: 'Error fetching user data' });
    }

    if (existingUser.length > 0) {
      // The user exists in your database, so generate a token
      const token = jwt.sign(
        { email: existingUser[0].email },
        process.env.JWT_KEY,
        {
          expiresIn: '24h',
        }
      );
      return res.status(200).json(token);
    } else {
      // User does not exist, so insert into the database
      const { data, error: insertError } = await supabase
        .from('Profile')
        .insert([{ email: email }]);

      if (insertError) {
        console.error(insertError);
        return res.status(500).send({ error: 'Error creating user' });
      }

      const token = jwt.sign({ email: email }, process.env.JWT_KEY, {
        expiresIn: '24h',
      });
      return res.status(200).json(token);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Server error' });
  }
});

// PUT /api/profile/getProfileInformation => Get user profile information

router.put('/getProfileInformation', authenticateToken, async (req, res) => {
  try {
    // Token validation passed if we reached this far;

    const { data, error } = await supabase
      .from('Profile')
      .select('*')

      .eq('email', req.body.decoded);
    if (error) {
      console.log('hi');
      throw error;
    } else if (data.length > 0) {
      res.status(200).json(data);
    }
  } catch (error) {
    console.error(error);
  }
});

// PUT /api/profile/getProfileInformation => Get user profile information

router.put('/updateProfileInformation', authenticateToken, async (req, res) => {
  try {
    // Token validation passed if we reached this far;
    const { email, fullName, password, username, avatar, token } = req.body;
    const { data, error } = await supabase
      .from('Profile')
      .update({
        email: email,
        fullName: fullName,
        password: password,
        username: username,
        avatar: avatar,
        updatedAt: new Date().toISOString(), // assuming you have `timestamp` defined somewhere
      })
      .eq('email', req.body.decoded);

    if (error) {
      throw error;
    } else {
      res.status(200).json(true);
    }
  } catch (error) {
    console.error(error);
  }
});

// PUT /api/profile/authenticate Authenticate user when he refresh page/ logs in

router.put('/authenticate', authenticateToken, async (req, res) => {
  try {
    res.status(200).json(true);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
