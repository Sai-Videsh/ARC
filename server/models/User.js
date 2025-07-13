const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: {type: String},
    email: { type: String, required: true, unique: true },
    password: { type: String},
    address: { type: String },
    // preferences: { type: String },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires:{ type: Date },
    createdAt: { type: Date, default: Date.now },
    googleId: { type: String }, // ✅ Added this line

});

module.exports = mongoose.model('User', userSchema);