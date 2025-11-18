const Laporan = require("../models/LaporanKecelakaan");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");

// Buat laporan (HSE simpan Draft)
const createLaporan = async (req, res) => {
  try {
    console.log("DEBUG req.user:", req.user);
    console.log("DEBUG req.body:", req.body);
    console.log("DEBUG req.file:", req.file);

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User tidak terautentikasi" });
    }

    // Validasi field required
    const { tanggalKejadian, namaPekerja, nomorIndukPekerja, department, skalaCedera, detailKejadian } = req.body;

    if (!tanggalKejadian || !namaPekerja || !nomorIndukPekerja || !department || !skalaCedera || !detailKejadian) {
      return res.status(400).json({ 
        message: "Semua field wajib diisi",
        missing: {
          tanggalKejadian: !tanggalKejadian,
          namaPekerja: !namaPekerja,
          nomorIndukPekerja: !nomorIndukPekerja,
          department: !department,
          skalaCedera: !skalaCedera,
          detailKejadian: !detailKejadian
        }
      });
    }

    // Generate unique report number
    const nomorLaporan = await Laporan.getNextReportNumber();

    const laporan = await Laporan.create({
      tanggalKejadian,
      namaPekerja,
      nomorIndukPekerja,
      department,
      skalaCedera,
      detailKejadian,
      nomorLaporan,
      createdByHSE: req.user._id,
      status: "Draft",
      isDraft: true,
      attachmentUrl: req.file ? `/uploads/${req.file.filename}` : null,
    });
    console.log("DEBUG laporan created:", laporan);
    res.status(201).json({
      message: "Laporan berhasil dibuat",
      nomorLaporan: laporan.nomorLaporan,
      laporan
    });
  } catch (error) {
    console.error("Error creating laporan:", error);
    res.status(500).json({ 
      message: "Gagal membuat laporan",
      error: error.message,
      details: error.errors ? Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      })) : null
    });
  }
};
    
