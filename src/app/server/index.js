const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const profileRouter = require('./api/Profile');
const channelRouter = require('./api/Channel');
const followingRouter = require('./api/Following');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
dotenv.config();
const chatRouter = require('./api/Chat');
const supabase = require('./database/supabase');

const { Server } = require('socket.io');
const { chat } = require('googleapis/build/src/apis/chat');

const app = express();
const port = process.env.PORT;

// packages we need
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/profile', profileRouter);
app.use('/api/channel', channelRouter);
app.use('/api/following', followingRouter);
app.use('/api/chat', chatRouter);
const authenticateSocket = require('./api/SocketMiddleware');

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],

    credentials: true,
  },
});

// Function to validate token

const validateToken = async (token, room) => {
  try {
    const decoded = await jwt.verify(token, process.env.JWT_KEY);

    // Fetch user data based on room (assumed to be the username)
    const { data: userData, error: userError } = await supabase
      .from('Profile')
      .select('id')
      .eq('username', room)
      .single();

    const { data: viewersData, error: viewerError } = await supabase
      .from('Profile')
      .select('username')
      .eq('id', decoded.uid)
      .single();

    if (userData) {
      // Fetch channel data based on user ID
      const { data: channelData, error: channelError } = await supabase
        .from('Channel')
        .select('mutedUsers, bannedUsers')
        .eq('uuid', userData.id)
        .single();

      if (channelData) {
        // Check if the user is banned or muted

        if (
          channelData.bannedUsers[viewersData.username]
          // ||
          // channelData.mutedUsers[viewersData.username]
        ) {
          return 'banned';
        } else {
          // Fetch profile data if the user is not banned or muted
          const { data, error } = await supabase
            .from('Profile')
            .select('*')
            .eq('email', decoded.email)
            .single();

          if (data) {
            console.log('data');
            return data;
          } else {
            return false;
          }
        }
      } else {
        throw new Error('Error fetching channel data');
      }
    } else {
      console.log('User data not found');
      throw new Error('Error fetching user data');
    }
  } catch (error) {
    return false;
  }
};

const userSocketMap = new Map();
const roomViewersMap = new Map();

