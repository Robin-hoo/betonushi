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
    return result.rows || null;
  },

  /**
   * Create or update user preferences
   * @param {number} userId 
   * @param {object} preferences 
   */
  upsert: async (userId, preferences) => {
    const {
      favorite_taste = '',
      disliked_ingredients = '',
      dietary_criteria = '',
      target_name = '',
      priorities = '',
      private_room = '',
      group_size = ''
    } = preferences;

    // Check if exists
    const existing = await preferenceModel.getByUserId(userId);
    const targetPreference = existing.find(item => item.target_name === target_name)
    if (targetPreference) {
      const query = `
                UPDATE user_preferences 
                SET favorite_taste = $1, disliked_ingredients = $2, dietary_criteria = $3,
                    target_name = $4, priorities = $5, private_room = $6, group_size = $7,
                    updated_at = CURRENT_TIMESTAMP
                WHERE user_id = $8 AND target_name = $9
                RETURNING *
            `;
      const result = await db.query(query, [
        favorite_taste,
        disliked_ingredients,
        dietary_criteria,
        target_name,
        priorities,
        private_room,
        group_size,
        userId,
        target_name
      ]);
      console.log(result);
      return result.rows[0];
    } else {
      const query = `
                INSERT INTO user_preferences (user_id, favorite_taste, disliked_ingredients, dietary_criteria, target_name, priorities, private_room, group_size)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *
            `;
      const result = await db.query(query, [
        userId,
        favorite_taste,
        disliked_ingredients,
        dietary_criteria,
        target_name,
        priorities,
        private_room,
        group_size
      ]);
      return result.rows[0];
    }
  }
};

module.exports = preferenceModel;
