// testProgress.js
const mongoose = require("mongoose");
const Progress = require("./models/Progress"); // adjust path if needed

async function run() {
  try {
    // 1. Connect to your DB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/leximate"
    );
    console.log("✅ Connected to MongoDB");

    // 2. Create a sample progress doc
    const p = await Progress.create({
      userId: "64f1a2b3c4d5e6f7a8b9c0d1", // ⚠️ replace with a real User _id from your users collection
      module: "colors",
      totalTasks: 10,
      completedTasks: 3,
      correctAnswers: 3,
      attempts: 4,
      timeSpent: 60,
    });

    console.log("📊 Progress saved:", p);

    // 3. Disconnect
    await mongoose.disconnect();
    console.log("🔌 Disconnected");
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

run();
