require("dotenv").config();

const express = require("express");
const path = require('path');
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const geminiRoutes = require("./routes/scriptRoutes");
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
// Serve uploaded files under /uploads (maps to backend/public/uploads)
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

// Routes
console.log("Mounting Gemini Routes at /api");
app.use("/api", geminiRoutes);
console.log("Gemini routes mounted.");

app.use("/api", foodRoutes);
app.use("/api", restaurantRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api", authRoutes);
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

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
