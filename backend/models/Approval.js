const { Schema, model, Types } = require('mongoose');

const approvalSchema = new Schema({
  reportId: { type: Types.ObjectId, ref: 'Report', index: true },
  step: { type: Number, enum: [1,2,3], index: true }, // 1=HSE, 2=Kepala, 3=Dir SDM
  role: { type: String, enum: ['HSE','KEPALA_BIDANG','DIREKTUR_SDM'] },
  status: { type: String, enum: ['PENDING','APPROVED','REJECTED'], default: 'PENDING' },
  userName: String,       // atau userId: { type: Types.ObjectId, ref:'User' }
  note: String,
  at: Date,
}, { timestamps: true });

module.exports = model('Approval', approvalSchema);