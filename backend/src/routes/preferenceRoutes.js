const express = require('express');
const router = express.Router();
const preferenceController = require('../controllers/preferenceController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, preferenceController.upsertPreferences);
router.get('/', authMiddleware, preferenceController.getPreferences);

module.exports = router;
