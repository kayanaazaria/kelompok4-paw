const express = require('express');
const router = express.Router();
const { listReports, getHistory, getFinalPdf } = require('../controllers/finalDoc.controller');

// Daftar report mock
router.get('/reports', listReports);

// Timeline tanda tangan
router.get('/reports/:id/history', getHistory);

// Export final PDF
router.get('/reports/:id/final.pdf', getFinalPdf);

module.exports = router;