// routes/userroute.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/users?role=admin
router.get('/', async (req, res) => {
  try {
    const { role } = req.query;

    let filter = {};
    if (role) filter.role = role;

    const users = await User.find(filter).select('-password'); // exclude password
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
