const mongoose = require('mongoose');
const { DEPARTMENTS } = require('./userModel');

const LaporanSchema = new mongoose.Schema({
  tanggalKejadian: { type: Date, required: true },
  namaPekerja: { type: String, required: true },
  nomorIndukPekerja: { type: String, required: true },
  detailKejadian: { type: String, required: true },
  skalaCedera: { type: String, enum: ['Ringan','Menengah','Berat'], required: true },
  attachmentUrl: { type: String },
  department: { 
    type: String, 
    enum: DEPARTMENTS,
    required: true 
  },
  status: {
    type: String,
    enum: [
      'Draft',
      'Menunggu Persetujuan Kepala Bidang',
      'Menunggu Persetujuan Direktur SDM',
      'Disetujui',
      'Ditolak Kepala Bidang',
      'Ditolak Direktur SDM'
    ],
    default: 'Draft'
  },
  isDraft: { type: Boolean, default: true },
  createdByHSE: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  signedByKabid: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedByDirektur: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Laporan', LaporanSchema);
