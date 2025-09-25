const { Schema, model } = require('mongoose');

const reportSchema = new Schema({
  code: { type: String, unique: true, index: true }, // ex: RPT-001
  date: Date,
  department: { type: String, enum: ['Mechanical Assembly','Electronical Assembly','Software Installation','Quality Assurance','Warehouse'] },
  employeeName: String,
  nip: String,
  injuryScale: { type: String, enum: ['RINGAN','MENENGAH','BERAT'] },
  description: String,
  status: { type: String, enum: ['DRAFT','MENUNGGU_APPROVAL','SELESAI','REJECTED'], default: 'MENUNGGU_APPROVAL' },
  attachments: [String],
}, { timestamps: true });

module.exports = model('Report', reportSchema);