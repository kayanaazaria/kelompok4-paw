const express = require('express');
const helmet = require('helmet');
const { connectDB } = require('./config/dbConnection');
const dotenv = require('dotenv').config();
const cors = require('cors');
const session = require('express-session');
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

// Session configuration
if (!process.env.SESSION_SECRET) {
  console.error('ERROR: SESSION_SECRET is required in environment variables');
  // Jangan exit di serverless, biarkan error handler yang menangani
}

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', 
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Debug middleware
app.use((req, res, next) => {
  console.log('Request URL:', req.url);
  console.log('Auth Header:', req.headers.authorization);
  console.log('Session:', req.session);
  console.log('User:', req.user);
  next();
});

app.get('/', (_,res) => res.send('OK - finaldoc branch'));

// Security & Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5001'],
  credentials: true
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
  'SESSION_SECRET'
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
