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

// PUT /api/channel/getUserInformation !!

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
      res.status(200).json({
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
      res.status(200).json({
        message: 'Channel doesnt exist',
      });
    }

    res.status(200).json({
      uuid: profileData.id,
      username: profileData.username,
      followers: channelData.FollowersCount,
      sub: channelData.SubCount,
      status: channelData.Status,
      title: channelData.Title,
      description: channelData.Description,
      isSuspended: channelData.IsSuspended,
      game: channelData.Game,
    });
  } catch (error) {
    console.error('Internal Server Error:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// api/channel/previews !!
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

// api/channel/goLive!!

router.put('/goLive', authenticateToken, async (req, res) => {
  try {
    const email = req.body.decoded; // from authenticateToken
    const uid = req.body.decodedUID;

    const { data: channelDataCheck, error: channelDataChecl } = await supabase
      .from('Channel')
      .select('IsSuspended')
      .eq('uuid', uid);
    if (channelDataCheck.IsSuspended) {
      res.status(200).json(false);
    } else {
      // Fetch profile to get UUID
      const { data: profileData, error: profileError } = await supabase
        .from('Profile')
        .select('id, username')
        .eq('email', email)
        .single();

      if (profileError || !profileData) {
        res.status(200).json({ message: 'Profile not found' });
        return;
      }

      const profileUUID = profileData.id;

      // Update channel status to true using profile UUID
      await supabase
        .from('Channel')
        .update({ Status: true })
        .eq('uuid', profileUUID);

      // getting all the  accounts name and then matching it with their profile data
      const { data: FollowersData, error: FollowersError } = await supabase
        .from('Following')
        .select('following, uuid');

      let index = email.indexOf('@');
      let username = email.slice(0, index);

      if (FollowersData) {
        const filteredEntries = FollowersData.filter((entry) => {
          const followersJson = entry.following;

          return followersJson && Object.keys(followersJson).includes(username);
        });

        const { data: profilesData, error: profilesError } = await supabase
          .from('Profile')
          .select('email')
          .in(
            'id',
            filteredEntries.map((element, key) => element.uuid)
          );

        if (profilesData) {
          profilesData.forEach((profile) => {
            sendEmail(
              profile.email,
              'Now Live on Chatterbox',
              profileData.username
            ); // Assuming you have profile.username
          });

          res.status(200).json({ username: profileData.username });
        }
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// puts status into Offline!!
router.put('/goOffline', authenticateToken, async (req, res) => {
  try {
    const email = req.body.decoded; // from authenticateToken
    const uid = req.body.decodedUID;

    // Update channel status to false using profile UUID
    await supabase.from('Channel').update({ Status: false }).eq('uuid', uid);

    res.status(200).json({ uid: uid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// Checks Streaming Status (Offline/Online), // If You are own your own channel!!
router.put('/checkStatus', authenticateToken, async (req, res) => {
  try {
    const { token, streamsId, decoded, decodedUID } = req.body;

    const { data: profileData, error: profileError } = await supabase
      .from('Profile')
      .select('*')
      .eq('id', decodedUID)
      .single();

    if (profileData) {
      if (streamsId === profileData.username) {
        // its the users own channel

        const { data: channelData, error: channelError } = await supabase
          .from('Channel')
          .select('Status')
          .eq('uuid', decodedUID)
          .single();

        if (channelData.Status) {
          //  Users Own Stream and is Streaming
          res.status(200).json({
            statusLive: true,
            hosting: true,
          });
        } else {
          res.status(200).json({
            statusLive: false,
            hosting: true,
          });
        }
      }
    } else {
      // its not the users own channel

      // gets the id from Profile DB
      const { data: userData, error: userError } = await supabase
        .from('Profile')
        .select('id')
        .eq('username', streamsId)
        .single();

      if (userData) {
        console.log(userData, streamsId);
        // if the data exists
        const { data: channelData, error: channelError } = await supabase
          .from('Channel')
          .select('Status')
          .eq('uuid', userData.id)
          .single();

        if (channelData.Status) {
          //  Not Users Own Stream and is Streaming
          res.status(200).json({
            statusLive: true,
            hosting: false,
          });
        } else {
          res.status(200).json({
            // Not users Own Stream and is not streaming
            statusLive: false,
            hosting: false,
          });
        }
      } else {
        throw 'Error';
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
