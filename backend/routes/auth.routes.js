const express = require('express');
const passport = require('../config/passport');
const router = express.Router();

router.get('/google',
  passport.authenticate('google', { scope: ['openid', 'profile', 'email'], prompt: 'consent' })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/fail' }),
  (req, res) => res.json({ message: 'Login sukses!', user: req.user })
);

router.get('/fail', (req, res) => res.status(400).json({ message: 'Login gagal', query: req.query }));
module.exports = router;