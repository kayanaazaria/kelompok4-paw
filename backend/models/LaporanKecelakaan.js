const mongoose = require('mongoose');

const LaporanSchema = new mongoose.Schema({
  tanggalKejadian: { type: Date, required: true },
  bagianPerusahaan: { 
    type: String, 
    enum: ['Mechanical Assembly','Electronical Assembly','Software Installation','Quality Assurance','Warehouse'],
    required: true 
  },
  namaPekerja: { type: String, required: true },
  nomorIndukPekerja: { type: String, required: true },
  detailKejadian: { type: String, required: true },
  skalaCedera: { type: String, enum: ['Ringan','Menengah','Berat'], required: true },
  attachmentUrl: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Laporan', LaporanSchema);