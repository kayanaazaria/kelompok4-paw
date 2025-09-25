require('dotenv').config();

const express = require('express');
const { connectDB } = require('./config/dbConnection');
const dotenv = require('dotenv').config();
const session = require('express-session');
const passport = require('./config/passport');

connectDB();
const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_secret',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (_,res) => res.send('OK - finaldoc branch'));

const finalDocRouter = require('./routes/finalDoc.routes');
app.use('/finaldoc', finalDocRouter);

const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal error' });
});