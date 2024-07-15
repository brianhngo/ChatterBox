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
router.use(cors());

// GET /api/profile/
router.get('/', async (req, res) => {
  res.send('hi');
});

// PUT /api/profile/loginuser => Logs in a user
router.put('/loginuser', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get the encrypted password from supabase
    if (email && password) {
      const { data, error } = await supabase
        .from('Profile')
        .select('*')
        .eq('email', email);

      if (error !== null || data.length < 1) {
        // if error or returning array is length 0. Return 404
        console.log(data.length, error, 'hi');
        res.status(404).send(false);
      }

      let decryptPassword = await bcrypt.compare(password, data[0].password);

      if (decryptPassword) {
        const token = jwt.sign(
          { username: data[0].username },
          process.env.JWT_KEY,
          {
            expiresIn: '24h',
          }
        );
        res.status(200).send(token);
      } else {
        console.log('hello');
        res.status(404).send(false);
      }
    }
  } catch (error) {
    console.error(error);
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
    console.log(req.body.decoded);
    const { data, error } = await supabase
      .from('Profile')
      .select('*')

      .eq('email', req.body.decoded);
    if (error) {
      console.log('hi');
      throw error;
    } else if (data.length > 0) {
      console.log(data);
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
