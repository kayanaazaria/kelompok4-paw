const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { blacklistToken, isTokenBlacklisted } = require('../utils/jwtBlacklist');

const generateToken = (id, role, username) => {
  return jwt.sign({ id, role, username }, process.env.JWT_SECRET, { expiresIn: '7d' });
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

// Logout untuk regular JWT (server-side blacklist + client-side cleanup)
const logoutUser = async (req, res) => {
  try {
    const token = req.token; // Dari authMiddleware
    const userId = req.user.id;

    if (token) {
      // Blacklist token di server
      await blacklistToken(token, userId, 'logout');
    }

    res.json({ 
      message: "Logout berhasil",
      instructions: "Token telah di-blacklist di server dan tidak valid lagi.",
      token_status: "blacklisted"
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: "Gagal logout" });
  }
};

// Logout untuk Google OAuth (destroy session + optional JWT blacklist if token provided)
const logoutGoogleUser = async (req, res) => {
  try {
    // --- Handle optional JWT token blacklist (if frontend stored and sends it) ---
    let tokenStatus = 'none';
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const alreadyBL = await isTokenBlacklisted(token);
        if (alreadyBL) {
          tokenStatus = 'already_blacklisted';
        } else {
          // Verify first to extract user id (ignore error -> treated as already invalid)
          let decoded = null;
            try { decoded = jwt.verify(token, process.env.JWT_SECRET); } catch (_) { /* ignore */ }
          await blacklistToken(token, decoded ? decoded.id : undefined, 'logout');
          tokenStatus = 'blacklisted';
        }
      } catch (e) {
        console.error('[GoogleLogout] Token blacklist error:', e.message);
        tokenStatus = 'blacklist_error';
      }
    }

    // --- Handle session logout (if any) ---
    const hasSession = !!(req.session && req.session.passport);
    if (!hasSession) {
      return res.json({
        message: 'Google OAuth logout processed',
        type: 'google_oauth',
        session_status: 'none',
        token_status: tokenStatus,
        instructions: 'Jika Anda masih memiliki JWT di client, hapus dari storage.'
      });
    }

    req.logout((err) => {
      if (err) {
        console.error('Passport logout error:', err);
        return res.status(500).json({ message: 'Gagal logout dari Google OAuth' });
      }
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destroy error:', err);
          return res.status(500).json({ message: 'Gagal menghapus session' });
        }
        res.clearCookie('connect.sid');
        res.json({
          message: 'Google OAuth logout berhasil',
          type: 'google_oauth',
            session_status: 'destroyed',
          token_status: tokenStatus,
          instructions: 'Session Google dihapus. Jika token JWT disertakan sudah diblacklist.'
        });
      });
    });
  } catch (error) {
    console.error('Google logout error:', error.message);
    res.status(500).json({ message: 'Gagal logout dari Google OAuth' });
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
            instructions: "Google session telah dihapus.",
            token_status: "session_destroyed"
          });
        });
      });
    } else {
      // Regular JWT logout - try to blacklist if token exists
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          await blacklistToken(token, decoded.id, 'logout');
          
          res.json({ 
            message: "Universal logout berhasil",
            type: "jwt_token",
            instructions: "Token JWT telah di-blacklist dan tidak valid lagi.",
            token_status: "blacklisted"
          });
        } catch (error) {
          // Token invalid or expired
          res.json({ 
            message: "Universal logout berhasil",
            type: "jwt_token",
            instructions: "Token JWT sudah tidak valid.",
            token_status: "already_invalid"
          });
        }
      } else {
        // No token provided
        res.json({ 
          message: "Universal logout berhasil",
          type: "no_token",
          instructions: "Tidak ada token yang perlu di-logout.",
          token_status: "none"
        });
      }
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
