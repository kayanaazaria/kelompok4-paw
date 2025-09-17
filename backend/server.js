const express = require('express');
const { connectDB } = require('./config/dbConnection');
const dotenv = require('dotenv').config();
const cors = require('cors');
const laporanRoutes = require('./routes/laporan');
connectDB();
const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/laporan', laporanRoutes);


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
