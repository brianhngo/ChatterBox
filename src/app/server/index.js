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
    console.log(error);
    return false;
  }
};

const userSocketMap = new Map();

io.on('connection', (socket) => {
  socket.on('join_room', async ({ room, token }) => {
    const decoded = await validateToken(token, room);
    if (decoded) {
      // token
      userSocketMap.set(decoded.username, socket.id);

      socket.join(room);
      console.log(`${socket.id} joined room: ${room}`);
    } else if (decoded === 'banned' || decoded === false) {
      // failed token
      console.log('failed Token');
      socket.join(room);
      console.log(`${socket.id} joined room: ${room}`);
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
    socket.emit('admin_user', 'You had made this user admin');
  });

  // Error set as admin
  socket.on('failed_setAdminUSER', async (data) => {
    socket.emit('failed_setAdmin2');
  });

  // Remove as Admin
  socket.on('unsetAdmin_user', async (data) => {
    socket.emit('unsetAdmin_user2', 'You have remove this user as admin');
  });

  socket.on('failed_unsetAdminUser', async (data) => {
    socket.emit('failed_unsetAdminUser2');
  });

  // Ban user
  socket.on('ban_success', ({ user, role }) => {
    io.emit('ban_successful');
  });

  // unban user
  socket.on('ban_failed', ({}) => {
    io.emit('failed_ban2');
  });

  // unban user
  socket.on('unban_user', ({}) => {
    io.emit('unban_user2');
  });

  socket.on('failed_unban', ({}) => {
    io.emit('failed_unban2');
  });

  socket.on('leave_room', (room) => {
    socket.leave(room);
    for (const [username, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(username);
        break;
      }
    }
    console.log(`User left room:${room}`);
  });

  // socket.on('mute_user', ({ user }) => {
  //   io.emit('user_muted', { user });
  // });

  // socket.on('unmute_user', ({ user }) => {
  //   io.emit('user_unmuted', { user });
  // });

  // socket.on('ban_user', ({ user }) => {
  //   io.emit('user_banned', { user });
  // });

  // socket.on('unban_user', ({ user }) => {
  //   io.emit('user_unbanned', { user });
  // });

  // socket.on('suspend_channel', ({ streamId }) => {
  //   io.emit('channel_suspended', { streamId });
  // });

  // socket.on('unsuspend_channel', ({ streamId }) => {
  //   io.emit('channel_unsuspended', { streamId });
  // });

  // socket.on('update_title', ({ streamId, title }) => {
  //   io.emit('title_updated', { streamId, title });
  // });

  // socket.on('update_description', ({ streamId, description }) => {
  //   io.emit('description_updated', { streamId, description });
  // });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
