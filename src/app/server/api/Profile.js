const router = require('express').Router();
const supabase = require('../database/supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// GET /api/profile/
router.get('/', async (req, res) => {
  res.send('hi');
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
        const token = jwt.sign({ username: username }, process.env.JWT_KEY, {
          expiresIn: '24h',
        });

        if (error) {
          throw error;
        }
        res.status(200).json(true);
      }
    } else {
      throw 'Failed Error';
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
