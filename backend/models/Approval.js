const { Schema, model, Types } = require('mongoose');

const approvalSchema = new Schema({
  reportId: { type: Types.ObjectId, ref: 'Report', index: true },
  step: { type: Number, enum: [1,2,3], index: true },
  role: { type: String, enum: ['HSE','KEPALA_BIDANG','DIREKTUR_SDM'] },
  status: { type: String, enum: ['PENDING','APPROVED','REJECTED'], default: 'PENDING' },
  userName: String,    
  note: String,
  at: Date,
}, { timestamps: true });

module.exports = model('Approval', approvalSchema);