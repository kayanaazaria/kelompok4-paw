const Laporan = require('../models/LaporanKecelakaan');
const User = require('../models/userModel');
const Notification = require('../models/notificationModel');

const createNotification = async (recipientId, message, laporanId) => {
    if (!recipientId) return;
    await Notification.create({ recipient: recipientId, message, laporanId });
};

const createLaporan = async (req, res, next) => {
  try {
    const { department, ...body } = req.body;
    
    const newLaporan = await Laporan.create({
      ...body,
      department,
      attachmentUrl: req.file ? `/uploads/${req.file.filename}` : null,
      createdByHSE: req.user.id,
    });

    const kepalaBidang = await User.findOne({ role: 'kepala_bidang', department: department });
    const direktur = await User.findOne({ role: 'direktur_sdm' });

    await createNotification(
        kepalaBidang?._id,
        `Laporan baru di dept ${department} oleh ${req.user.username} butuh persetujuan Anda.`,
        newLaporan._id
    );
    await createNotification(
        direktur?._id,
        `Laporan baru di dept ${department} telah dibuat oleh ${req.user.username}.`,
        newLaporan._id
    );
    
    res.status(201).json(newLaporan);
  } catch (err) {
    next(err);
  }
};

const signByKepalaBidang = async (req, res, next) => {
    try {
        const laporan = await Laporan.findById(req.params.id);
        if (!laporan) {
            res.status(404);
            return next(new Error("Laporan tidak ditemukan"));
        }
        if (laporan.department !== req.user.department) {
            res.status(403);
            return next(new Error("Anda tidak berwenang menandatangani laporan dari departemen lain."));
        }
        if (laporan.status !== 'Menunggu Persetujuan Kepala Bidang') {
            res.status(400);
            return next(new Error("Laporan ini tidak sedang menunggu persetujuan Anda."));
        }

        laporan.status = 'Menunggu Persetujuan Direktur SDM';
        laporan.signedByKabid = req.user.id;
        await laporan.save();

        const direktur = await User.findOne({ role: 'direktur_sdm' });
        await createNotification(
            direktur?._id,
            `Laporan dari dept ${laporan.department} telah ditandatangani Kepala Bidang dan butuh persetujuan Anda.`,
            laporan._id
        );

        res.json(laporan);
    } catch (err) {
        next(err);
    }
};

const approveByDirektur = async (req, res, next) => {
    try {
        const laporan = await Laporan.findById(req.params.id);
        if (!laporan) {
            res.status(404);
            return next(new Error("Laporan tidak ditemukan"));
        }
        if (laporan.status !== 'Menunggu Persetujuan Direktur SDM') {
            res.status(400);
            return next(new Error("Laporan ini tidak sedang menunggu persetujuan Anda."));
        }

        laporan.status = 'Disetujui';
        laporan.approvedByDirektur = req.user.id;
        await laporan.save();

        await createNotification(
            laporan.createdByHSE,
            `Laporan Anda untuk dept ${laporan.department} telah disetujui sepenuhnya.`,
            laporan._id
        );

        res.json(laporan);
    } catch (err) {
        next(err);
    }
};

const getAllLaporan = async (req, res, next) => {
    try {
        let query = {};
        const { id: userId, role, department } = req.user;
        
        if (role === 'admin') return res.json([]);
        if (role === 'hse') query = { $or: [{ status: 'Disetujui' }, { createdByHSE: userId }] };
        if (role === 'kepala_bidang') query = { department: department };
        
        const data = await Laporan.find(query)
            .populate('createdByHSE', 'username')
            .populate('signedByKabid', 'username')
            .populate('approvedByDirektur', 'username')
            .sort({ createdAt: -1 });
            
        res.json(data);
    } catch(err) {
        next(err);
    }
};

module.exports = { createLaporan, signByKepalaBidang, approveByDirektur, getAllLaporan };