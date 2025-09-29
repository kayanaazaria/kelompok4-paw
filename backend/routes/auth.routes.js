const router = require('express').Router();
const passport = require('../config/passport');

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.json({ message: 'Login sukses!', user: req.user });
  }
);

module.exports = router;