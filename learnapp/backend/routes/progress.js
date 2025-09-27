const express = require("express");
const Progress = require("../models/Progress");
// routes/progress.js
const protect = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * POST /api/progress/update
 * Update or insert user’s progress for a given module
 */
router.post("/update", protect, async (req, res) => {
  try {
    const {
      module,
      completedTasks,
      totalTasks,
      correctAnswers,
      attempts,
      timeSpent,
    } = req.body;

    if (!module) {
      return res.status(400).json({ error: "Module is required" });
    }

    const progress = await Progress.findOneAndUpdate(
      { userId: req.user.id, module }, // match logged-in user + module
      {
        $set: {
          completedTasks,
          totalTasks,
          correctAnswers,
          attempts,
          timeSpent,
        },
        $push: {
          history: {
            completedTasks,
            totalTasks,
            accuracy:
              attempts > 0 ? Math.round((correctAnswers / attempts) * 100) : 0,
            timeSpent,
          },
        },
        $currentDate: { lastUpdated: true },
      },
      { new: true, upsert: true }
    );

    res.json(progress);
  } catch (err) {
    console.error("❌ Error updating progress:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET /api/progress/report
 * Fetch all modules’ progress for the logged-in user
 */
router.get("/report", protect, async (req, res) => {
  try {
    const progressDocs = await Progress.find({ userId: req.user.id });

    const report = progressDocs.map((p) => ({
      module: p.module,
      completion: p.completion, // from virtual
      accuracy: p.accuracy,
      timeSpent: p.timeSpent,
      lastUpdated: p.lastUpdated,
      history: p.history,
    }));

    res.json(report);
  } catch (err) {
    console.error("❌ Error fetching report:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
