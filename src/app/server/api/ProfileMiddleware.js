const jwt = require('jsonwebtoken');

async function authenticateToken(req, res, next) {
  const { token } = req.body;

  try {
    // checks if token exist

    if (token === null) {
      req.body.guest = true;
      res.status(200).json(false);
    } else {
      // verifies token to see if its valid
      const decoded = await jwt.verify(token, process.env.JWT_KEY);

      // After decoded is defined. Going to add a property on req.body os we can use it to next route
      req.body.decoded = decoded.email;
      req.body.decodedUID = decoded.uid;

      next();
    }
  } catch (error) {
    // fake token !! HACKER!!

    return res.status(200).json(false);
  }
}

module.exports = authenticateToken;
