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
    addReview,
};


async function addReview(restaurantIdParam, userId, rating, comment) {
  const restaurantId = Number.parseInt(restaurantIdParam, 10);
  if (Number.isNaN(restaurantId) || restaurantId <= 0) {
    throw buildHttpError(400, 'restaurantId must be a positive integer');
  }
  if (!rating || rating < 1 || rating > 5) {
    throw buildHttpError(400, 'Rating must be between 1 and 5');
  }

  const db = require('../db');
  try {
    // 1. Check if restaurant exists
    const restaurantCheck = await db.query('SELECT restaurant_id FROM restaurants WHERE restaurant_id = $1', [restaurantId]);
    if (restaurantCheck.rowCount === 0) {
      throw buildHttpError(404, 'Restaurant not found');
    }

    // 2. Insert review
    const insertReviewSql = `
      INSERT INTO reviews (user_id, target_id, type, comment, rating, created_at)
      VALUES ($1, $2, 'restaurant', $3, $4, NOW())
      RETURNING *
    `;
    const reviewRes = await db.query(insertReviewSql, [userId, restaurantId, comment || '', rating]);
    
    return reviewRes.rows[0];
  } catch (err) {
    console.error('Error in addReview:', err);
    if (err.status) throw err;
    throw buildHttpError(500, `Error when adding review: ${err.message}`);
  }
}


