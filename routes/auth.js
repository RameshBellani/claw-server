const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();


router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send('User already exists');

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).send('User registered');
  } catch (err) {
    console.error('Server error during registration:', err);
    res.status(500).send('Server error');
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('Invalid credentials');

    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send('Invalid credentials');

    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.send({ token });
  } catch (err) {
    console.error('Server error during login:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
