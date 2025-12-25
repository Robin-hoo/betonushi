const db = require('../db');
const preferenceModel = require('../models/preferenceModel');

const recommendationService = {
  /**
   * Get recommendations for a user
   * @param {number|null} userId 
   * @param {number} limit 
   * @param {string} lang 
   * @param {object|null} criteria - Optional criteria from survey
   */
  getRecommendations: async (userId, limit = 5, lang = 'en', criteria = null) => {
    let query = '';
    let params = [];
    let preferences = null;

    // 1. Determine Preferences (User DB or Passed Criteria)
    if (criteria) {
      // Use passed criteria (e.g. from survey)
      preferences = {
        favorite_taste: criteria.tastes ? criteria.tastes.join(',') : '',
        disliked_ingredients: criteria.dislikes ? criteria.dislikes.join(',') : '',
        dietary_criteria: criteria.genres ? criteria.genres.join(',') : ''
      };
    } else if (userId) {
      // Fetch from DB
      preferences = await preferenceModel.getByUserId(userId);
    }

    if (preferences) {
      let whereConditions = ['1=1'];

      if (preferences.disliked_ingredients) {
        const disliked = preferences.disliked_ingredients.split(',').map(i => i.trim());
        disliked.forEach((ing, index) => {
          if (ing) {
            params.push(`%${ing}%`);
            whereConditions.push(`(f.ingredient NOT ILIKE $${params.length})`);
          }
        });
      }

      let tasteCondition = '';
      if (preferences.favorite_taste) {
        const tastes = preferences.favorite_taste.split(',').map(t => t.trim());
        const tasteOrs = [];
        tastes.forEach((t, index) => {
          if (t) {
            params.push(`%${t}%`);
            tasteOrs.push(`f.taste ILIKE $${params.length}`);
          }
        });
        if (tasteOrs.length > 0) {
          tasteCondition = `AND (${tasteOrs.join(' OR ')})`;
        }
      }

      query = `
                    SELECT DISTINCT f.*, 
                           COALESCE(ft.name, f.name) as name,
                           COALESCE(ft.story, f.story) as story,
                           (SELECT image_url FROM food_images fi WHERE fi.food_id = f.food_id ORDER BY display_order LIMIT 1) as image_url
                    FROM foods f
                    LEFT JOIN food_translations ft ON f.food_id = ft.food_id AND ft.lang = '${lang}'
                    WHERE ${whereConditions.join(' AND ')}
                    ${tasteCondition}
                    ORDER BY f.rating DESC, f.view_count DESC
                    LIMIT $${params.length + 1}
                `;

      params.push(limit);
    }

    // 2. Fallback / Anonymous: Just return popular high-rated items
    if (!query) {
      query = `
                SELECT f.*, 
                       COALESCE(ft.name, f.name) as name,
                       COALESCE(ft.story, f.story) as story,
                       (SELECT image_url FROM food_images fi WHERE fi.food_id = f.food_id ORDER BY display_order LIMIT 1) as image_url
                FROM foods f
                LEFT JOIN food_translations ft ON f.food_id = ft.food_id AND ft.lang = $2
                ORDER BY f.rating DESC, f.view_count DESC
                LIMIT $1
            `;
      params = [limit, lang];
    }

    try {
      const result = await db.query(query, params);
      return result.rows;
    } catch (e) {
      console.error("Recommendation query error:", e);
      return [];
    }
  }
};

module.exports = recommendationService;
