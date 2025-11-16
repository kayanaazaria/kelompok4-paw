const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { viewFinalDoc, downloadFinalDoc, verifyPage, listFinalDocs } = require('../controllers/finalDocumentController');

// Inline view PDF final dokumen (butuh login)
router.get('/laporan/:id/pdf', authMiddleware, viewFinalDoc);

// Download PDF final (butuh login)
router.get('/laporan/:id/download', authMiddleware, downloadFinalDoc);

// Halaman verifikasi publik via QR (tidak butuh login)
router.get('/laporan/:id/verify', verifyPage);

// Daftar semua dokumen final (Disetujui) - filter optional via query
router.get('/laporan/final', authMiddleware, listFinalDocs);

module.exports = router;
