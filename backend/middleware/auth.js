const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// 🔑 Middleware untuk verifikasi JWT
const authMiddleware = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "User tidak ditemukan" });
      }

      return next();
    } catch (err) {
      console.error(err);
      return res.status(401).json({ message: "Token tidak valid" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Tidak ada token, akses ditolak" });
  }
};

// 🎭 Middleware untuk cek role
const roleCheck = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Tidak ada user di request" });
    }
    if (req.user.role !== role) {
      return res
        .status(403)
        .json({ message: `Hanya ${role} yang bisa mengakses route ini` });
    }
    next();
  };
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Akses ditolak. Hanya untuk admin.' });
  }
};

module.exports = { authMiddleware, roleCheck, isAdmin };
