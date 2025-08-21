require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const session = require('express-session');  // ✅ Session middleware for auth
const passport = require('passport');        // ✅ Passport for OAuth
require('./config/passport');                // ✅ Load Passport config (Google + Facebook)
const authenticateToken = require('./middleware/authMiddleware'); // ✅ adjust path if needed

const dataRoutes = require('./routes/dataRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Sessions
app.use(session({
  secret: process.env.SESSION_SECRET, // From .env
  resave: false,
  saveUninitialized: false,
}));

// ✅ Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// ✅ Main API routes
// app.use('/api', dataRoutes);
app.use('/api/request-password-reset', dataRoutes);
app.use('/api/verify-password-reset-otp', dataRoutes);
app.use('/api/reset-password', dataRoutes);
app.use('/api/resend-otp', dataRoutes);
app.use('/api/signup', dataRoutes);
app.use('/api/signin', dataRoutes);

app.use('/api/user', authenticateToken, dataRoutes); // ✅ anything like /api/user/:id now requires token

app.use('/api/profile', authenticateToken, dataRoutes);


// ✅ Google OAuth Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/signin.html' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id, email: req.user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
res.redirect(`/dashboard1.html?token=${token}&userId=${req.user._id}&userEmail=${encodeURIComponent(req.user.email)}&userName=${encodeURIComponent(req.user.name)}`);  }
);

// ✅ Facebook OAuth Routes (NEW)
app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/signin.html' }),
  (req, res) => {
    res.redirect(`/dashboard1.html?userId=${req.user._id}&userEmail=${encodeURIComponent(req.user.email)}&userName=${encodeURIComponent(req.user.name)}`); // ✅ Success redirect with user data
  }
);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Routes (already included above, kept for compatibility)
app.use('/api', dataRoutes);

module.exports = app;

// Connect to MongoDB
const connectDB = require('./db');
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`click to view: http://localhost:${PORT}`)
});