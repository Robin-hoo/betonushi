const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Update Profile
router.put('/profile', authMiddleware, userController.updateProfile);

module.exports = router;
