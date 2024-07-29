const jwt = require('jsonwebtoken');

const authenticateSocket = async (socket, next) => {
  const token = socket.handshake.query.token; // or socket.handshake.headers['authorization']

  try {
    if (!token) {
      console.log('hello');
      return next(new Error('No token provided')); // No token
    }

    const decoded = await jwt.verify(token, process.env.JWT_KEY);

    // Attach user info to socket
    socket.user = {
      email: decoded.email,
      uid: decoded.uid,
    };
    console.log('hi');
    next(); // Proceed with connection
  } catch (error) {
    console.log('Token verification error:', error);
    next(new Error('Authentication error')); // Token error
  }
};

module.exports = authenticateSocket;
