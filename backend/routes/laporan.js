// routes/laporan.js
const express = require('express');
const path = require('path');
const multer = require('multer');
const Laporan = require('../models/LaporanKecelakaan');
const { authMiddleware, roleCheck } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // folder simpan
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // ambil ekstensi asli
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + ext); // simpan dengan nama unik + ekstensi asli
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype.toLowerCase();
    if (allowed.includes(ext) &&
        (mime.includes('pdf') || mime.includes('jpeg') || mime.includes('jpg') || mime.includes('png'))) {
      cb(null, true);
    } else {
      cb(new Error('File tidak didukung'), false);
    }
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
  console.log("DATA:", data);
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