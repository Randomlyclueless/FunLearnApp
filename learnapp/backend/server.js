const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import our route files
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const reportsRoutes = require("./routes/reports");
const streakRoutes = require("./routes/streak");

const app = express();

// --- Middleware ---
// Allows the server to parse JSON from incoming requests
app.use(express.json());
// Enables Cross-Origin Resource Sharing
app.use(cors());

// --- Database Connection ---
const mongoURI = process.env.MONGO_URI;

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.error("MongoDB connection error:", err));

// --- Basic Route to Test Server ---
app.get("/", (req, res) => {
  res.send("Leximate Backend is running!");
});

// --- Mount Routes ---
// These are our authentication routes (signup and login)
app.use("/api/auth", authRoutes);
// This is our protected route that requires a JWT
app.use("/api/profile", profileRoutes);
// This is the protected route for generating progress reports
app.use("/api/reports", reportsRoutes);
// This is the protected route for updating the daily streak
app.use("/api/streak", streakRoutes);

// --- Start the Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
