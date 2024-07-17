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
const sendEmail = require('./sendEmail');
// PUT /api/channel/getUserInformation

router.put('/getUserInformation', async (req, res) => {
  try {
    const { username } = req.body;

    // Fetching the users profile based upon username
    const { data: profileData, error: profileError } = await supabase
      .from('Profile')
      .select('*')
      .eq('username', username)
      .single();

    if (profileError) {
      res.status(400).json({
        message: 'Profile Doesnt exist',
      });
    }

    // Finding the channel information via profile uuid
    const { data: channelData, error: channelError } = await supabase
      .from('Channel')
      .select('*')
      .eq('uuid', profileData.id)
      .single();

    if (channelError) {
      res.status(400).json({
        message: 'Channel doesnt exist',
      });
    }

    res.status(200).json({
      uuid: profileData.id,
      username: profileData.username,
      followers: channelData.FollowersCount,
      sub: channelData.SubCount,
      status: channelData.Status,
    });
  } catch (error) {
    console.error('Internal Server Error:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// api/channel/previews
router.put('/previews', async (req, res) => {
  try {
    // getting 4 active channels

    const { data, error } = await supabase
      .from('Channel')
      .select('*')
      .eq('Status', true)
      .limit(4);

    if (error) {
      throw error;
    } else {
      res.status(200).json(data);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// api/channel/goLive

// api/channel/goLive

router.put('/goLive', authenticateToken, async (req, res) => {
  try {
    const email = req.body.decoded; // from authenticateToken

    // Fetch profile to get UUID
    const { data: profileData, error: profileError } = await supabase
      .from('Profile')
      .select('id, username')
      .eq('email', email)
      .single();

    if (profileError || !profileData) {
      res.status(404).json({ message: 'Profile not found' });
      return;
    }

    const profileUUID = profileData.id;

    // Update channel status to true using profile UUID
    await supabase
      .from('Channel')
      .update({ Status: true })
      .eq('uuid', profileUUID);

    res.status(200).json({ username: profileData.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/goOffline', authenticateToken, async (req, res) => {
  try {
    const email = req.body.decoded; // from authenticateToken

    // Fetch profile to get UUID
    const { data: profileData, error: profileError } = await supabase
      .from('Profile')
      .select('id, username')
      .eq('email', email)
      .single();

    if (profileError || !profileData) {
      res.status(404).json({ message: 'Profile not found' });
      return;
    }

    const profileUUID = profileData.id;

    // Update channel status to false using profile UUID
    await supabase
      .from('Channel')
      .update({ Status: false })
      .eq('uuid', profileUUID);

    res.status(200).json({ username: profileData.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/checkStatus', authenticateToken, async (req, res) => {
  try {
    const email = req.body.decoded; // from authenticateToken

    // Fetch profile to get UUID
    const { data: profileData, error: profileError } = await supabase
      .from('Profile')
      .select('id, username')
      .eq('email', email)
      .single();

    if (profileError || !profileData) {
      res.status(404).json({ message: 'Profile not found' });
      return;
    }

    const profileUUID = profileData.id;

    // Check channel status using profile UUID
    const { data: channelData, error: channelError } = await supabase
      .from('Channel')
      .select('Status')
      .eq('uuid', profileUUID)
      .single();

    if (channelError || !channelData) {
      res.status(404).json({ message: 'Channel status not found' });
      return;
    }

    if (channelData.Status) {
      res.status(200).json(true);
    } else {
      res.status(200).json(false);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
