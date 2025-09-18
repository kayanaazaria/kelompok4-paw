const express = require('express');
const multer = require('multer');
const { authMiddleware, roleCheck } = require('../middleware/auth');
const { 
    createLaporan,
    getAllLaporan,
    signByKepalaBidang,
    approveByDirektur
} = require('../controllers/laporanController');

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post(
    '/', 
    authMiddleware, 
    roleCheck('hse'), 
    upload.single('attachment'), // Middleware untuk menangani upload file
    createLaporan
);

router.get(
    '/', 
    authMiddleware, 
    roleCheck('hse', 'kepala_bidang', 'direktur_sdm'), 
    getAllLaporan
);

router.put(
    '/:id/sign-kabid', 
    authMiddleware, 
    roleCheck('kepala_bidang'), 
    signByKepalaBidang
);

router.put(
    '/:id/approve-direktur', 
    authMiddleware, 
    roleCheck('direktur_sdm'), 
    approveByDirektur
);

module.exports = router;

