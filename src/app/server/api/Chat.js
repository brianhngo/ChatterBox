const router = require('express').Router();
const supabase = require('../database/supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const authenticateToken = require('./ProfileMiddleware');
const isSuperAdminOrHost = require('./ChatMiddleware');
const cors = require('cors');
const { profile } = require('console');
router.use(cors());

// this page will be responsible for Chat commands routing

// http://localhost:3001/api/chat

// PUT http://localhost:3001/api/chat/setAdmin

// 1. Need to check if the user doing this command is Host.
// 1A. First Check Token. If Token matches => User is logged in
// 2A. Check if the admin is on their own page as admin.
// 3A. Then set a user as admin
// !!
router.put(
  '/setAdmin',
  authenticateToken,
  isSuperAdminOrHost,
  async (req, res) => {
    try {
      const { role, decodedUID, streamsId, decoded, selectedUser } = req.body;
      // selectedUser is recipient , decoded - ac
      if (role === 'superadmin' || role === 'host') {
        // set channels profile and add to admin streamsId
        // get selectedUsers Info
        const { data: profileData, error: profileError } = await supabase
          .from('Profile')
          .select('id')
          .eq('username', streamsId)
          .single();

        const { data: channelInfo, error: channelError } = await supabase
          .from('Channel')
          .select('adminUsers')
          .eq('uuid', profileData.id)
          .single();

        if (channelInfo) {
          channelInfo.adminUsers[selectedUser] = true;

          await supabase
            .from('Channel')
            .update({
              adminUsers: channelInfo.adminUsers,
            })
            .eq('uuid', profileData.id);

          res.status(200).json(true);
        }
      } else {
        res.status(200).json(false);
      }
    } catch (error) {
      console.error(error);
    }
  }
);

// PUT http://localhost:3001/api/chat/removeAdmin
//!!
router.put(
  '/removeAdmin',
  authenticateToken,
  isSuperAdminOrHost,
  async (req, res) => {
    try {
      const { role, decodedUID, streamsId, decoded, selectedUser } = req.body;
      // selectedUser is recipient , decoded - ac
      if (role === 'superadmin' || role === 'host') {
        // set channels profile and add to admin streamsId
        // get selectedUsers Info
        const { data: profileData, error: profileError } = await supabase
          .from('Profile')
          .select('id')
          .eq('username', streamsId)
          .single();

        const { data: channelInfo, error: channelError } = await supabase
          .from('Channel')
          .select('adminUsers')
          .eq('uuid', profileData.id)
          .single();

        if (channelInfo) {
          delete channelInfo.adminUsers[selectedUser];
          await supabase
            .from('Channel')
            .update({
              adminUsers: channelInfo.adminUsers,
            })
            .eq('uuid', profileData.id);

          res.status(200).json(true);
        }
      } else {
        res.status(200).json(false);
      }
    } catch (error) {
      console.error(error);
    }
  }
);

// PUT http://localhost:3001/api/chat/muteUser
// !!

router.put(
  '/muteUser',
  authenticateToken,
  isSuperAdminOrHost,
  async (req, res) => {
    try {
      const { role, decodedUID, streamsId, decoded, selectedUser } = req.body;

      if (role === 'superadmin' || role === 'host' || role === 'admin') {
        const { data: profileData, error: profileError } = await supabase
          .from('Profile')
          .select('id')
          .eq('username', streamsId)
          .single();
        // 3 cases where you can mute
        const { data: channelInfo, error: channelError } = await supabase
          .from('Channel')
          .select('mutedUsers')
          .eq('uuid', profileData.id)
          .single();
        if (channelInfo) {
          channelInfo.mutedUsers[selectedUser] = true;
          await supabase
            .from('Channel')
            .update({
              mutedUsers: channelInfo.mutedUsers,
            })
            .eq('uuid', profileData.id);
          res.status(200).json(true);
        }
      } else {
        res.status(200).json(false);
      }
    } catch (error) {
      console.error(error);
    }
  }
);

// unmuting user
// localhost:3001/api/chat/unmuteUser !!
router.put(
  '/unmuteUser',
  authenticateToken,
  isSuperAdminOrHost,
  async (req, res) => {
    try {
      const { role, decodedUID, streamsId, decoded, selectedUser } = req.body;

      if (role === 'superadmin' || role === 'host' || role === 'admin') {
        const { data: profileData, error: profileError } = await supabase
          .from('Profile')
          .select('id')
          .eq('username', streamsId)
          .single();
        // 3 cases where you can mute
        const { data: channelInfo, error: channelError } = await supabase
          .from('Channel')
          .select('mutedUsers')
          .eq('uuid', profileData.id)
          .single();
        if (channelInfo) {
          delete channelInfo.mutedUsers[selectedUser];
          await supabase
            .from('Channel')
            .update({
              mutedUsers: channelInfo.mutedUsers,
            })
            .eq('uuid', profileData.id);
          res.status(200).json(true);
        }
      } else {
        res.status(200).json(false);
      }
    } catch (error) {
      console.error(error);
    }
  }
);

// ban user
// localhost:3001/api/chat/banUser !!

router.put(
  '/banUser',
  authenticateToken,
  isSuperAdminOrHost,
  async (req, res) => {
    try {
      const { role, decodedUID, streamsId, decoded, selectedUser } = req.body;

      if (role === 'superadmin' || role === 'host' || role === 'admin') {
        const { data: profileData, error: profileError } = await supabase
          .from('Profile')
          .select('id')
          .eq('username', streamsId)
          .single();
        // 3 cases where you can mute
        const { data: channelInfo, error: channelError } = await supabase
          .from('Channel')
          .select('bannedUsers')
          .eq('uuid', profileData.id)
          .single();
        if (channelInfo) {
          channelInfo.bannedUsers[selectedUser] = true;
          await supabase
            .from('Channel')
            .update({
              bannedUsers: channelInfo.bannedUsers,
            })
            .eq('uuid', profileData.id);
          res.status(200).json(true);
        }
      } else {
        res.status(200).json(false);
      }
    } catch (error) {
      console.error(error);
    }
  }
);

// unban user
// localhost:3001/api/chat/unbanUser

router.put(
  '/unbanUser',
  authenticateToken,
  isSuperAdminOrHost,
  async (req, res) => {
    try {
      const { role, decodedUID, streamsId, decoded, selectedUser } = req.body;

      if (role === 'superadmin' || role === 'host' || role === 'admin') {
        const { data: profileData, error: profileError } = await supabase
          .from('Profile')
          .select('id')
          .eq('username', streamsId)
          .single();

        // 3 cases where you can mute
        const { data: channelInfo, error: channelError } = await supabase
          .from('Channel')
          .select('bannedUsers')
          .eq('uuid', profileData.id)
          .single();
        if (channelInfo) {
          delete channelInfo.bannedUsers[selectedUser];
          await supabase
            .from('Channel')
            .update({
              bannedUsers: channelInfo.bannedUsers,
            })
            .eq('uuid', profileData.id);
          res.status(200).json(true);
        }
      } else {
        res.status(200).json(false);
      }
    } catch (error) {
      console.error(error);
    }
  }
);

// update title Name

router.put(
  '/updateTitle',
  authenticateToken,
  isSuperAdminOrHost,
  async (req, res) => {
    try {
      const { role, decodedUID, streamsId, decoded, selectedUser, text } =
        req.body;

      if (role === 'superadmin' || role === 'host' || role === 'admin') {
        const { data: profileData, error: profileError } = await supabase
          .from('Profile')
          .select('id')
          .eq('username', streamsId)
          .single();
        // 3 cases where you can mute
        const { data: channelInfo, error: channelError } = await supabase
          .from('Channel')
          .update({
            Title: text,
          })
          .eq('uuid', profileData.id);

        res.status(200).json(true);
      } else {
        res.status(200).json(false);
      }
    } catch (error) {
      console.error(error);
    }
  }
);

router.put(
  '/updateDescription',
  authenticateToken,
  isSuperAdminOrHost,
  async (req, res) => {
    try {
      const { role, decodedUID, streamsId, decoded, selectedUser, text } =
        req.body;

      if (role === 'superadmin' || role === 'host' || role === 'admin') {
        const { data: profileData, error: profileError } = await supabase
          .from('Profile')
          .select('id')
          .eq('username', streamsId)
          .single();
        // 3 cases where you can mute
        const { data: channelInfo, error: channelError } = await supabase
          .from('Channel')
          .update({
            Description: text,
          })
          .eq('uuid', profileData.id);

        res.status(200).json(true);
      } else {
        res.status(200).json(false);
      }
    } catch (error) {
      console.error(error);
    }
  }
);

// Only SuperAdmin

router.put(
  '/suspend',
  authenticateToken,
  isSuperAdminOrHost,
  async (req, res) => {
    try {
      const { role, decodedUID, streamsId, decoded, selectedUser } = req.body;

      if (role === 'superadmin') {
        const { data: profileData, error: profileError } = await supabase
          .from('Profile')
          .select('id')
          .eq('username', streamsId)
          .single();
        // 3 cases where you can mute
        const { data: channelInfo, error: channelError } = await supabase
          .from('Channel')
          .update({
            Status: false,
            IsSuspended: true,
          })
          .eq('uuid', profileData.id);

        res.status(200).json(true);
      } else {
        res.status(200).json(false);
      }
    } catch (error) {
      console.error(error);
    }
  }
);

router.put(
  '/unsuspend',
  authenticateToken,
  isSuperAdminOrHost,
  async (req, res) => {
    try {
      const { role, decodedUID, streamsId, decoded, selectedUser } = req.body;

      if (role === 'superadmin') {
        const { data: profileData, error: profileError } = await supabase
          .from('Profile')
          .select('id')
          .eq('username', streamsId)
          .single();
        // 3 cases where you can mute
        const { data: channelInfo, error: channelError } = await supabase
          .from('Channel')
          .update({
            IsSuspended: false,
          })
          .eq('uuid', profileData.id);

        res.status(200).json(true);
      } else {
        res.status(200).json(false);
      }
    } catch (error) {
      console.error(error);
    }
  }
);

module.exports = router;
