// routes/laporan.js
const express = require('express');
const multer = require('multer');
const Laporan = require('../models/LaporanKecelakaan');
const { authMiddleware, roleCheck } = require('../middleware/auth');

const router = express.Router();

// konfigurasi multer
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5*1024*1024 },
  fileFilter: (req, file, cb) => {
    const ok = /pdf|jpeg|jpg|png/.test(file.mimetype);
    cb(ok ? null : new Error('File tidak didukung'), ok);
  }
});

// CREATE laporan (HSE only)
router.post('/', authMiddleware, roleCheck('HSE'), upload.single('attachment'), async (req, res) => {
  try {
    const body = req.body;
    const laporan = new Laporan({
      ...body,
      tanggalKejadian: new Date(body.tanggalKejadian),
      createdBy: req.user.id,
      attachmentUrl: req.file ? `/uploads/${req.file.filename}` : null
    });
    await laporan.save();
    res.status(201).json(laporan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ semua laporan
router.get('/', authMiddleware, async (req, res) => {
  const data = await Laporan.find().sort({ createdAt: -1 });
  res.json(data);
});

// READ detail laporan
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const laporan = await Laporan.findById(req.params.id);
    if (!laporan) return res.status(404).json({ message: 'Not found' });
    res.json(laporan);
  } catch (err) {
    res.status(400).json({ message: 'Invalid ID' });
  }
});

// UPDATE laporan (misal: edit detail oleh HSE)
router.put('/:id', authMiddleware, roleCheck('HSE'), upload.single('attachment'), async (req, res) => {
  try {
    const body = req.body;
    if (req.file) body.attachmentUrl = `/uploads/${req.file.filename}`;
    const laporan = await Laporan.findByIdAndUpdate(req.params.id, body, { new: true });
    res.json(laporan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE laporan
router.delete('/:id', authMiddleware, roleCheck('HSE'), async (req, res) => {
  try {
    await Laporan.findByIdAndDelete(req.params.id);
    res.json({ message: 'Laporan deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;