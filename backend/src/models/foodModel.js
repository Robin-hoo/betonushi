const db = require('../db');

/**
 * Fetch a food along with its images and reviews.
 * Keeps queries simple and easy to maintain.
 * @param {number} foodId
 * @returns {Promise<{food: object|null, images: string[], reviews: object[]}>}
 */
async function findFoodWithRelations(foodId) {
  const foodResult = await db.query(
    `SELECT id, name, story, ingredient, taste, style, comparison, rating, number_of_rating
     FROM food
     WHERE id = $1`,
    [foodId]
  );

  if (foodResult.rowCount === 0) {
    return { food: null, images: [], reviews: [] };
  }

  const imagesResult = await db.query(
    `SELECT path
     FROM food_image
     WHERE food_id = $1
     ORDER BY id`,
    [foodId]
  );

  const reviewsResult = await db.query(
    `SELECT id, user_id, comment, rating
     FROM review
     WHERE food_id = $1
     ORDER BY id DESC`,
    [foodId]
  );

  return {
    food: foodResult.rows[0],
    images: imagesResult.rows.map((row) => row.path),
    reviews: reviewsResult.rows,
  };
}

module.exports = {
  findFoodWithRelations,
};


