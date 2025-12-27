const express = require('express');
const RestaurantController = require('../controllers/restaurantController');

const router = express.Router();

// GET /restaurants -> returns all restaurants
router.get('/', RestaurantController.getAllRestaurants);

// GET /restaurants/:id -> returns restaurant detail
router.get('/:id', RestaurantController.getRestaurantById);

module.exports = router;
