const express = require('express');
const router = express.Router();
const c = require('../controllers/finalDoc.controller');

router.get('/reports', c.listReports);

router.get('/reports/:id/history', c.getHistoryByIdHandler);
router.get('/reports/:id/final.pdf', c.getFinalPdfById);
router.get('/reports/:id/final/download', c.downloadFinalPdfById);
router.get('/reports/:id/verify', c.verifyPageById);

module.exports = router;