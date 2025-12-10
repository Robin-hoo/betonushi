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

/**
 * Fetch restaurant detail with foods, facilities, and reviews
 * @param {number} restaurantId
 * @returns {Promise<{restaurant: object|null, foods: Array, facilities: Array, reviews: Array}>}
 */
async function findRestaurantWithRelations(restaurantId) {
    // Query restaurant basic info
    const restaurantResult = await db.query(
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
        WHERE restaurant_id = $1`,
        [restaurantId]
    );

    if (restaurantResult.rowCount === 0) {
        return { restaurant: null, foods: [], facilities: [], reviews: [] };
    }

    // Query restaurant foods with food details
    const foodsResult = await db.query(
        `SELECT 
            f.food_id,
            f.name,
            f.story,
            rf.price,
            rf.is_recommended,
            (
                SELECT image_url
                FROM food_images
                WHERE food_id = f.food_id
                ORDER BY is_primary DESC, display_order ASC, food_image_id ASC
                LIMIT 1
            ) AS image_url
        FROM restaurant_foods rf
        INNER JOIN foods f ON rf.food_id = f.food_id
        WHERE rf.restaurant_id = $1
        ORDER BY rf.is_recommended DESC, f.name`,
        [restaurantId]
    );

    // Query restaurant facilities
    const facilitiesResult = await db.query(
        `SELECT facility_name
        FROM restaurant_facilities
        WHERE restaurant_id = $1
        ORDER BY facility_name`,
        [restaurantId]
    );

    // Query restaurant reviews with user info
    const reviewsResult = await db.query(
        `SELECT 
            r.review_id,
            r.user_id,
            u.full_name AS user_name,
            u.avatar_url,
            r.rating,
            r.comment,
            r.created_at
        FROM reviews r
        LEFT JOIN users u ON r.user_id = u.user_id
        WHERE r.target_id = $1 AND r.type = 'restaurant'
        ORDER BY r.created_at DESC
        LIMIT 10`,
        [restaurantId]
    );

    // Calculate average rating
    const ratingResult = await db.query(
        `SELECT 
            COALESCE(AVG(rating), 0) AS avg_rating,
            COUNT(*) AS total_reviews
        FROM reviews
        WHERE target_id = $1 AND type = 'restaurant'`,
        [restaurantId]
    );

    const restaurant = {
        ...restaurantResult.rows[0],
        rating: parseFloat(ratingResult.rows[0].avg_rating) || 0,
        number_of_rating: parseInt(ratingResult.rows[0].total_reviews) || 0,
    };

    return {
        restaurant,
        foods: foodsResult.rows,
        facilities: facilitiesResult.rows.map((row) => row.facility_name),
        reviews: reviewsResult.rows,
    };
}

module.exports = {
    getAllRestaurants,
    findRestaurantWithRelations,
};
