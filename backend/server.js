const express = require('express');
const { connectDB } = require('./config/dbConnection');
const dotenv = require('dotenv').config();

connectDB();
const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (_,res) => res.send('OK - finaldoc branch'));

const finalDocRouter = require('./routes/finalDoc.routes');
app.use('/finaldoc', finalDocRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});