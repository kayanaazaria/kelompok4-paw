const Notification = require('../models/notificationModel');

const getMyNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id })
            .sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        next(err);
    }
};

const markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification || notification.recipient.toString() !== req.user.id) {
            res.status(404);
            return next(new Error("Notifikasi tidak ditemukan atau bukan milik Anda."));
        }
        notification.isRead = true;
        await notification.save();
        res.json(notification);
    } catch (err) {
        next(err);
    }
};

// Server-Sent Events endpoint for streaming notifications
const { subscribe } = require('../services/notificationStream');

const streamNotifications = async (req, res, next) => {
    try {
        // authMiddleware must set req.user
        const unsubscribe = subscribe(res, req.user ? req.user._id : null);

        req.on('close', () => {
            unsubscribe();
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { getMyNotifications, markAsRead, streamNotifications };