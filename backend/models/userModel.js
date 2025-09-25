const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const DEPARTMENTS = [
  'Mechanical Assembly',
  'Electronical Assembly',
  'Software Installation',
  'Quality Assurance',
  'Warehouse'
];

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'hse', 'kepala_bidang', 'direktur_sdm'],
    required: true
  },
  department: {
    type: String,
    enum: DEPARTMENTS,
    required: function () {
      return this.role === 'kepala_bidang';
    }
  }
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User; // ✅ Export langsung User
