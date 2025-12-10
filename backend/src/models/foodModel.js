const db = require('../db');
/**
 * Fetch a food along with its images and reviews.
 * Keeps queries simple and easy to maintain.
 * @param {number} foodId
 * @returns {Promise<{food: object|null, images: string[], reviews: object[]}>}
 */
async function getPopularFoods() {
  const result = await db.query(`
    SELECT 
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
      ) AS image
    FROM foods f
    ORDER BY f.rating DESC
    LIMIT 4
  `);

  return result.rows;
}

/**
 * Fetch a food along with its images and reviews.
 */

async function findFoodWithRelations(foodId) {
  // Query foods table (using POT schema columns)
  const foodResult = await db.query(
    `SELECT food_id, name, story, ingredient, taste, style, comparison,
            region_id, view_count, rating, number_of_rating, created_at
     FROM foods
     WHERE food_id = $1`,
    [foodId]
  );

  if (foodResult.rowCount === 0) {
    return { food: null, images: [], reviews: [] };
  }

  // Query food_images table (matches schema.sql)
  const imagesResult = await db.query(
    `SELECT image_url
     FROM food_images
     WHERE food_id = $1
     ORDER BY display_order, food_image_id`,
    [foodId]
  );

  // Query reviews table (matches schema.sql)
  const reviewsResult = await db.query(
    `SELECT review_id, user_id, comment, rating, created_at
     FROM reviews
     WHERE target_id = $1 AND type = 'food'
     ORDER BY review_id DESC`,
    [foodId]
  );

  return {
    food: foodResult.rows[0],
    images: imagesResult.rows.map((row) => row.image_url),
    reviews: reviewsResult.rows,
  };
}

/**
 * Fetch all foods with their primary image.
 * @returns {Promise<Array>}
 */
async function getAllFoods() {
  const result = await db.query(
    `SELECT 
      f.food_id, 
      f.name, 
      f.story, 
      f.ingredient, 
      f.taste, 
      f.style, 
      f.comparison,
      f.region_id, 
      f.view_count, 
      f.rating, 
      f.number_of_rating, 
      f.created_at,
      fi.image_url
     FROM foods f
     LEFT JOIN food_images fi ON f.food_id = fi.food_id AND fi.is_primary = TRUE
     ORDER BY f.food_id`
  );

  return result.rows;
}
module.exports = {
  findFoodWithRelations,
  getPopularFoods,
  getAllFoods,
};
