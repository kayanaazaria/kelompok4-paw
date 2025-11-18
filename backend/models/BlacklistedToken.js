const mongoose = require('mongoose');

// NOTE: TTL di MongoDB berjalan lewat background process (paling cepat 60 detik interval)
// Jadi token akan terhapus otomatis SESUDAH expired + delay TTL. Namun auth check tetap
// memblokir token karena kita cek langsung di collection (walaupun belum terhapus TTL).
const BlacklistedTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true }, // unique already creates an index
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expiresAt: { type: Date, required: true },
  reason: { type: String, enum: ['logout', 'forced_logout', 'security'], default: 'logout' }
}, { timestamps: true });

// TTL index – ketika expiresAt < now maka dokumen akan dihapus otomatis oleh MongoDB.
// expireAfterSeconds: 0 artinya gunakan nilai tanggal langsung.
BlacklistedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('BlacklistedToken', BlacklistedTokenSchema);