// UPDATE laporan (bisa ubah data atau ganti file)
const updateLaporan = async (req, res) => {
  try {
    // Cek apakah laporan ada
    const laporan = await Laporan.findById(req.params.id);
    if (!laporan) return res.status(404).json({ message: "Laporan tidak ditemukan" });

    // Validasi: Hanya HSE yang membuat laporan yang bisa mengedit
    if (laporan.createdByHSE.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Anda tidak berwenang mengedit laporan ini" });
    }

    const body = req.body;
    if (req.file) body.attachmentUrl = `/uploads/${req.file.filename}`;

    const updatedLaporan = await Laporan.findByIdAndUpdate(req.params.id, body, { new: true });

    res.json(updatedLaporan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE laporan
const deleteLaporan = async (req, res) => {
  try {
    // Cek apakah laporan ada
    const laporan = await Laporan.findById(req.params.id);
    if (!laporan) return res.status(404).json({ message: "Laporan tidak ditemukan" });

    // Validasi: Hanya HSE yang membuat laporan yang bisa menghapus
    if (laporan.createdByHSE.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Anda tidak berwenang menghapus laporan ini" });
    }

    // Hanya bisa hapus laporan dengan status Draft
    if (laporan.status !== "Draft") {
      return res.status(400).json({ message: "Hanya laporan Draft yang bisa dihapus" });
    }

    await Laporan.findByIdAndDelete(req.params.id);

    res.json({ message: "Laporan berhasil dihapus" });
  } catch (error) {
    res.status(400).json({ message: error.message });
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

    // Kirim notif HANYA ke Kepala Bidang dari department terkait
    const kabids = await User.find({ 
      role: "kepala_bidang", 
      department: laporan.department // Filter by department yang sama
    });
    const recipients = kabids.map((u) => u.email); // Hapus direktur dari notifikasi submit

    if (recipients.length > 0) {
      await sendEmail(
        recipients.join(","),
        "Laporan Kecelakaan Baru – Butuh Persetujuan",
        `Halo,\n\nAda laporan kecelakaan baru dari ${req.user.username}.
        
Nama Pegawai : ${laporan.namaPekerja}
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

// Ambil semua laporan
const getAllLaporan = async (req, res) => {
  try {
    const laporan = await Laporan.find()
      .populate("createdByHSE", "username email role")
      .populate("signedByKabid", "username email role")
      .populate("approvedByDirektur", "username email role");

    res.json(laporan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil laporan" });
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

// Filter laporan berdasarkan status
const getLaporanByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    const laporan = await Laporan.find({ status })
      .populate("createdByHSE", "username email role")
      .populate("signedByKabid", "username email role")
      .populate("approvedByDirektur", "username email role");

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

// Approve Kepala Bidang + notif ke HSE & Direktur
const approveByKepalaBidang = async (req, res) => {
  try {
    const laporan = await Laporan.findById(req.params.id).populate("createdByHSE", "email username");
    if (!laporan) return res.status(404).json({ message: "Laporan tidak ditemukan" });

    laporan.status = "Menunggu Persetujuan Direktur SDM";
    laporan.signedByKabid = req.user._id;
    await laporan.save();

    // Notif ke HSE + Direktur
    const direkturs = await User.find({ role: "direktur_sdm" });
    const recipients = [laporan.createdByHSE.email, ...direkturs.map((u) => u.email)];

    await sendEmail(
      recipients.join(","),
      "Laporan Disetujui Kepala Bidang",
      `Halo,\n\nLaporan kecelakaan dari ${laporan.namaPekerja} sudah disetujui Kepala Bidang.\n\nMenunggu persetujuan Direktur SDM.`
    );

    res.json({ message: "Laporan disetujui Kepala Bidang", laporan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal approve laporan" });
  }
};

// Reject Kepala Bidang + notif ke HSE
const rejectByKepalaBidang = async (req, res) => {
  try {
    const laporan = await Laporan.findById(req.params.id).populate("createdByHSE", "email username");
    if (!laporan) return res.status(404).json({ message: "Laporan tidak ditemukan" });

    laporan.status = "Ditolak Kepala Bidang";
    await laporan.save();

    await sendEmail(
      laporan.createdByHSE.email,
      "Laporan Ditolak Kepala Bidang",
      `Halo ${laporan.createdByHSE.username},\n\nLaporan kecelakaan anda ditolak oleh Kepala Bidang.`
    );

    res.json({ message: "Laporan ditolak Kepala Bidang", laporan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal reject laporan" });
  }
};

// Approve Direktur SDM + notif ke HSE
const approveByDirektur = async (req, res) => {
  try {
    const laporan = await Laporan.findById(req.params.id).populate("createdByHSE", "email username");
    if (!laporan) return res.status(404).json({ message: "Laporan tidak ditemukan" });

    laporan.status = "Disetujui";
    laporan.approvedByDirektur = req.user._id;
    await laporan.save();

    await sendEmail(
      laporan.createdByHSE.email,
      "Laporan Disetujui Direktur SDM",
      `Halo ${laporan.createdByHSE.username},\n\nLaporan kecelakaan anda sudah disetujui oleh Direktur SDM.`
    );

    res.json({ message: "Laporan disetujui Direktur SDM", laporan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal approve laporan" });
  }
};

// Reject Direktur SDM + notif ke HSE
const rejectByDirektur = async (req, res) => {
  try {
    const laporan = await Laporan.findById(req.params.id).populate("createdByHSE", "email username");
    if (!laporan) return res.status(404).json({ message: "Laporan tidak ditemukan" });

    laporan.status = "Ditolak Direktur SDM";
    await laporan.save();

    await sendEmail(
      laporan.createdByHSE.email,
      "Laporan Ditolak Direktur SDM",
      `Halo ${laporan.createdByHSE.username},\n\nLaporan kecelakaan anda ditolak oleh Direktur SDM.`
    );

    res.json({ message: "Laporan ditolak Direktur SDM", laporan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal reject laporan" });
  }
};

module.exports = {
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
};
