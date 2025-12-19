const express = require('express');
const FoodController = require('../controllers/foodController');

const router = express.Router();

// GET /filters -> list checkbox into Sidebar
router.get('/filters', FoodController.getFilterOptions);

// GET /foods -> returns all foods with primary image
router.get('/foods', FoodController.getAllFoods);

// GET /food/:id -> returns food detail with images & reviews
router.get('/foods/:id', FoodController.getFoodById);
router.get('/favorite_foods', FoodController.getPopularFoods);
module.exports = router;


