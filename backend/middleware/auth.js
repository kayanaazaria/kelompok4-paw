const jwt = require('jsonwebtoken');
const mongoose = require('mongoose'); // tambahin ini

function authMiddleware(req, res, next) {
  if (process.env.NODE_ENV === 'development') {
    // generate ObjectId valid
    req.user = { id: new mongoose.Types.ObjectId(), role: 'HSE' };
    return next();
  }

  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ message: 'No token' });

  const token = header.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}


function roleCheck(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Forbidden: role mismatch' });
    }
    next();
  }
}

module.exports = { authMiddleware, roleCheck };