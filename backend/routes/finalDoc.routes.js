const express = require('express');
const router = express.Router();
const finalDocController = require('../controllers/finalDoc.controller');

// list & history
router.get('/reports', finalDocController.listReports);
router.get('/reports/:code/history', finalDocController.getHistory);

// PDF inline & download
router.get('/reports/:code/final.pdf', finalDocController.getFinalPdf);
router.get('/reports/:code/final/download', finalDocController.downloadFinalPdf);

// verifikasi (buat QR)
router.get('/reports/:code/verify', finalDocController.verifyPage);

module.exports = router;