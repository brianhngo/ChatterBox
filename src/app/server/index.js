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

const { Server } = require('socket.io');

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
  console.log(`A user connected ${socket.id}`);

  socket.on('send_message', (msg) => {
    socket.broadcast.emit('receive_message', msg);
  });

  socket.on('disconnect', () => {
    // console.log('User disconnected');
  });
});
