const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    address: { type: String },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
    createdAt: { type: Date, default: Date.now },
    googleId: { type: String }, // ✅ Google ID for OAuth
    facebookId: { type: String }, // ✅ NEW: Facebook ID for OAuth
    humanToken: { type: String }, // ✅ NEW: Token for human verification
  humanTokenExpires: { type: Date }, // ✅ NEW: Expiry for the token
});

module.exports = mongoose.model('User', userSchema);