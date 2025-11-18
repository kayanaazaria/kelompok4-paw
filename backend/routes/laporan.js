const express = require("express");
const router = express.Router();
const { authMiddleware, roleCheck } = require("../middleware/auth");
const { upload, uploadToSupabase } = require("../middleware/uploadToSupabase");
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

//
// ========================= HSE ROUTES =========================
//

// HSE buat laporan (Draft)
router.post("/", authMiddleware, roleCheck("hse"), upload.single("attachment"), uploadToSupabase, createLaporan);
router.put("/:id", authMiddleware, roleCheck("hse"), upload.single("attachment"), uploadToSupabase, updateLaporan);
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

module.exports = router;
