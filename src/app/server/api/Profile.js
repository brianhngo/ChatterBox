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
// USES Google Authenticator APP mobile !!
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
        // Doesn't exist in the db
        return res.status(404).send(false);
      }

      // decrypting the password
      let decryptPassword = await bcrypt.compare(password, data[0].password);

      if (decryptPassword) {
        const base32_secret = generateBase32Secret(); // generate a secret key
        req.body.secret = base32_secret;

        // This Generates the code for QR
        let totp = new OTPAuth.TOTP({
          issuer: 'StonksAssignment',
          label: 'StonksAssignment',
          algorithm: 'SHA1',
          digits: 6,
          period: 30,
          secret: base32_secret,
        });

        let otpauth_url = totp.toString(); // Get the otpauth URL

        // Generate and send the QR code as a response
        QRCode.toDataURL(otpauth_url, (err, qrCodeUrl) => {
          if (err) {
            return res.status(500).send(false);
          }
          // Success we return an object containing qrCodeUrl, secret, and status of completion
          res.json({
            username: data[0].username,
            uid: data[0].id,
            status: true,
            qrCodeUrl: qrCodeUrl,
            secret: base32_secret,
            otpauth_url: otpauth_url, // Include the otpauth_url for debugging
          });
        });
      } else {
        return res.status(404).send(false);
      }
    } else {
      return res.status(400).send('Email and password are required');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server error');
  }
});

// put /api/profile/verify2fa !!

router.put('/verify2fa', async (req, res) => {
  try {
    const { secret, token, email, uid, username } = req.body;
    // Verify the TOTP token
    let totp = new OTPAuth.TOTP({
      issuer: 'StonksAssignment',
      label: `StonksAssignment`,
      algorithm: 'SHA1',
      digits: 6,

      secret: secret,
    });

    let delta = totp.validate({ token });

    if (delta === 0) {
      // if delta is 0, then  tokens are a match. Create JWT

      const token2 = jwt.sign({ email: email, uid: uid }, process.env.JWT_KEY, {
        // jwt token
        expiresIn: '24h',
      });
      res.json({ token: token2, username: username });
    } else {
      // token dont match. returning false
      res.status(401).json(false);
    }
  } catch (error) {
    console.error(error);
  }
});

