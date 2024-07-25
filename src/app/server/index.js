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

io.on('connection', (socket) => {
  socket.on('send_message', (msg) => {
    socket.broadcast.emit('receive_message', msg);
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
    // console.log('User disconnected');
  });
});
