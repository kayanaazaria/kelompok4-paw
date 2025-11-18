const User = require('../models/userModel');

// Create user (khusus admin)
const createUser = async (req, res, next) => {
  const { username, email, password, role, department } = req.body;
  try {
    if (!username || !email || !password || !role) {
      res.status(400);
      return next(new Error('Silahkan isi bagian yang belum diisi'));
    }

    if (password.length < 8) {
      res.status(400);
      return next(new Error('Password harus minimal 8 karakter.'));
    }

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      res.status(400);
      return next(new Error('User dengan email atau username tersebut sudah ada'));
    }

    const user = await User.create({ username, email, password, role, department });

    if (user) {
      return res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        department: user.department,
        createdAt: user.createdAt
      });
    }
  } catch (err) {
    next(err);
  }
};

// Get semua users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    return res.json(users);
  } catch (err) {
    next(err);
  }
};

// Update role & department user
const updateUserRoleAndDepartment = async (req, res, next) => {
  const { role, department } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      return next(new Error('User tidak ditemukan'));
    }

    user.role = role || user.role;

    if (role === 'kepala_bidang') {
      if (!department) {
        res.status(400);
        return next(new Error('Department wajib diisi untuk role Kepala Bidang.'));
      }
      user.department = department;
    } else {
      user.department = undefined;
    }

    const updatedUser = await user.save();

    return res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      department: updatedUser.department,
    });

  } catch (err) {
    next(err);
  }
};

// Delete user
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      return next(new Error('User tidak ditemukan'));
    }

    // Prevent deleting other admin users (only can delete self if admin)
    if (user.role === 'admin' && user._id.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Tidak dapat menghapus admin lain'));
    }

    // If deleting own account and is admin, check if last admin
    if (user._id.toString() === req.user._id.toString() && user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      
      if (adminCount <= 1) {
        res.status(403);
        return next(new Error('Tidak dapat menghapus diri sendiri karena Anda adalah admin terakhir'));
      }
    }

    await User.findByIdAndDelete(req.params.id);

    return res.json({ message: 'User berhasil dihapus' });

  } catch (err) {
    next(err);
  }
};

// Change password untuk user yang sedang login
const changePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  try {
    if (!currentPassword || !newPassword) {
      res.status(400);
      return next(new Error('Password saat ini dan password baru wajib diisi'));
    }

    if (newPassword.length < 8) {
      res.status(400);
      return next(new Error('Password baru harus minimal 8 karakter'));
    }

    // Cari user yang sedang login
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      return next(new Error('User tidak ditemukan'));
    }

    // Cek apakah password saat ini benar
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      res.status(400);
      return next(new Error('Password saat ini salah'));
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return res.json({ message: 'Password berhasil diubah' });

  } catch (err) {
    next(err);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  updateUserRoleAndDepartment,
  deleteUser,
  changePassword
};
