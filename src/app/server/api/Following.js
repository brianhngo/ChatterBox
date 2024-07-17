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

// add channel to following
router.put('/addFollow', authenticateToken, async (req, res) => {
  try {
    const email = req.body.decoded;
    const streamId = req.body.username; // the streams id

    // getting profile for uuid
    const { data: profileData, error: profileError } = await supabase
      .from('Profile')
      .select('id')
      .eq('email', email)
      .single();

    if (profileData) {
      // if uuid exists
      const { data: followingData, error: followingError } = await supabase
        .from('Following')
        .select('following')
        .eq('uuid', profileData.id)
        .single();

      if (followingData) {
        const updatedFollowing = {
          ...followingData.following,
          [streamId]: true,
        };

        const { error: updateError } = await supabase
          .from('Following')
          .update({ following: updatedFollowing })
          .eq('uuid', profileData.id);

        if (updateError) {
          throw updateError;
        }

        res.status(200).json(true);
      } else {
        res.status(404).json({ message: 'Following data not found' });
      }
    } else {
      // a guest. So we are going to return false and eventually make user login
      res.status(200).json(false);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/unFollow', authenticateToken, async (req, res) => {
  try {
    const email = req.body.decoded;
    const streamId = req.body.username; // the stream's id

    // getting profile for uuid
    const { data: profileData, error: profileError } = await supabase
      .from('Profile')
      .select('id')
      .eq('email', email)
      .single();

    if (profileData) {
      // if uuid exists
      const { data: followingData, error: followingError } = await supabase
        .from('Following')
        .select('following')
        .eq('uuid', profileData.id)
        .single();

      if (followingData) {
        const updatedFollowing = { ...followingData.following };
        delete updatedFollowing[streamId]; // Remove the streamId from the following object

        const { error: updateError } = await supabase
          .from('Following')
          .update({ following: updatedFollowing })
          .eq('uuid', profileData.id);

        if (updateError) {
          throw updateError;
        }

        res.status(200).json(true);
      } else {
        res.status(404).json({ message: 'Following data not found' });
      }
    } else {
      // a guest. So we are going to return false and eventually make user login
      res.status(200).json(false);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/checkFollowing', authenticateToken, async (req, res) => {
  try {
    const email = req.body.decoded;
    const streamId = req.body.username; // the stream's id

    // getting profile for uuid
    const { data: profileData, error: profileError } = await supabase
      .from('Profile')
      .select('id')
      .eq('email', email)
      .single();

    if (profileData) {
      // if uuid exists
      const { data: followingData, error: followingError } = await supabase
        .from('Following')
        .select('following')
        .eq('uuid', profileData.id)
        .single();

      if (followingData) {
        if (followingData.following[streamId]) {
          res.status(200).json(true);
        } else {
          res.status(200).json(false);
        }
      } else {
        res.status(404).json({ message: 'Following data not found' });
      }
    } else {
      // a guest. So we are going to return false and eventually make user login
      res.status(200).json(false);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/getFollowingList', authenticateToken, async (req, res) => {
  try {
    const email = req.body.decoded;

    // getting profile for uuid
    const { data: profileData, error: profileError } = await supabase
      .from('Profile')
      .select('id')
      .eq('email', email)
      .single();

    if (profileError) {
      throw profileError;
    }

    if (profileData) {
      const { data: followingData, error: followingError } = await supabase
        .from('Following')
        .select('following')
        .eq('uuid', profileData.id)
        .single();

      if (followingError) {
        throw followingError;
      }

      if (followingData) {
        res.status(200).json(followingData.following);
      } else {
        res.status(200).json({});
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

module.exports = router;
