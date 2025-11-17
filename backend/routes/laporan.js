const express = require("express");
const path = require('path');
const multer = require('multer');
const router = express.Router();
const { authMiddleware, roleCheck } = require("../middleware/auth");
const {
  createLaporan,
  submitLaporan,
  getAllLaporan,
  getLaporanById,
  getLaporanByStatus,
  updateLaporan,
  deleteLaporan,
  trackLaporanHSE,
  approveByKepalaBidang,
  rejectByKepalaBidang,
  approveByDirektur,
  rejectByDirektur,
} = require("../controllers/laporanController");
const Laporan = require('../models/LaporanKecelakaan');

//
// ========================= HSE ROUTES =========================
//
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); // folder simpan
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

// HSE buat laporan (Draft)
router.post("/", authMiddleware, roleCheck("hse"), upload.single("attachment"), createLaporan);
router.put("/:id", authMiddleware, roleCheck("hse"), upload.single("attachment"), updateLaporan);
router.delete("/:id", authMiddleware, roleCheck("hse"), deleteLaporan);

// HSE submit laporan dari Draft → Menunggu Kabid
router.put("/:id/submit", authMiddleware, roleCheck("hse"), submitLaporan);

//
// ========================= PUBLIC ROUTES =========================
//

// Semua user bisa filter laporan berdasarkan status (SPECIFIC ROUTES FIRST)
// contoh: GET /api/laporan/status/filter?status=Disetujui
router.get("/status/filter", authMiddleware, getLaporanByStatus);

// HSE tracking laporan (draft, menunggu, selesai) - MOVED HERE TO AVOID CONFLICT
router.get("/hse/tracking", authMiddleware, roleCheck("hse"), trackLaporanHSE);

// Semua user bisa lihat semua laporan
router.get("/", authMiddleware, getAllLaporan);

// Semua user bisa lihat detail laporan by ID (DYNAMIC ROUTE LAST)
router.get("/:id", authMiddleware, getLaporanById);

//
// ========================= APPROVAL ROUTES =========================
//

// Kepala Bidang approve/reject
router.put("/:id/approve-kepala", authMiddleware, roleCheck("kepala_bidang"), approveByKepalaBidang);
router.put("/:id/reject-kepala", authMiddleware, roleCheck("kepala_bidang"), rejectByKepalaBidang);

// Direktur approve/reject
router.put("/:id/approve-direktur", authMiddleware, roleCheck("direktur_sdm"), approveByDirektur);
router.put("/:id/reject-direktur", authMiddleware, roleCheck("direktur_sdm"), rejectByDirektur);

// Kepala Bidang get laporan untuk departemennya (only pending, not approved/rejected)
router.get("/kepala-bidang/my-reports", authMiddleware, roleCheck("kepala_bidang"), async (req, res) => {
  try {
    const laporan = await Laporan.find({
      department: req.user.department,
      status: "Menunggu Persetujuan Kepala Bidang"
    })
      .populate("createdByHSE", "username email role")
      .populate("signedByKabid", "username email role")
      .populate("approvedByDirektur", "username email role")
      .sort({ createdAt: -1 });

    res.json(laporan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil laporan" });
  }
});

// Kepala Bidang get approved/rejected laporan untuk departemennya
router.get("/kepala-bidang/approved-reports", authMiddleware, roleCheck("kepala_bidang"), async (req, res) => {
  try {
    const laporan = await Laporan.find({
      department: req.user.department,
      status: { $in: ["Menunggu Persetujuan Direktur SDM", "Ditolak Kepala Bidang"] }
    })
      .populate("createdByHSE", "username email role")
      .populate("signedByKabid", "username email role")
      .populate("approvedByDirektur", "username email role")
      .sort({ createdAt: -1 });

    res.json(laporan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil laporan" });
  }
});

// Direktur SDM get laporan menunggu persetujuan direktur
router.get("/direktur/my-reports", authMiddleware, roleCheck("direktur_sdm"), async (req, res) => {
  try {
    const laporan = await Laporan.find({
      status: "Menunggu Persetujuan Direktur SDM"
    })
      .populate("createdByHSE", "username email role")
      .populate("signedByKabid", "username email role")
      .populate("approvedByDirektur", "username email role")
      .sort({ createdAt: -1 });

    res.json(laporan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil laporan" });
  }
});

// Direktur SDM get semua laporan (sudah approved/rejected)
router.get("/direktur/all-reports", authMiddleware, roleCheck("direktur_sdm"), async (req, res) => {
  try {
    const laporan = await Laporan.find({
      status: { $in: ["Menunggu Persetujuan Direktur SDM", "Disetujui", "Ditolak Direktur SDM"] }
    })
      .populate("createdByHSE", "username email role")
      .populate("signedByKabid", "username email role")
      .populate("approvedByDirektur", "username email role")
      .sort({ createdAt: -1 });

    res.json(laporan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil laporan" });
  }
});

module.exports = router;
