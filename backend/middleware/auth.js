<<<<<<< HEAD
const jwt = require("jsonwebtoken");

function auth(requiredRole) {
  return (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // { id, role }

      if (requiredRole && req.user.role !== requiredRole) {
        return res.status(403).json({ msg: "Forbidden: wrong role" });
      }

      next();
    } catch (err) {
      res.status(401).json({ msg: "Token invalid" });
    }
  };
}

module.exports = auth;
=======
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401);
      next(new Error('Not authorized, token failed'));
    }
  }

  if (!token) {
    res.status(401);
    next(new Error('Not authorized, no token'));
  }
};

const roleCheck = (...allowedRoles) => {
  return (req, res, next) => {
    if (req.user && allowedRoles.includes(req.user.role)) {
      next();
    } else {
      res.status(403);
      next(new Error('Forbidden: You do not have the required role.'));
    }
  };
};

module.exports = { authMiddleware, roleCheck };
>>>>>>> fa6abe6b431ea85f4462a5dfe01a7153893ea3ab
