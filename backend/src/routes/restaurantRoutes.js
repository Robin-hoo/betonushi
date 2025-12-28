const express = require('express');
const RestaurantController = require('../controllers/restaurantController');
const authenticateToken = require('../middleware/authMiddleware');


const router = express.Router();


// POST /restaurants/:id/reviews -> add review to restaurant
router.post('/:id/reviews', authenticateToken, RestaurantController.addReview);


// GET /restaurants -> returns all restaurants
router.get('/', RestaurantController.getAllRestaurants);


// GET /restaurants/:id -> returns restaurant detail
router.get('/:id', RestaurantController.getRestaurantById);


module.exports = router;
