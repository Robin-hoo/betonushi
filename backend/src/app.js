const express = require("express");
const authRoutes = require("./routes/authRoutes");
const foodRoutes = require("./routes/foodRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const cors = require("cors");
const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Mount routes without extra prefix so path remains /food/:id
app.use("/api", foodRoutes);
app.use("/api", restaurantRoutes);
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
