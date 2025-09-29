const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { registerUser, loginUser } = require('../controllers/authController');
const { authMiddleware, roleCheck } = require('../middleware/auth');

// Endpoint untuk register (hanya admin)
router.post('/register', authMiddleware, roleCheck('admin'), registerUser);

// Endpoint untuk login
router.post('/login', loginUser);

// Endpoint untuk Google OAuth - tanpa middleware auth
router.get('/google', 
  (req, res, next) => {
    // Remove any existing auth headers
    delete req.headers.authorization;
    console.log('Starting Google OAuth...', {
      clientID: process.env.GOOGLE_CLIENT_ID ? 'set' : 'not set',
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    });
    next();
  },
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: true
  })
);

// Callback setelah login Google
router.get('/google/callback', (req, res, next) => {
  console.log('Received callback from Google');
  
  passport.authenticate('google', {
    session: false // Disable session untuk Google OAuth
  }, (err, user, info) => {
    if (err) {
      console.error('Google Auth Error:', err);
      return res.status(500).json({ error: err.message });
    }
    
    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role || 'user', username: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Return token in response
    res.json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role || 'user',
        username: user.email
      }
    });
  })(req, res, next);
});

module.exports = router;
