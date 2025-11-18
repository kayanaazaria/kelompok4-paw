const jwt = require('jsonwebtoken');
const BlacklistedToken = require('../models/BlacklistedToken');

// Fungsi untuk blacklist token
const blacklistToken = async (token, userId, reason = 'logout') => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      throw new Error('Invalid token format (no exp claim)');
    }

    const expiresAt = new Date(decoded.exp * 1000);

    try {
      await BlacklistedToken.create({ token, userId, expiresAt, reason });
      console.log('[BLACKLIST] Token saved:', {
        userId: userId?.toString(),
        expISO: expiresAt.toISOString(),
        short: token.substring(0, 15) + '...'
      });
    } catch (err) {
      if (err.code === 11000) {
        // Duplicate (sudah di-blacklist sebelumnya)
        console.log('[BLACKLIST] Token already blacklisted (duplicate key)', token.substring(0,15) + '...');
      } else {
        throw err;
      }
    }

    return true;
  } catch (error) {
    console.error('Error blacklisting token:', error.message);
    throw error;
  }
};

// Fungsi untuk cek apakah token di-blacklist
const isTokenBlacklisted = async (token) => {
  try {
    const blacklistedToken = await BlacklistedToken.findOne({ token }).lean();
    const isBL = !!blacklistedToken;
    return isBL;
  } catch (error) {
    console.error('Error checking blacklisted token:', error.message);
    return false;
  }
};

// Fungsi untuk cleanup expired tokens (optional - MongoDB TTL sudah handle)
const cleanupExpiredTokens = async () => {
  try {
    const now = new Date();
    const result = await BlacklistedToken.deleteMany({
      expiresAt: { $lt: now }
    });
    console.log(`Cleaned up ${result.deletedCount} expired blacklisted tokens`);
    return result.deletedCount;
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error);
    return 0;
  }
};

// Fungsi untuk blacklist semua token user (untuk force logout)
const blacklistAllUserTokens = async (userId, reason = 'forced_logout') => {
  try {
    // Ini untuk future implementation jika butuh force logout all devices
    // Untuk sekarang, kita track per-token basis
    console.log(`Force logout requested for user: ${userId}`);
    return true;
  } catch (error) {
    console.error('Error force logging out user:', error);
    throw error;
  }
};

module.exports = {
  blacklistToken,
  isTokenBlacklisted,
  cleanupExpiredTokens,
  blacklistAllUserTokens
};