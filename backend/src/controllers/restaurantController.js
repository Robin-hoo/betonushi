const RestaurantService = require('../services/restaurantService');

/**
 * Get all restaurants
 */
async function getAllRestaurants(req, res, next) {
    try {
        const lang = (req.query.lang || (req.headers['accept-language'] || '').split(',')[0] || 'jp').slice(0,2);
        const restaurants = await RestaurantService.getAllRestaurants(lang);
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
        const lang = (req.query.lang || (req.headers['accept-language'] || '').split(',')[0] || 'jp').slice(0,2);
        const data = await RestaurantService.getRestaurantDetails(req.params.id, lang);
        return res.json(data);
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    getAllRestaurants,
    getRestaurantById,
};
