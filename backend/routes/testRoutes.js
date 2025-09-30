const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { isTokenBlacklisted } = require('../utils/jwtBlacklist');
const BlacklistedToken = require('../models/BlacklistedToken');
const { authMiddleware } = require('../middleware/auth');

router.get('/', (req,res)=>{
  res.json({ message: 'Diagnostics root OK' });
});

// Inspect current token status
router.get('/token-status', async (req,res)=>{
  const header = req.headers.authorization;
  if(!header) return res.status(400).json({ error: 'No Authorization header' });
  const parts = header.split(' ');
  if(parts.length !==2 || parts[0] !== 'Bearer') return res.status(400).json({ error: 'Bad Authorization format' });
  const token = parts[1];
  const blacklisted = await isTokenBlacklisted(token);
  let decoded = null;
  try { decoded = jwt.verify(token, process.env.JWT_SECRET); } catch(e) { decoded = { error: e.message }; }
  res.json({
    token_snippet: token.substring(0,20)+'...',
    blacklisted,
    decoded,
  });
});

// List blacklisted tokens (limit 20)
router.get('/blacklist', async (req,res)=>{
  const docs = await BlacklistedToken.find({}).sort({ createdAt: -1 }).limit(20).lean();
  res.json({ count: docs.length, docs: docs.map(d=>({ token_snip: d.token.substring(0,15)+'...', userId: d.userId, exp: d.expiresAt })) });
});

// Protected test (should fail if token blacklisted)
router.get('/protected', authMiddleware, (req,res)=>{
  res.json({ ok: true, userId: req.user._id, token_snippet: req.token.substring(0,15)+'...' });
});

module.exports = router;
