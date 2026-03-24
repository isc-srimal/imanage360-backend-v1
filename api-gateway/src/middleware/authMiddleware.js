const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).send('A token is required for authentication');
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send('Invalid Token');
  }
  return next();
};

// Middleware to verify admin role
const isAdmin = (req, res, next) => {
  if (req.user.role !== '1') {
    return res.status(403).send('Admin access required');
  }
  next();
};

module.exports = { verifyToken, isAdmin };
