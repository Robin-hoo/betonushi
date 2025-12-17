require("dotenv").config();

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const geminiRoutes = require("./routes/gemini.js");
const foodRoutes = require("./routes/foodRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.static("public"));

// Routes
console.log("Mounting Gemini Routes at /api");
app.use("/api", geminiRoutes);
console.log("Gemini routes mounted.");

app.use("/api", foodRoutes);
app.use("/api", restaurantRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api", authRoutes);

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint không tồn tại" });
});

// Centralized error handler so every controller stays clean
app.use((err, req, res, _next) => {
  const statusCode = err.status || 500;
  const message = err.message || "Lỗi hệ thống";
  if (statusCode >= 500) {
    console.error(err);
  }
  res.status(statusCode).json({ message });
});

module.exports = app;
