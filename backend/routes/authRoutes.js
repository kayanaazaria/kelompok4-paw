const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

const { authMiddleware, roleCheck } = require('../middleware/auth');

router.post('/register', authMiddleware, roleCheck('admin'), registerUser);

router.post('/login', loginUser);

module.exports = router;