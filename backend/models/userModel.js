const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { USER_ROLES, DEPARTMENTS } = require('../constants/enums');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { 
    type: String, 
    required: function() {
      return !this.googleId;
    }
  },
  googleId: { type: String, sparse: true },
  photo: String,
  role: {
    type: String,
    enum: Object.values(USER_ROLES),
    required: true
  },
  department: {
    type: String,
    enum: DEPARTMENTS,
    required: function () {
      return this.role === 'kepala_bidang';
    }
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
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

module.exports = User; 
