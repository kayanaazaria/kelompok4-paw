const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { 
  registerUser, 
  loginUser, 
  logoutUser, 
  logoutGoogleUser, 
  universalLogout,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const { authMiddleware, roleCheck } = require('../middleware/auth');

// Endpoint untuk register (hanya admin)
router.post('/register', authMiddleware, roleCheck('admin'), registerUser);

// Endpoint untuk login
router.post('/login', loginUser);

// Endpoint untuk forgot password
router.post('/forgot-password', forgotPassword);

// Endpoint untuk reset password
router.post('/reset-password/:token', resetPassword);

// ================== LOGOUT ENDPOINTS ==================

// Logout untuk JWT token (client-side logout)
router.post('/logout', authMiddleware, logoutUser);

// Logout untuk Google OAuth (server-side session logout)
router.post('/logout/google', logoutGoogleUser);

// Universal logout (auto-detect login type dan logout accordingly)
router.post('/logout/universal', universalLogout);

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
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/auth/google/callback?error=${encodeURIComponent(err.message)}`);
    }
    
    if (!user) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/auth/google/callback?error=${encodeURIComponent('Authentication failed')}`);
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role || 'user', 
        username: user.username || user.email.split('@')[0], 
        email: user.email,
        department: user.department
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Set httpOnly cookie so frontend doesn't need to store token in localStorage
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    };
    res.cookie('auth_token', token, cookieOptions);

    // Redirect to frontend callback page to process token
    // The callback page will store token and redirect to appropriate dashboard
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    return res.redirect(`${frontendUrl}/auth/google/callback?token=${encodeURIComponent(token)}`);
  })(req, res, next);
});

module.exports = router;
