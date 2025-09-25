const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // ✅ Import langsung User

const generateToken = (id, role, username) => {
  return jwt.sign({ id, role, username }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const registerUser = async (req, res, next) => {
  const { username, email, password, role, department } = req.body;
  try {
    if (!username || !email || !password || !role) {
      res.status(400);
      return next(new Error('Please provide all required fields'));
    }

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      res.status(400);
      return next(new Error('User already exists'));
    }

    const user = await User.create({ username, email, password, role, department });

    if (user) {
      res.status(201).json({
        _id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role, user.username)
      });
    }
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role, user.username)
      });
    } else {
      res.status(401);
      return next(new Error('Invalid email or password'));
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { registerUser, loginUser };
