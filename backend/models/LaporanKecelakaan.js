const mongoose = require('mongoose');
const { DEPARTMENTS } = require('./userModel');

const LampiranSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  url: { type: String, required: true },
  path: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true }
}, { _id: false });

const LaporanSchema = new mongoose.Schema({
  nomorLaporan: { type: String, unique: true },
  tanggalKejadian: { type: Date, required: true },
  namaPekerja: { type: String, required: true },
  nomorIndukPekerja: { type: String, required: true },
  detailKejadian: { type: String, required: true },
  skalaCedera: { type: String, enum: ['Ringan','Menengah','Berat'], required: true },
  lampiran: [LampiranSchema],
  department: { 
    type: String, 
    enum: DEPARTMENTS,
    required: true 
  },
  nomorLaporan: { type: String, unique: true, index: true },
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

// Helper function to generate next report number
LaporanSchema.statics.getNextReportNumber = async function() {
  // const Counter = mongoose.model('Counter', new mongoose.Schema({ _id: String, seq: Number }), 'counters');
  const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true},
  seq: { type: Number, default: 0 },
  });
  const Counter = mongoose.models.Counter || mongoose.model("Counter", CounterSchema);

  const counter = await Counter.findByIdAndUpdate(
    'laporan_number',
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
);
  const year = new Date().getFullYear();
  return `SOLANUM-${year}-${String(counter.seq).padStart(4, '0')}`;
};
LaporanSchema.pre("save", async function (next) {
  if (!this.nomorLaporan) {
    this.nomorLaporan = await this.constructor.getNextReportNumber();
  }
  next();
});

module.exports = mongoose.model('Laporan', LaporanSchema);