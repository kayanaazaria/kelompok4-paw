const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { getMyNotifications, markAsRead } = require('../controllers/notificationController.js');

router.get('/', authMiddleware, getMyNotifications);

router.put('/:id/read', authMiddleware, markAsRead);

module.exports = router;