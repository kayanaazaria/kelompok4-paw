<<<<<<< HEAD
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const reportRoutes = require("./routes/report");


dotenv.config();
const app = express();

app.use(cors());
=======
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
>>>>>>> fa6abe6b431ea85f4462a5dfe01a7153893ea3ab
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

<<<<<<< HEAD
// routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/reports", require("./routes/report.js")); // nanti kita buat
app.use("/api/reports", reportRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log(err));
=======
app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/laporan', laporanRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(errorHandler);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port: ${port}`);
});
>>>>>>> fa6abe6b431ea85f4462a5dfe01a7153893ea3ab
