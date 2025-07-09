const express = require('express');
const router = express.Router();
const User = require('../models/Reading'); // ✅ Make sure this schema is correct
const bcrypt = require('bcryptjs'); // or require('bcrypt');

// ✅ Signup route
router.post('/signup', async (req, res) => {
  const { name, email, password, address, preferences } = req.body;

  try {
    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      address,
      preferences,
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
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

    // 3. Send success response
    return res.status(200).json({
      msg: '✅ Login successful!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        preferences: user.preferences
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
  

module.exports = router;
