const express = require('express');
const helmet = require('helmet');
const { connectDB } = require('./config/dbConnection');
const dotenv = require('dotenv').config();
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('./config/passport');  
const errorHandler = require('./middleware/errorHandler');

// Koneksi database
connectDB();

const app = express();
const port = process.env.PORT || 5001;

// Session configuration
if (!process.env.SESSION_SECRET) {
  console.error('ERROR: SESSION_SECRET is required in environment variables');
  process.exit(1);
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
  origin: ['http://localhost:3000', 'http://localhost:5001'],
  credentials: true
}));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "unsafe-none" }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploads
app.use('/uploads', express.static('uploads'));

// ================== ROUTES ==================
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const laporanRoutes = require('./routes/laporan');
const notificationRoutes = require('./routes/notificationRoutes');
const approvalRoutes = require('./routes/approvalRoutes');

// ROUTE TEST EMAIL
const testRoutes = require("./routes/testRoutes"); 
app.use("/api/test", testRoutes);

// Auth routes untuk OAuth dan API
app.use('/auth', authRoutes);        // Untuk OAuth Google
app.use('/api/auth', authRoutes);    // Untuk login/register biasa

// Daftar routes utama dengan prefix /api
app.use('/api/users', userRoutes);
app.use('/api/laporan', laporanRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/approvals', approvalRoutes);

// ================== ERROR HANDLER ==================
app.use(errorHandler);

// Cek variabel lingkungan yang diperlukan
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
    console.error(`Missing required environment variable: ${varName}`);
    process.exit(1);
  }
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port: ${port}`);
});
