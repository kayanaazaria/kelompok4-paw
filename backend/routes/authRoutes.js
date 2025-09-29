const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { authMiddleware, roleCheck } = require('../middleware/auth');

// Endpoint untuk register (hanya admin)
router.post('/register', authMiddleware, roleCheck('admin'), registerUser);

// Endpoint untuk login
router.post('/login', loginUser);

module.exports = router;
