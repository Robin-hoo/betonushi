const RestaurantModel = require('../models/restaurantModel');

function buildHttpError(status, message) {
    const error = new Error(message);
    error.status = status;
    return error;
}

/**
 * Get all restaurants from the database
 * @returns {Promise<Array>}
 */
async function getAllRestaurants() {
    try {
        const restaurants = await RestaurantModel.getAllRestaurants();
        return restaurants;
    } catch (err) {
        console.error('Database error in getAllRestaurants:', err);
        throw buildHttpError(500, `Lỗi khi lấy danh sách nhà hàng: ${err.message}`);
    }
}

module.exports = {
    getAllRestaurants,
};
