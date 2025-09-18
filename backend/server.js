const express = require('express');
const helmet = require('helmet');
const { connectDB } = require('./config/dbConnection');
const dotenv = require('dotenv').config();
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
connectDB();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const laporanRoutes = require('./routes/laporan');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/laporan', laporanRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(errorHandler);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port: ${port}`);
});