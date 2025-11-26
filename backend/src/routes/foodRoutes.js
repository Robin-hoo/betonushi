const express = require('express');
const FoodController = require('../controllers/foodController');

const router = express.Router();

// GET /food/:id -> returns food detail with images & reviews
router.get('/food/:id', FoodController.getFoodById);

module.exports = router;


