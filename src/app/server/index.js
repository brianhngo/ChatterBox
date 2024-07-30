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

const validateToken = async (token) => {
  try {
    const decoded = await jwt.verify(token, process.env.JWT_KEY);

    const { data, error } = await supabase
      .from('Profile')
      .select('*')
      .eq('email', decoded.email)
      .single();
    if (data) {
      return data;
    } else {
      console.log('false');
      return false;
    }
  } catch (error) {
    throw new Error('Invalid token');
  }
};

io.on('connection', (socket) => {
  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on('send_message', async (data) => {
    const { message, room, token } = data;
    if (!token) {
      console.log('token does not exist');
      socket.emit('auth_error', 'Authentication required to send messages');
    } else {
      try {
        // Validate the token
        const decoded = await validateToken(token);
        console.log(decoded);
        if (decoded) {
          // Attach user info to socket for this event
          const formattedMessage = `${decoded.username}: ${message}`;
          io.to(room).emit('receive_message', formattedMessage);
        } else {
          // Emit an authentication error event
          socket.emit('auth_error', 'Authentication required to send messages');
        }
      } catch (error) {
        console.error(error);
        socket.emit('auth_error', 'Authentication required to send messages');
      }
    }
  });

  socket.on('leave_room', (room) => {
    socket.leave(room);
    console.log(`User left room:${room}`);
  });

  // socket.on('update_user_role', ({ user, role }) => {
  //   io.emit('user_role_updated', { user, role });
  // });

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
