const app = require('./app');

// Vercel serverless function handler
module.exports = app;

// Also export as default for Vercel
module.exports.default = app;
