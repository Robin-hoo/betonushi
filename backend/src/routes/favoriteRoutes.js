const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

router.post('/toggle', favoriteController.toggleFavorite);
router.get('/', favoriteController.getFavorites);
router.get('/status', favoriteController.checkStatus);

module.exports = router;
