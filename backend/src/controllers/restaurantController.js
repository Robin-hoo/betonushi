const RestaurantService = require('../services/restaurantService');

/**
 * Get all restaurants with filters
 * Query Params supported:
 * - lang: 'en', 'vi', 'jp'
 * - lat: User latitude (float)
 * - lng: User longitude (float)
 * - distance: Max distance in km (float)
 * - facilities: Comma separated string (e.g. "WiFi,Parking")
 */
async function getAllRestaurants(req, res, next) {
    try {
        const lang = (req.query.lang || (req.headers['accept-language'] || '').split(',')[0] || 'jp').slice(0,2);
        
        // Extract filters
        const filters = {
            lat: req.query.lat ? parseFloat(req.query.lat) : null,
            lng: req.query.lng ? parseFloat(req.query.lng) : null,
            distance: req.query.distance ? parseFloat(req.query.distance) : null,
            facilities: req.query.facilities ? req.query.facilities.split(',').filter(f => f.trim() !== '') : []
        };

        const restaurants = await RestaurantService.getAllRestaurants(lang, filters);
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
