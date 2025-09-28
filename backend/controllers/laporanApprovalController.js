const Laporan = require("../models/LaporanKecelakaan");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");

// ========================= LAPORAN APPROVAL WORKFLOW FUNCTIONS =========================

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
  approveByKepalaBidang,
  rejectByKepalaBidang,
  approveByDirektur,
  rejectByDirektur
};