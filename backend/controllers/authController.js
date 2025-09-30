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

// Logout untuk regular JWT (client-side logout)
const logoutUser = async (req, res) => {
  try {
    // Untuk JWT, logout dilakukan di client-side dengan menghapus token
    // Server tidak perlu menyimpan blacklist token karena JWT stateless
    res.json({ 
      message: "Logout berhasil",
      instructions: "Token telah dihapus dari client. Silakan hapus token dari localStorage/sessionStorage." 
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: "Gagal logout" });
  }
};

// Logout untuk Google OAuth (server-side session logout)
const logoutGoogleUser = async (req, res) => {
  try {
    // Destroy session untuk Google OAuth
    req.logout((err) => {
      if (err) {
        console.error('Passport logout error:', err);
        return res.status(500).json({ message: "Gagal logout dari Google session" });
      }
      
      // Destroy session
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destroy error:', err);
          return res.status(500).json({ message: "Gagal menghapus session" });
        }
        
        // Clear session cookie
        res.clearCookie('connect.sid'); // default session cookie name
        res.json({ 
          message: "Logout Google berhasil",
          instructions: "Google session telah dihapus. Anda telah logout dari aplikasi." 
        });
      });
    });
  } catch (error) {
    console.error('Google logout error:', error);
    res.status(500).json({ message: "Gagal logout Google" });
  }
};

// Universal logout (handles both JWT and Google OAuth)
const universalLogout = async (req, res) => {
  try {
    // Check if user logged in via Google OAuth (has session)
    if (req.session && req.session.passport) {
      // Google OAuth logout
      req.logout((err) => {
        if (err) {
          console.error('Passport logout error:', err);
        }
        
        req.session.destroy((err) => {
          if (err) {
            console.error('Session destroy error:', err);
          }
          res.clearCookie('connect.sid');
          res.json({ 
            message: "Universal logout berhasil",
            type: "google_oauth",
            instructions: "Google session dan token telah dihapus." 
          });
        });
      });
    } else {
      // Regular JWT logout (client-side)
      res.json({ 
        message: "Universal logout berhasil",
        type: "jwt_token",
        instructions: "Token JWT telah dihapus. Silakan hapus token dari client storage." 
      });
    }
  } catch (error) {
    console.error('Universal logout error:', error);
    res.status(500).json({ message: "Gagal logout" });
  }
};

module.exports = { 
  registerUser, 
  loginUser, 
  logoutUser, 
  logoutGoogleUser, 
  universalLogout 
};
