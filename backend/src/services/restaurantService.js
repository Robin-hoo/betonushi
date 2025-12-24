const RestaurantModel = require('../models/restaurantModel');

function buildHttpError(status, message) {
    const error = new Error(message);
    error.status = status;
    return error;
}

/**
 * Get all restaurants from the database with optional filters
 * @param {string} lang
 * @param {object} filters - { lat, lng, distance, facilities }
 * @returns {Promise<Array>}
 */
async function getAllRestaurants(lang = 'jp', filters = {}) {
    try {
        // Validate lat/lng if distance is provided
        if (filters.distance && (!filters.lat || !filters.lng)) {
            console.warn('Distance filter provided without coordinates. Ignoring distance filter.');
            delete filters.distance;
        }

        const restaurants = await RestaurantModel.getAllRestaurants(lang, filters);
        return restaurants;
    } catch (err) {
        console.error('Database error in getAllRestaurants:', err);
        throw buildHttpError(500, `Error when fetching restaurant list: ${err.message}`);
    }
}

/**
 * Get restaurant detail by ID
 * @param {string} restaurantIdParam
 * @returns {Promise<object>}
 */
async function getRestaurantDetails(restaurantIdParam, lang = 'jp') {
    const restaurantId = Number.parseInt(restaurantIdParam, 10);
    if (Number.isNaN(restaurantId) || restaurantId <= 0) {
        throw buildHttpError(400, 'restaurantId must be a positive integer');
    }

    try {
        const result = await RestaurantModel.findRestaurantWithRelations(restaurantId, lang);
        if (!result.restaurant) {
            throw buildHttpError(404, 'The restaurant does not exist');
        }

        return {
            ...result.restaurant,
            foods: result.foods,
            facilities: result.facilities,
            reviews: result.reviews,
        };
    } catch (err) {
        if (err.status) {
            throw err;
        }
        console.error('Database error in getRestaurantDetails:', err);
        throw buildHttpError(500, `Error when fetching restaurant details: ${err.message}`);
    }
}

module.exports = {
    getAllRestaurants,
    getRestaurantDetails,
};
