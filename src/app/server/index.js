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
const { default: axios } = require('axios');

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

  socket.on('set_game', (data) => {
    const { streamsId, text, token } = data;
    socket.emit('changed_game', text);
  });

  socket.on('fail_setgame', () => {
    socket.emit('failed_setgame2');
  });

  socket.on('fail_changeTitle', () => {
    socket.emit('failed_changeTitle2');
  });

  socket.on('fail_changeDescription', () => {
    socket.emit('failed_changeDescription2');
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

const games = [
  {
    id: 1,
    name: 'Dota2',
    image: '/dota2.png',
    genre: ['Multiplayer', 'MOBA'],
    viewing: 1200,
  },
  {
    id: 2,
    name: 'Fortnite',
    image: '/fortnite.jpeg',
    genre: ['Battle Royal', 'FPS', 'Multiplayer'],
    viewing: 1200,
  },
  {
    id: 3,
    name: 'League of Legends',
    image: '/LeagueOfLegends.jpg',
    genre: ['Multiplayer', 'MOBA'],
    viewing: 1200,
  },
  {
    id: 4,
    name: 'Heartstone',
    image: '/heartstone.jpg',
    genre: ['PvP', 'Strategy'],
    viewing: 1200,
  },
  {
    id: 5,
    name: 'Overwatch2',
    image: '/Overwatch2.webp',
    genre: ['Arena', 'Multiplayer'],
    viewing: 1200,
  },
  {
    id: 6,
    name: 'World of Warcraft',
    image: '/wow.jpg',
    genre: ['MMO', 'Multiplayer'],
    viewing: 0,
  },
  {
    id: 7,
    name: 'Call of Duty',
    image: '/cod.jpg',
    genre: ['Battle Royal', 'FPS', 'Multiplayer'],
    viewing: 0,
  },
  {
    id: 8,
    name: 'Apex Legends',
    image: '/apex.jpg',
    genre: ['Battle Royal', 'FPS', 'Multiplayer'],
    viewing: 0,
  },
  {
    id: 8,
    name: 'Podcasting',
    image: '/podcasting.png',
    genre: ['Single', 'Listening'],
    viewing: 0,
  },
];

app.put('/getBrowseData', async (req, res) => {
  try {
    // Query Supabase to get live channels with their profile data
    const { data, error } = await supabase
      .from('Channel')
      .select(
        `
        *,
        Profile(id, username)
      `
      )
      .eq('Status', true);

    if (error) {
      throw error;
    }

    // Define an object to store viewer counts for each game
    const genreViewerCounts = {
      'league of legends': 0,
      dota2: 0,
      heartstone: 0,
      'world of warcraft': 0,
      'apex legends': 0,
      fortnite: 0,
      podcasting: 0,
      overwatch2: 0,
      'call of duty': 0,
      pubg: 0,
    };

    // Process each channel entry
    data.forEach((entry) => {
      const username = entry.Profile.username;
      const gameGenre = entry.Game; // Adjust based on actual column name

      // Get the viewer count from roomViewersMap
      const viewers = roomViewersMap.get(username) || [];

      const viewerCount = viewers.length;

      // Add the viewer count to the corresponding game genre
      if (genreViewerCounts.hasOwnProperty(gameGenre)) {
        genreViewerCounts[gameGenre] += viewerCount;
      }
    });

    // Update the games array with the viewer counts from genreViewerCounts
    const updatedGames = games.map((game) => {
      const lowerCaseName = game.name.toLowerCase();
      if (genreViewerCounts.hasOwnProperty(lowerCaseName)) {
        return {
          ...game,
          viewing: genreViewerCounts[lowerCaseName],
        };
      }
      return game;
    });

    // Send the updated games array as the response
    res.json(updatedGames);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
});

app.put('/getBrowseDataStreamer', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('Channel')
      .select(
        `
        Game,
        Title,
        Description,
        Profile(id, username)
      `
      )
      .eq('Status', true);

    if (error) {
      throw error;
    }

    if (data) {
      // Add the image field based on the game name
      const updatedData = data.map((channel) => {
        // Find the corresponding game object
        const game = games.find(
          (g) => g.name.toLowerCase() === channel.Game.toLowerCase()
        );

        // Add the image field to the channel object
        return {
          ...channel,
          image: game ? game.image : null, // Set image to null if no match is found
        };
      });

      console.log(updatedData);
      res.json(updatedData);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
});
