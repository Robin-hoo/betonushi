const db = require('../db');

/**
 * Fetch restaurants with filters (distance, facilities)
 * @param {string} lang
 * @param {object} filters - { lat, lng, distance, facilities }
 * @returns {Promise<Array>}
 */
async function getAllRestaurants(lang = 'jp', filters = {}) {
    const { lat, lng, distance, facilities } = filters;
    
    // 1. Base Query
    let query = `
        SELECT 
            r.restaurant_id,
            COALESCE(rt.name, r.name) AS name,
            COALESCE(rt.address, r.address) AS address,
            r.latitude,
            r.longitude,
            r.open_time,
            r.close_time,
            r.price_range,
            r.phone_number
            ${lat && lng ? `, (
                6371 * acos(
                    cos(radians($2)) * cos(radians(r.latitude)) *
                    cos(radians(r.longitude) - radians($3)) +
                    sin(radians($2)) * sin(radians(r.latitude))
                )
            ) AS distance_km` : ''}
        FROM restaurants r
        LEFT JOIN restaurant_translations rt ON rt.restaurant_id = r.restaurant_id AND rt.lang = $1
    `;

    const params = [lang];
    let paramCount = 1;

    // 2. Add params for Distance Calculation
    if (lat && lng) {
        params.push(lat); 
        params.push(lng); 
        paramCount += 2;
    }

    let whereClauses = [];
    let havingClauses = [];

    // 3. Filter by Facilities
    if (facilities && facilities.length > 0) {
        query += `
            JOIN restaurant_facilities rf ON r.restaurant_id = rf.restaurant_id
        `;
        whereClauses.push(`rf.facility_name = ANY($${paramCount + 1})`);
        params.push(facilities); // e.g., ['WiFi', 'Parking']
        paramCount++;
    }

    if (whereClauses.length > 0) {
        query += ' WHERE ' + whereClauses.join(' AND ');
    }

    // 4. Group By
    if (facilities && facilities.length > 0) {
        query += ` GROUP BY r.restaurant_id, rt.name, rt.address `;
        havingClauses.push(`COUNT(DISTINCT rf.facility_name) >= $${paramCount + 1}`);
        params.push(facilities.length);
        paramCount++;
    }

    // 5. Filter by Distance
    if (lat && lng && distance) {
        const distanceFormula = `(
            6371 * acos(
                cos(radians($2)) * cos(radians(r.latitude)) *
                cos(radians(r.longitude) - radians($3)) +
                sin(radians($2)) * sin(radians(r.latitude))
            )
        )`;
        havingClauses.push(`${distanceFormula} <= $${paramCount + 1}`);
        params.push(distance);
        paramCount++;
    }

    if (havingClauses.length > 0) {
        if (!query.includes('GROUP BY')) {
             query += ` GROUP BY r.restaurant_id, rt.name, rt.address `;
        }
        query += ' HAVING ' + havingClauses.join(' AND ');
    }

    // 6. Order By
    if (lat && lng) {
        query += ` ORDER BY distance_km ASC`;
    } else {
        query += ` ORDER BY r.restaurant_id`;
    }

    const result = await db.query(query, params);
    return result.rows;
}

/**
 * Fetch restaurant detail with foods, facilities, and reviews
 * @param {number} restaurantId
 * @returns {Promise<{restaurant: object|null, foods: Array, facilities: Array, reviews: Array}>}
 */
async function findRestaurantWithRelations(restaurantId, lang = 'jp') {
    // Query restaurant basic info with translations
    const restaurantResult = await db.query(
        `SELECT 
            r.restaurant_id,
            COALESCE(rt.name, r.name) AS name,
            COALESCE(rt.address, r.address) AS address,
            r.latitude,
            r.longitude,
            r.open_time,
            r.close_time,
            r.price_range,
            r.phone_number
        FROM restaurants r
        LEFT JOIN restaurant_translations rt ON rt.restaurant_id = r.restaurant_id AND rt.lang = $1
        WHERE r.restaurant_id = $2`,
        [lang, restaurantId]
    );

    if (restaurantResult.rowCount === 0) {
        return { restaurant: null, foods: [], facilities: [], reviews: [] };
    }

    // Query restaurant foods with food details
    const foodsResult = await db.query(
        `SELECT 
            f.food_id,
            COALESCE(ft.name, f.name) AS name,
            COALESCE(ft.story, f.story) AS story,
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
        LEFT JOIN food_translations ft ON ft.food_id = f.food_id AND ft.lang = $1
        WHERE rf.restaurant_id = $2
        ORDER BY rf.is_recommended DESC, COALESCE(ft.name, f.name)`,
        [lang, restaurantId]
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
