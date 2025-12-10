const express = require('express');
const RestaurantController = require('../controllers/restaurantController');

const router = express.Router();

// GET /restaurants -> returns all restaurants
router.get('/restaurants', RestaurantController.getAllRestaurants);

// GET /restaurants/:id -> returns restaurant detail
router.get('/restaurants/:id', RestaurantController.getRestaurantById);

module.exports = router;
