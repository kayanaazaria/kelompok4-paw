const express = require('express');
const helmet = require('helmet');
const { connectDB } = require('./config/dbConnection');
const dotenv = require('dotenv').config();
const cors = require('cors');
const passport = require('passport');
require('./config/passport');  
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 5001;

// Koneksi database (async untuk Vercel)
connectDB().catch(err => {
  console.error('Database connection failed:', err.message);
  // Jangan exit di serverless environment
});

// Initialize Passport (tanpa session untuk serverless)
app.use(passport.initialize());

// Debug middleware (hanya untuk development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log('Request URL:', req.url);
    console.log('Auth Header:', req.headers.authorization);
    console.log('User:', req.user);
    next();
  });
}

app.get('/', (_,res) => res.send('OK - Backend running on Vercel'));

// Security & Middleware
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:3001', 
    'http://localhost:5001',
    'https://kelompok4-paw.netlify.app',
    'https://*.netlify.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "unsafe-none" },
  frameguard: false // Disable X-Frame-Options untuk allow iframe
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static folder for uploads
app.use('/uploads', express.static('uploads'));

// ================== ROUTES ==================
const routes = require('./routes');
app.use('/', routes);

// ================== ERROR HANDLER ==================
app.use(errorHandler);

// Cek variabel lingkungan yang diperlukan (warning only di serverless)
const requiredEnvVars = [
  'MONGO_URI',
  'JWT_SECRET',
  'EMAIL_USER',
  'EMAIL_PASS',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'FRONTEND_URL'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.warn(`Missing required environment variable: ${varName}`);
  }
});

// Start server (hanya untuk local development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port: ${port}`);
  });
}

// Export untuk Vercel serverless
module.exports = app;
