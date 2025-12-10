const db = require('../db');

/**
 * Fetch all restaurants from the database
 * @returns {Promise<Array>}
 */
async function getAllRestaurants() {
    const result = await db.query(
        `SELECT 
      restaurant_id,
      name,
      address,
      latitude,
      longitude,
      open_time,
      close_time,
      price_range,
      phone_number
     FROM restaurants
     ORDER BY restaurant_id`
    );

    return result.rows;
}

module.exports = {
    getAllRestaurants,
};
