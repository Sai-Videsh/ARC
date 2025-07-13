require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const session = require('express-session');  // ✅ Added
const passport = require('passport');        // ✅ Added
require('./config/passport');                // ✅ NEW: load Google strategy

const dataRoutes = require('./routes/dataRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ✅ Sessions
app.use(session({
  secret: process.env.SESSION_SECRET, // put in .env ideally
  resave: false,
  saveUninitialized: false,
}));

// ✅ Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// ✅ Main routes
app.use('/api', dataRoutes);

// ✅ Google OAuth Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/signin.html' }),
  (req, res) => {
    res.redirect('/dashboard1.html'); // ✅ Success
  }
);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api', dataRoutes);

module.exports = app;


// Connect to MongoDB
const connectDB = require('./db');
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});