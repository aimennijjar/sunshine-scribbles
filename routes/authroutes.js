// routes/authroutes.js
const express = require('express');
const passport = require('passport');
const User = require('../models/user');

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = new User({ username });
        await User.register(user, password);
        res.status(201).json({ message: 'User successfully signed up' });
    } catch (error) {
        res.status(500).json({ error: 'Signup failed', details: error });
    }
});

// Login Route
router.post('/login', passport.authenticate('local'), (req, res) => {
    res.status(200).json({ message: 'Logged in successfully', user: req.user });
});

// Logout Route
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Could not log out' });
        }
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

module.exports = router;

