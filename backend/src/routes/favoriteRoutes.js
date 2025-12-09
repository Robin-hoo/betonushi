const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Get all favorites for authenticated user
router.get('/', favoriteController.getFavorites);

// Get favorite status for multiple foods
router.get('/status', favoriteController.getFavoritesStatus);

// Check if specific food is favorited
router.get('/:foodId', favoriteController.checkFavorite);

// Add to favorites
router.post('/', favoriteController.addFavorite);

// Remove from favorites
router.delete('/:foodId', favoriteController.removeFavorite);

module.exports = router;
