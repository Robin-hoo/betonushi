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

/**
 * Get restaurant detail by ID
 * @param {string} restaurantIdParam
 * @returns {Promise<object>}
 */
async function getRestaurantDetails(restaurantIdParam) {
    const restaurantId = Number.parseInt(restaurantIdParam, 10);
    if (Number.isNaN(restaurantId) || restaurantId <= 0) {
        throw buildHttpError(400, 'restaurantId phải là số nguyên dương');
    }

    try {
        const result = await RestaurantModel.findRestaurantWithRelations(restaurantId);
        if (!result.restaurant) {
            throw buildHttpError(404, 'Nhà hàng không tồn tại');
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
        throw buildHttpError(500, `Lỗi khi lấy dữ liệu nhà hàng: ${err.message}`);
    }
}

module.exports = {
    getAllRestaurants,
    getRestaurantDetails,
};
