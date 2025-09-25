const express = require("express");
const protect = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

// @route   POST /api/streak/update
// @desc    Update a user's daily streak
// @access  Private
router.post("/update", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      const today = new Date().toDateString();
      const lastLoginDate = user.lastLogin.toDateString();

      if (today === lastLoginDate) {
        // Logged in today, do nothing or provide feedback
        res.status(200).json({
          success: true,
          message: "Streak maintained.",
          streak: user.streak,
        });
      } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayDate = yesterday.toDateString();

        if (lastLoginDate === yesterdayDate) {
          // Logged in yesterday, increment the streak
          user.streak += 1;
          user.lastLogin = new Date();
          await user.save();
          res.status(200).json({
            success: true,
            message: "Streak incremented!",
            streak: user.streak,
          });
        } else {
          // Break the streak
          user.streak = 1; // Reset to 1 for today's login
          user.lastLogin = new Date();
          await user.save();
          res.status(200).json({
            success: true,
            message: "Streak reset to 1.",
            streak: user.streak,
          });
        }
      }
    } else {
      res.status(404).json({ success: false, message: "User not found." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error.", error: error.message });
  }
});

module.exports = router;
