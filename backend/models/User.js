const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  googleId: { type: String, index: true },
  name: String,
  email: { type: String, unique: true, index: true },
  photo: String,
  role: { type: String, enum: ['HSE','KEPALA_BIDANG','DIREKTUR_SDM','ADMIN'], default: 'HSE' },
}, { timestamps: true });

module.exports = model('User', userSchema);