const express = require("express");
const protect = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

// @route   GET /api/reports/progress
// @desc    Get a user's progress report
// @access  Private
router.get("/progress", protect, async (req, res) => {
  try {
    // The 'protect' middleware has already attached the user to the request
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // You can now create a detailed report object from the user data
    const report = {
      email: user.email,
      dailyStreak: user.streak,
      lastActive: user.lastLogin,
      // Add more progress data here as you build it (e.g., words mastered)
      observations: `Based on your child's activity, they are on a ${user.streak}-day learning streak! This shows amazing consistency and engagement.`,
      recommendations:
        "Encourage them to continue their daily tasks to maintain this great habit.",
    };

    res.status(200).json({ success: true, report });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error.", error: error.message });
  }
});

module.exports = router;
