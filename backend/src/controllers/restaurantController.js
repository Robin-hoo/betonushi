const RestaurantService = require('../services/restaurantService');

/**
 * Get all restaurants
 */
async function getAllRestaurants(req, res, next) {
    try {
        const restaurants = await RestaurantService.getAllRestaurants();
        return res.json(restaurants);
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    getAllRestaurants,
};