// PUT /api/profile/createuser => Creates new User !!

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
        // Adding the username & password to DB
        const hashedPassword = await bcrypt.hash(password, 10);

        const { data, error: insertError } = await supabase
          .from('Profile')
          .insert([
            { username: username, password: hashedPassword, email: email },
          ])
          .select('id');

        if (insertError) {
          throw insertError;
        } else {
          // Insert into Followings Table

          const { data: followingsData, error: followingsError } =
            await supabase
              .from('Following')
              .insert([{ uuid: data[0].id, following: {} }]);

          if (followingsError) {
            throw followingsError;
          }

          // Insert into Channel Table
          const { data: channelData, error: ChannelError } = await supabase
            .from('Channel')
            .insert([
              {
                uuid: data[0].id,
                Status: false,
                FollowersCount: 0,
                SubCount: 0,
              },
            ]);

          if (ChannelError) {
            throw ChannelError;
          }

          // Insert into Role Table
          const { data: roleData, error: roleError } = await supabase
            .from('Role')
            .insert([{ uuid: data[0].id, Role: 'user' }]);

          if (roleError) {
            throw roleError;
          }

          // Creating the token will store two values - userUuid and email
          const token = jwt.sign(
            { uid: data[0].id, email: email },
            process.env.JWT_KEY,
            {
              expiresIn: '24h',
            }
          );
          res.json({ token: token, username: username });
        }
      }
    } else {
      throw 'Failed Error';
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/profile/googleLogin => Logins in via Google. If doesnt exist, make new entry !!

router.put('/googleLogin', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email exists in the database
    const { data: existingUser, error: fetchError } = await supabase
      .from('Profile')
      .select('*')
      .eq('email', email);

    if (fetchError) {
      console.error(fetchError);
      return res.status(500).send(false);
    }

    if (existingUser.length > 0) {
      // The user exists in your database, so generate a token
      const token = jwt.sign(
        { email: existingUser[0].email, uid: existingUser[0].id },
        process.env.JWT_KEY,
        {
          expiresIn: '24h',
        }
      );
      return res
        .status(200)
        .json({ token: token, username: existingUser.username });
    } else {
      // User does not exist, so insert into the database
      let index = email.indexOf('@'); // everything before '@' will be a username
      const { data, error: insertError } = await supabase
        .from('Profile')
        .insert([{ email: email, username: email.slice(0, index + 1) }])
        .select('id');

      if (insertError) {
        throw insertError;
      } else {
        // Insert into Followings Table
        const { data: followingsData, error: followingsError } = await supabase
          .from('Following')
          .insert([{ uuid: data[0].id, following: {} }]);

        if (followingsError) {
          throw followingsError;
        }

        // Insert into Channel Table
        const { data: channelData, error: ChannelError } = await supabase
          .from('Channel')
          .insert([
            {
              uuid: data[0].id,
              Status: false,
              FollowersCount: 0,
              SubCount: 0,
            },
          ]);

        if (ChannelError) {
          throw ChannelError;
        }

        // Insert into Role Table
        const { data: roleData, error: roleError } = await supabase
          .from('Role')
          .insert([{ uuid: data[0].id, Role: 'user' }]);

        if (roleError) {
          throw roleError;
        }
        const token = jwt.sign(
          { email: email, uid: data[0].id },
          process.env.JWT_KEY,
          {
            expiresIn: '24h',
          }
        );
        return res.status(200).json({
          token: token,
          username: existingUser.username,
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(false);
  }
});

// PUT /api/profile/getProfileInformation => Get user profile information

router.put('/getProfileInformation', authenticateToken, async (req, res) => {
  try {
    // Token validation passed if we reached this far;

    const { data, error } = await supabase
      .from('Profile')
      .select('*')
      .eq('email', req.body.decoded)
      .eq('id', req.body.decodedUID);
    if (error) {
      throw error;
    } else if (data.length > 0) {
      res.status(200).json(data);
    }
  } catch (error) {
    console.error(error);
  }
});

// PUT /api/profile/getProfileInformation => Get user profile information !!

router.put('/updateProfileInformation', authenticateToken, async (req, res) => {
  try {
    // Token validation passed if we reached this far;
    const { email, fullName, password, username, avatar, token } = req.body;
    const { data, error } = await supabase
      .from('Profile')
      .update({
        email: email,
        fullName: fullName,
        password: await bcrypt.hash(password, 10),
        username: username,
        avatar: avatar,
        updatedAt: new Date().toISOString(), // assuming you have `timestamp` defined somewhere
      })
      .eq('email', req.body.decoded)
      .eq('id', req.body.decodedUID);

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

// put /api/profile/changePassword !!

router.put('/changePassword', authenticateToken, async (req, res) => {
  try {
    const { newPassword, oldPassword, decoded, decodedUID } = req.body;
    const { data, error } = await supabase
      .from('Profile')
      .select('*')
      .eq('email', decoded)
      .eq('id', decodedUID);
    console.log(
      newPassword,
      oldPassword,
      data[0].password,
      decoded,
      decodedUID
    );
    if (data.length > 0) {
      const storedPassword = data[0].password;
      const isPasswordCorrect = await bcrypt.compare(
        oldPassword,
        storedPassword
      );

      if (isPasswordCorrect) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const { data, error } = await supabase
          .from('Profile')
          .update({ password: hashedPassword })
          .eq('email', decoded);
      } else {
        res.status(200).send(true);
      }
    } else {
      res.status(404).send(false);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(false);
  }
});

// !!
router.put('/authenticate', authenticateToken, async (req, res) => {
  try {
    if (req.body.decoded && req.body.decodedUID) {
      res.status(200).json(true);
    }
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
