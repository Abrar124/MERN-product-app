const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }
        // Create a new user
        const user = new User({ username, email, password });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        // If user not found or password doesn't match, return error
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // If user and password match, generate a JWT token
        const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });

        // Send the token as a response
        res.status(200).json({ token }); // Send the token to the frontend
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login verification route
router.post('/verify-token', (req, res) => {
    const { token } = req.body;
    try {
      const decodedToken = jwt.verify(token, 'your-secret-key'); // Verify the token using your secret key
      // If verification is successful, send success response
      res.status(200).json({ success: true });
    } catch (error) {
      // If verification fails, send error response
      res.status(401).json({ success: false });
    }
  });


module.exports = router;
