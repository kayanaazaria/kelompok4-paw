const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const laporanRoutes = require('./laporan');
const notificationRoutes = require('./notificationRoutes');
const approvalRoutes = require('./approvalRoutes');
const finalDocumentRoutes = require('./finalDocumentRoutes');
const testRoutes = require('./testRoutes');

// Mount routes with their respective paths
// Auth routes - dual mounting for OAuth and API
router.use('/auth', authRoutes);        // For OAuth Google (/auth/google, /auth/google/callback)
router.use('/api/auth', authRoutes);    // For regular login/register/logout

// Main API routes
router.use('/api/users', userRoutes);
router.use('/api/laporan', laporanRoutes);
router.use('/api/notifications', notificationRoutes);
router.use('/api/approvals', approvalRoutes);

// Final document routes (no /api prefix)
router.use('/finaldoc', finalDocumentRoutes);

// Test/Diagnostics routes (keep last)
router.use('/api/test', testRoutes);
router.use('/api/diag', testRoutes);

module.exports = router;
