const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const authMiddleware = require('../middleware/authMiddleware');

// Optional auth: if token is present, we use it to get user ID, otherwise proceed as anonymous
// We'll need a middleware that doesn't block if no token, just sets req.user = null
// But for now let's reuse authMiddleware if we want strict, or a "soft" auth.
// Let's create a custom "optionalAuth" middleware inline or if the existing one supports it.
// Assuming the current authMiddleware sends 401 if failed. We probably want a soft one.

const optionalAuth = (req, res, next) => {
  // We can try to reuse the logic from authMiddleware but catch errors and just next()
  // For simplicity, let's assuming if the client sends a token, they want personalized results.
  // If we want to support both in one endpoint, we usually check header manually here.

  // Quick implementation of reading JWT if present, similar to authMiddleware but non-blocking on fail
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    // We'd interpret the token here.
    // For now, let's rely on standard authMiddleware IF the frontend sends it. 
    // But the frontend might be public. 

    // Actually, let's just use the `authMiddleware` IF we know it's a logged in flow?
    // No, the homepage is mixed.

    // Let's just require the jwt library and verify lightly here
    const jwt = require('jsonwebtoken');
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_key');
      req.user = decoded;
    } catch (err) {
      // Invalid token, treat as anonymous
      console.warn("Invalid token in optional auth, treating as anonymous");
    }
  }
  next();
};

router.get('/recommendations', optionalAuth, recommendationController.getRecommendations);

module.exports = router;
