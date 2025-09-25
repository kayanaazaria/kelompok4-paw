const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Endpoint untuk register
router.post('/register', registerUser);

// Endpoint untuk login
router.post('/login', loginUser);

module.exports = router;
