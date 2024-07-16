const jwt = require('jsonwebtoken');

async function authenticateToken(req, res, next) {
  const { token } = req.body;

  try {
    // checks if token exist
    if (!token) {
      req.body.guest = true;
      throw 'Token doesnt exist';
    }

    // verifies token to see if its valid
    const decoded = await jwt.verify(token, process.env.JWT_KEY);

    // After decoded is defined. Going to add a property on req.body os we can use it to next route
    req.body.decoded = decoded.email;

    next();
  } catch (error) {
    // fake token !! HACKER!!
    console.log('token error');
    return res.status(401).json(false);
  }
}

module.exports = authenticateToken;
