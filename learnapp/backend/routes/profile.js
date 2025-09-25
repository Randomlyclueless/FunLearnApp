const express = require("express");
const protect = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    if (req.user) {
      res.status(200).json({
        success: true,
        message: `Welcome, ${req.user.email}! This is a protected route.`,
        user: {
          id: req.user._id,
          email: req.user.email,
        },
      });
    } else {
      res.status(404).json({ success: false, message: "User not found." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

module.exports = router;
