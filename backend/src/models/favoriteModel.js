const db = require('../db');

/**
 * Add a food item to user's favorites
 * @param {number} userId 
 * @param {number} foodId 
 * @returns {Promise<object>} The created favorite record
 */
async function addFavorite(userId, foodId) {
    const result = await db.query(
        `INSERT INTO user_favorites (user_id, food_id) 
         VALUES ($1, $2) 
         ON CONFLICT (user_id, food_id) DO NOTHING
         RETURNING *`,
        [userId, foodId]
    );
    return result.rows[0];
}

/**
 * Remove a food item from user's favorites
 * @param {number} userId 
 * @param {number} foodId 
 * @returns {Promise<boolean>} True if deleted, false otherwise
 */
async function removeFavorite(userId, foodId) {
    const result = await db.query(
        `DELETE FROM user_favorites 
         WHERE user_id = $1 AND food_id = $2
         RETURNING *`,
        [userId, foodId]
    );
    return result.rows.length > 0;
}

/**
 * Get all favorite food items for a user with full food details
 * @param {number} userId 
 * @returns {Promise<object[]>} Array of favorite foods with details
 */
async function getFavoritesByUserId(userId) {
    const result = await db.query(
        `SELECT 
            f.id,
            f.name,
            f.story,
            f.ingredient,
            f.taste,
            f.style,
            f.comparison,
            f.rating,
            f.number_of_rating,
            uf.created_at as favorited_at,
            COALESCE(
                json_agg(
                    DISTINCT fi.path
                    ORDER BY fi.path
                ) FILTER (WHERE fi.path IS NOT NULL),
                '[]'
            ) as images
         FROM user_favorites uf
         JOIN food f ON uf.food_id = f.id
         LEFT JOIN food_image fi ON f.id = fi.food_id
         WHERE uf.user_id = $1
         GROUP BY f.id, f.name, f.story, f.ingredient, f.taste, f.style, 
                  f.comparison, f.rating, f.number_of_rating, uf.created_at
         ORDER BY uf.created_at DESC`,
        [userId]
    );
    return result.rows;
}

/**
 * Check if a food item is in user's favorites
 * @param {number} userId 
 * @param {number} foodId 
 * @returns {Promise<boolean>} True if favorited, false otherwise
 */
async function isFavorite(userId, foodId) {
    const result = await db.query(
        `SELECT 1 FROM user_favorites 
         WHERE user_id = $1 AND food_id = $2`,
        [userId, foodId]
    );
    return result.rows.length > 0;
}

/**
 * Get favorite status for multiple foods for a user
 * @param {number} userId 
 * @param {number[]} foodIds 
 * @returns {Promise<object>} Object mapping foodId to favorite status
 */
async function getFavoritesStatus(userId, foodIds) {
    if (!foodIds || foodIds.length === 0) {
        return {};
    }

    const result = await db.query(
        `SELECT food_id FROM user_favorites 
         WHERE user_id = $1 AND food_id = ANY($2)`,
        [userId, foodIds]
    );

    const favoritedIds = new Set(result.rows.map(row => row.food_id));
    const status = {};
    foodIds.forEach(id => {
        status[id] = favoritedIds.has(id);
    });
    return status;
}

module.exports = {
    addFavorite,
    removeFavorite,
    getFavoritesByUserId,
    isFavorite,
    getFavoritesStatus
};
