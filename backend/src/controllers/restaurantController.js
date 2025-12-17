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

/**
 * Get restaurant by ID
 */
async function getRestaurantById(req, res, next) {
    try {
        const data = await RestaurantService.getRestaurantDetails(req.params.id);
        return res.json(data);
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    getAllRestaurants,
    getRestaurantById,
};
