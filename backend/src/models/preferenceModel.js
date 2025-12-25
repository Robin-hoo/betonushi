const db = require('../db');

const preferenceModel = {
  /**
   * Get user preferences by user ID
   * @param {number} userId 
   * @returns {Promise<object|null>}
   */
  getByUserId: async (userId) => {
    const query = 'SELECT * FROM user_preferences WHERE user_id = $1';
    const result = await db.query(query, [userId]);
    return result.rows[0] || null;
  },

  /**
   * Create or update user preferences
   * @param {number} userId 
   * @param {object} preferences 
   */
  upsert: async (userId, preferences) => {
    const { favorite_taste, disliked_ingredients, dietary_criteria } = preferences;

    // Check if exists
    const existing = await preferenceModel.getByUserId(userId);

    if (existing) {
      const query = `
                UPDATE user_preferences 
                SET favorite_taste = $1, disliked_ingredients = $2, dietary_criteria = $3, updated_at = CURRENT_TIMESTAMP
                WHERE user_id = $4
                RETURNING *
            `;
      const result = await db.query(query, [favorite_taste, disliked_ingredients, dietary_criteria, userId]);
      return result.rows[0];
    } else {
      const query = `
                INSERT INTO user_preferences (user_id, favorite_taste, disliked_ingredients, dietary_criteria)
                VALUES ($1, $2, $3, $4)
                RETURNING *
            `;
      const result = await db.query(query, [userId, favorite_taste, disliked_ingredients, dietary_criteria]);
      return result.rows[0];
    }
  }
};

module.exports = preferenceModel;
