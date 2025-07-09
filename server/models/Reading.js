const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String },
    preferences: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);