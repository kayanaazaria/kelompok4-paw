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

// Koneksi database
connectDB();

const app = express();

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
    maxAge: 24 * 60 * 60 * 1000 // 24 jam
  }
}));

// Inisialisasi passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:3000'];

console.log('Allowed CORS origins:', allowedOrigins);

app.use(cors({
  origin: function(origin, callback) {
    console.log('CORS check for origin:', origin);
    
    // Allow requests with no origin (mobile apps, Postman, etc)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    // Check if origin matches Vercel preview/production patterns
    if (origin.endsWith('.vercel.app')) {
      console.log('Allowing Vercel domain:', origin);
      return callback(null, true);
    }
    
    console.error('CORS blocked origin:', origin);
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Debug middleware
app.use((req, res, next) => {
  console.log('Request URL:', req.url);
  console.log('Auth Header:', req.headers.authorization);
  console.log('Session:', req.session);
  console.log('User:', req.user);
  next();
});

app.get('/', (_,res) => res.send('OK - API Ready'));

// Static folder for uploads
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api', require('./routes'));

// Error handling middleware
app.use(errorHandler);

module.exports = app;