io.on('connection', (socket) => {
  // Connection
  socket.on('join_room', async ({ room, token }) => {
    try {
      console.log('hi');
      const decoded = await validateToken(token, room);

      if (decoded) {
        // Map the username to socket ID
        userSocketMap.set(decoded.username, socket.id);
      }

      // Initialize room viewer count if not set
      if (!roomViewersMap.has(room)) {
        roomViewersMap.set(room, []);
      }

      // Add socket.id to the list of viewers in the room

      socket.join(room);

      if (!roomViewersMap.get(room).includes(socket.id)) {
        !roomViewersMap.get(room).push(socket.id);
      }

      io.to(room).emit('viewerCountUpdate', roomViewersMap.get(room).length);
    } catch (error) {
      console.error('Error validating token or joining room:', error);
    }
  });

  socket.on('send_message', async (data) => {
    const { message, room, token } = data;
    if (!token) {
      socket.emit('auth_error', 'Authentication required to send messages');
    } else {
      try {
        // Validate the token
        const decoded = await validateToken(token, room);

        if (decoded === false) {
          socket.emit('auth_error', 'Authentication required to send messages');
        } else if (decoded === 'banned') {
          // Emit an authentication error event

          socket.emit('your_muted', 'You been muted');
        } else {
          const formattedMessage = `${decoded.username}: ${message}`;
          io.to(room).emit('receive_message', formattedMessage);
        }
      } catch (error) {
        console.error(error);
        socket.emit('auth_error', 'Authentication required to send messages');
      }
    }
  });
  // Mute
  socket.on('mute_user', async (data) => {
    const { selectedUser, streamsId, token } = data;

    // To user doing action
    socket.emit('mute_user2', 'You have sucessfully muted the user');
    // To User receiving action

    socket
      .to(userSocketMap.get(selectedUser))
      .emit('receiving_mute', 'You been muted');
  });
  // error Mute
  socket.on('failed_muteUSER', async (data) => {
    socket.emit('failed_mute2', 'You cannot mute this user');
  });
  // Recipient of being muted

  // Unmute
  socket.on('unmute_user', async (data) => {
    const { selectedUser, streamsId, token } = data;

    // To user doing action
    socket.emit('unmute_user2', 'You have successfully unmute');
    // to User receiving action
    socket
      .to(userSocketMap.get(selectedUser))
      .emit('your_unmuted', 'You have successfully been unmuted');
  });
  // error unMute
  socket.on('failed_unmuteUSER', async (data) => {
    socket.emit('failed_unmute2', 'You cannot unmute this user');
  });
  // recipient of being unmuted

  // Set as Admin
  socket.on('setAdmin_user', async (data) => {
    const { selectedUser, streamsId, token } = data;
    socket.emit('admin_user', 'You had made this user admin');
    socket.to(userSocketMap.get(selectedUser)).emit('receivedUser_Admin');
  });

  // Error set as admin
  socket.on('failed_setAdminUSER', async (data) => {
    socket.emit('failed_setAdmin2');
  });

  // Remove as Admin
  socket.on('unsetAdmin_user', async (data) => {
    const { selectedUser, streamsId, token } = data;
    socket.emit('unsetAdmin_user2', 'You have remove this user as admin');
    socket.to(userSocketMap.get(selectedUser)).emit('receivedUser_NotAdmin');
  });

  socket.on('failed_unsetAdminUser', async (data) => {
    socket.emit('failed_unsetAdminUser2');
  });

  // Ban user
  socket.on('ban_success', async (data) => {
    const { selectedUser, streamsId, token } = data;
    console.log(selectedUser, userSocketMap.get(selectedUser), userSocketMap);
    socket.emit('ban_successful', 'banned');
    socket
      .to(userSocketMap.get(selectedUser))
      .emit('receivedUser_ban', 'you been banned');
  });

  // ban user failed
  socket.on('ban_failed', () => {
    socket.emit('ban_failed2');
  });

  // unban user
  socket.on('unban_user', (data) => {
    const { selectedUser, streamsId, token } = data;

    socket.emit('unban_user2');
    socket
      .to(userSocketMap.get(selectedUser))
      .emit('receivedUser_unban', 'you been banned');
  });

  // unban User failed
  socket.on('failed_unban', () => {
    socket.emit('failed_unban2');
  });

  // suspends user streaming channel
  socket.on('suspend_streamer', (data) => {
    const { selectedUser, streamsId, token } = data;
    socket.emit('confirmation_suspension');
    socket.to(userSocketMap.get(streamsId)).emit('receive_suspension');
  });
  // fails suspends user streaming
  socket.on('failsuspend_streamer', () => {
    socket.emit('failedsuspend_streamer2');
  });

  // unsuspend user's streaming channel
  socket.on('unsuspend_streamer', (data) => {
    const { selectedUser, streamsId, token } = data;
    socket.emit('confirmation_unsuspension');
    socket.to(userSocketMap.get(streamsId)).emit('receive_unsuspension');
  });

  socket.on('failunsuspend_streamer', () => {
    socket.emit('failunsuspend_streamer2');
  });

  socket.on('set_title', (data) => {
    const { streamsId, text, token } = data;

    socket.emit('changeTitle', text);
  });

  socket.on('set_description', (data) => {
    const { streamsId, text, token } = data;

    socket.emit('changeDescription', text);
  });

  socket.on('leave_room', (room) => {
    console.log('User requested to leave room:', room);

    // Remove the user from the room
    socket.leave(room);

    // Update user's room list
    const userRoomsList = userRooms.get(socket.id) || [];
    const index = userRoomsList.indexOf(room);
    if (index > -1) {
      userRoomsList.splice(index, 1);
      userRooms.set(socket.id, userRoomsList);
    }

    // Decrement the viewer count for the room
    if (roomViewersMap.has(room)) {
      const currentCount = roomViewersMap.get(room);
      if (currentCount > 0) {
        roomViewersMap.set(room, currentCount - 1);
        io.to(room).emit('viewerCountUpdate', roomViewersMap.get(room));
      }
    }

    console.log(`User left room: ${room}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    // Find the room associated with this socket
    let userRoom = null;

    for (const [room, viewers] of roomViewersMap.entries()) {
      if (viewers.includes(socket.id)) {
        userRoom = room;
        viewers.splice(viewers.indexOf(socket.id), 1); // Remove the socket ID from the array
        break;
      }
    }

    if (userRoom) {
      // Emit the updated viewer count
      io.to(userRoom).emit(
        'viewerCountUpdate',
        roomViewersMap.get(userRoom).length
      );
    } else {
      console.warn(`Room not found for disconnected socket: ${socket.id}`);
    }

    // Remove the user from the userSocketMap
    for (const [username, id] of userSocketMap.entries()) {
      if (id === socket.id) {
        userSocketMap.delete(username);
        break;
      }
    }
  });
});
