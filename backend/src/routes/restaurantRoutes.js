const express = require('express');
const RestaurantController = require('../controllers/restaurantController');

const router = express.Router();

// GET /restaurants -> returns all restaurants
router.get('/restaurants', RestaurantController.getAllRestaurants);

module.exports = router;
