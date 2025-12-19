const db = require('../db');

/**
 * Add a favorite entry.
 */
async function addFavorite(userId, targetId, type) {
  const result = await db.query(
    `INSERT INTO favorites (user_id, target_id, type)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, target_id, type) DO NOTHING
     RETURNING favorite_id`,
    [userId, targetId, type]
  );
  return result.rows[0];
}

/**
 * Remove a favorite entry.
 */
async function removeFavorite(userId, targetId, type) {
  const result = await db.query(
    `DELETE FROM favorites
     WHERE user_id = $1 AND target_id = $2 AND type = $3
     RETURNING favorite_id`,
    [userId, targetId, type]
  );
  return result.rows[0];
}

/**
 * Check if a favorite exists.
 */
async function checkFavorite(userId, targetId, type) {
  const result = await db.query(
    `SELECT favorite_id FROM favorites
     WHERE user_id = $1 AND target_id = $2 AND type = $3`,
    [userId, targetId, type]
  );
  return result.rows.length > 0;
}

/**
 * Get all favorites for a user by type.
 * Joins with existing tables (foods/restaurants) to get details.
 */
async function getFavoritesByUser(userId, type, lang = 'jp') {
  if (type === 'food') {
    if (lang === 'jp') {
      const result = await db.query(
        `SELECT 
          f.food_id,
          f.name,
          f.story,
          f.taste,
          f.rating,
          f.number_of_rating,
          (
              SELECT image_url
              FROM food_images
              WHERE food_id = f.food_id
              ORDER BY food_image_id ASC
              LIMIT 1
          ) AS image_url,
          fav.created_at as favorited_at
        FROM favorites fav
        JOIN foods f ON fav.target_id = f.food_id
        WHERE fav.user_id = $1 AND fav.type = 'food'
        ORDER BY fav.created_at DESC`,
        [userId]
      );
      return result.rows;
    } else {
      const result = await db.query(
        `SELECT
          f.food_id,
          COALESCE(ft.name, f.name) AS name,
          COALESCE(ft.story, f.story) AS story,
          COALESCE(ft.taste, f.taste) AS taste,
          f.rating,
          f.number_of_rating,
          (
              SELECT image_url
              FROM food_images
              WHERE food_id = f.food_id
              ORDER BY food_image_id ASC
              LIMIT 1
          ) AS image_url,
          fav.created_at as favorited_at
        FROM favorites fav
        JOIN foods f ON fav.target_id = f.food_id
        LEFT JOIN food_translations ft ON ft.food_id = f.food_id AND ft.lang = $2
        WHERE fav.user_id = $1 AND fav.type = 'food'
        ORDER BY fav.created_at DESC`,
        [userId, lang]
      );
      return result.rows;
    }
  }

  if (type === 'restaurant') {
    // Basic implementation for restaurants if needed later
    const result = await db.query(
      `SELECT r.*, fav.created_at as favorited_at
       FROM favorites fav
       JOIN restaurants r ON fav.target_id = r.restaurant_id
       WHERE fav.user_id = $1 AND fav.type = 'restaurant'
       ORDER BY fav.created_at DESC`,
      [userId]
    );
    return result.rows;
  }

  return [];
}

module.exports = {
  addFavorite,
  removeFavorite,
  checkFavorite,
  getFavoritesByUser,
};
