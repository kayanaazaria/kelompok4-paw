const express = require('express');
const helmet = require('helmet');
const { connectDB } = require('./config/dbConnection');
const dotenv = require('dotenv').config();
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

// 🔍 DEBUG cek JWT_SECRET
console.log("DEBUG JWT_SECRET:", process.env.JWT_SECRET);

// Koneksi database
connectDB();

const app = express();
const port = process.env.PORT || 5001;

// Security & Middleware
app.use(cors());
app.use(helmet());
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

// Daftar routes utama
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/laporan', laporanRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/approvals', approvalRoutes);

// Error handler
app.use(errorHandler);

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port: ${port}`);
});
