const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { isTokenBlacklisted } = require("../utils/jwtBlacklist");

// 🔑 Middleware untuk verifikasi JWT dengan blacklist check
const authMiddleware = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log('[AUTH] Incoming token snippet:', token.substring(0,15) + '...');

      const isBlacklisted = await isTokenBlacklisted(token);
      console.log('[AUTH] Blacklist check result:', isBlacklisted);
      if (isBlacklisted) {
        return res.status(401).json({ 
          message: "Token telah di-logout dan tidak valid",
          code: "TOKEN_BLACKLISTED"
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('[AUTH] Token decoded userId:', decoded.id);

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "User tidak ditemukan" });
      }

      // Store token di req untuk digunakan di logout
      req.token = token;

      return next();
    } catch (err) {
      console.error('[AUTH] JWT error:', err.message);
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

module.exports = { authMiddleware, roleCheck };
