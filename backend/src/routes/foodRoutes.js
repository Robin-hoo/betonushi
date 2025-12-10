const express = require('express');
const FoodController = require('../controllers/foodController');

const router = express.Router();

// GET /foods -> returns all foods with primary image
router.get('/foods', FoodController.getAllFoods);

// GET /food/:id -> returns food detail with images & reviews
router.get('/food/:id', FoodController.getFoodById);
router.get('/foods', FoodController.getPopularFoods);
module.exports = router;


