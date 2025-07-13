const express = require('express');
const router = express.Router();
const User = require('../models/User'); // ✅ Make sure this schema is correct
console.log('User model:', User);
const bcrypt = require('bcryptjs'); // or require('bcrypt');
const nodemailer = require('nodemailer');

// ✅ Email setup (move to .env in production)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  pool: true,
  auth: {
    user: process.env.GMAIL_USER, // ✅ From .env
    pass: process.env.GMAIL_PASS,
  },
});

// OTP Generator
function generateOTP() {
  const var1 = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(var1);
  return var1;
}

// ✅ Signup route
router.post('/signup', async (req, res) => {
  console.log('Signup request body:', req.body);
  const { name, phone, email, password, address } = req.body;
  try {
    console.log('Checking existing user with email:', email);
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const existingUser = await User.findOne({ email });
    console.log('Existing user:', existingUser);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    console.log('Generated OTP:', otp);
    console.log('Creating new user...');
    const user = new User({
      name,
      phone,
      email: email.trim().toLowerCase(),  // 🔥 force lowercase
      password: hashedPassword,
      address,
      otp,
      otpExpires: new Date(Date.now() + 10 * 60 * 1000),
      isVerified: false
    });
    console.log('Saving user...');
    await user.save();
    console.log('User saved, sending email...');
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      if(!process.env.GMAIL_PASS) console.log("Passeord is missing")
      else console.error('Error: GMAIL_USER or GMAIL_PASS missing in .env');
      return res.status(500).json({ message: 'Email configuration error' });
    }
    await transporter.sendMail({
      from: 'youremail@gmail.com',
      to: email,
      subject: 'Your OTP Verification Code',
      html: `<h3>Your OTP is: ${otp}</h3><p>This will expire in 10 minutes.</p>`,
    });
    console.log('Email sent');
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Signup error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  console.log('Verify OTP request:', { email, otp });
  try {
    console.log('Searching for user with email:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('User found:', { email: user.email, isVerified: user.isVerified, otp: user.otp, otpExpires: user.otpExpires });
    if (user.isVerified) {
      console.log('User already verified:', email);
      return res.status(400).json({ message: 'User already verified' });
    }
    if (user.otp !== otp || new Date() > user.otpExpires) {
      console.log('Invalid or expired OTP. Provided:', otp, 'Stored:', user.otp, 'Expires:', user.otpExpires);
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    console.log('OTP valid, verifying user...');
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    console.log('User verified:', email);
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verify OTP error:', error.message, error.stack);
    res.status(500).json({ message: 'OTP verification failed', error: error.message });
  }
});

// 📌 Resend OTP
router.post('/resend-otp', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    user.otp = otp;
    user.otpExpires = otpExpiry;
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "🔁 Resent OTP for ARC Account",
      html: `<h3>Your new OTP is: ${otp}</h3><p>It expires in 10 minutes.</p>`,
    });

    res.status(200).json({ message: "OTP resent successfully" });

  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   POST /api/request-password-reset
router.post('/request-password-reset', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "Email not found" });

  const otp = generateOTP();
  user.otp = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset OTP',
    html: `<p>Your OTP is: <b>${otp}</b>. It will expire in 10 minutes.</p>`
  });

  res.json({ message: "OTP sent to your email" });
});

// @route   POST /api/verify-password-reset-otp
router.post('/verify-password-reset-otp', async (req, res) => {
  console.log("OTP verify hit");
  const { email, otp } = req.body;
  console.log("Received email:", email); 
  const normalizedEmail = email.trim().toLowerCase();
  console.log("Normalized email:", normalizedEmail); 
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    console.log("User not found for email:", normalizedEmail);
    return res.status(404).json({ message: "User not found" });
  }

  if (String(user.otp) !== String(otp)) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  if (user.otpExpires < Date.now()) {
    return res.status(400).json({ message: "OTP Expired" });
  }

  return res.status(200).json({ message: "OTP verified" });
});

// @route   POST /api/reset-password
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  const hashed = await bcrypt.hash(newPassword, 10);

  await User.findOneAndUpdate(
    { email },
    { password: hashed, otp: null, otpExpires: null }
  );

  res.json({ message: "Password reset successful" });
});

// ✅ Signin route (Fix completed)
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: '❌ Email is not signed up' });
    }

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: '❌ Password is incorrect' });
    }
    if (!user.isVerified) {
    return res.status(403).json({ message: 'Please verify your email first' });
    }


    // 3. Send success response
    return res.status(200).json({
      msg: '✅ Login successful!',
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        address: user.address,
      }
    });

  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

// ✅ GET user by ID
router.get('/user/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Optional: only return safe fields
      res.status(200).json({
        name: user.name,
        phone: user.phone,
        email: user.email,
        address: user.address,
        preferences: user.preferences,
        deviceLinked: user.deviceLinked || false,
        subscriptionPlan: user.subscriptionPlan || 'Free',
        warrantyStatus: user.warrantyStatus || 'Unknown'
      });
    } catch (error) {
      console.error('❌ Error fetching user:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  // ✅ Protected route example
router.get('/profile', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  res.status(200).json({ user: req.user });
});

  

module.exports = router;
