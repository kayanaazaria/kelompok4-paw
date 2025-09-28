const Laporan = require("../models/LaporanKecelakaan");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");

// Buat laporan (HSE simpan Draft)
const createLaporan = async (req, res) => {
  try {
    const laporan = await Laporan.create({
      ...req.body,
      createdByHSE: req.user._id,
      status: "Draft",
      isDraft: true,
    });

    res.status(201).json(laporan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal membuat laporan" });
  }
};

// Submit laporan (Draft → Menunggu Kabid) + notif Kabid & Direktur
const submitLaporan = async (req, res) => {
  try {
    const laporan = await Laporan.findById(req.params.id);
    if (!laporan) return res.status(404).json({ message: "Laporan tidak ditemukan" });

    if (laporan.createdByHSE.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Anda tidak berwenang submit laporan ini" });
    }

    if (laporan.status !== "Draft") {
      return res.status(400).json({ message: "Laporan sudah diajukan" });
    }

    laporan.status = "Menunggu Persetujuan Kepala Bidang";
    laporan.isDraft = false;
    await laporan.save();

    // Kirim notif ke Kabid & Direktur
    const kabids = await User.find({ role: "kepala_bidang" });
    const direkturs = await User.find({ role: "direktur_sdm" });
    const recipients = [...kabids, ...direkturs].map((u) => u.email);

    if (recipients.length > 0) {
      await sendEmail(
        recipients.join(","),
        "Laporan Kecelakaan Baru – Butuh Persetujuan",
        `Halo,\n\nAda laporan kecelakaan baru dari ${req.user.username}.
        
Nama Pekerja : ${laporan.namaPekerja}
Tanggal      : ${laporan.tanggalKejadian?.toDateString()}
Departemen   : ${laporan.department}
Skala Cedera : ${laporan.skalaCedera}

Silakan login ke sistem untuk approve/tolak.`
      );
    }

    res.json({ message: "Laporan berhasil diajukan", laporan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal submit laporan" });
  }
};

// Ambil detail laporan by ID
const getLaporanById = async (req, res) => {
  try {
    const laporan = await Laporan.findById(req.params.id)
      .populate("createdByHSE", "username email role")
      .populate("signedByKabid", "username email role")
      .populate("approvedByDirektur", "username email role");

    if (!laporan) {
      return res.status(404).json({ message: "Laporan tidak ditemukan" });
    }

    res.json(laporan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil detail laporan" });
  }
};

// Filter laporan berdasarkan status (dimodifikasi untuk handle semua kasus)
const getLaporanByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    
    // Jika ada parameter status
    if (status) {
      if (status === 'all') {
        // Jika status = 'all', ambil semua laporan (tidak ada filter)
        filter = {};
      } else if (status === 'draft') {
        filter.status = "Draft";
      } else if (status === 'mengajukan') {
        filter.status = { $in: ["Menunggu Persetujuan Kepala Bidang", "Menunggu Persetujuan Direktur SDM"] };
      } else if (status === 'disetujui') {
        filter.status = "Disetujui";
      } else if (status === 'ditolak') {
        filter.status = { $in: ["Ditolak Kepala Bidang", "Ditolak Direktur SDM"] };
      } else {
        // Jika status spesifik (exact match)
        filter.status = status;
      }
    }
    // Jika tidak ada parameter status, ambil semua laporan

    const laporan = await Laporan.find(filter)
      .populate("createdByHSE", "username email role")
      .populate("signedByKabid", "username email role")
      .populate("approvedByDirektur", "username email role")
      .sort({ createdAt: -1 }); // Sort terbaru dulu

    res.json(laporan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil laporan berdasarkan status" });
  }
};

// Tracking laporan oleh HSE (draft, menunggu, selesai)
const trackLaporanHSE = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = { createdByHSE: req.user._id };

    if (status === "draft") {
      filter.status = "Draft";
    } else if (status === "menunggu") {
      filter.status = { $in: ["Menunggu Persetujuan Kepala Bidang", "Menunggu Persetujuan Direktur SDM"] };
    } else if (status === "selesai") {
      filter.status = { $in: ["Disetujui", "Ditolak Kepala Bidang", "Ditolak Direktur SDM"] };
    }

    const laporan = await Laporan.find(filter).sort({ createdAt: -1 });
    res.json(laporan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal tracking laporan" });
  }
};

// Search laporan berdasarkan nama dokumen
const searchDocs = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Query kosong" });
    }

    const laporan = await Laporan.find({
      nama_dokumen: { $regex: query, $options: "i" } // case-insensitive
    });

    res.json(laporan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createLaporan,
  submitLaporan,
  getLaporanById,
  getLaporanByStatus,
  trackLaporanHSE,
  searchDocs
};
