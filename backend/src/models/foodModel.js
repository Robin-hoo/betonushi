const db = require('../db');
/**
 * Fetch a food along with its images and reviews.
 * Keeps queries simple and easy to maintain.
 * @param {number} foodId
 * @returns {Promise<{food: object|null, images: string[], reviews: object[]}>}
 */
async function getPopularFoods(limit = "4", lang = 'jp') {
  if (lang == 'jp') {
    const result = await db.query(`
    SELECT
      f.food_id,
      f.name,
      f.story,
      f.taste,
      f.rating,
      f.number_of_rating,
      ( SELECT image_url
        FROM food_images
        WHERE food_id = f.food_id
        ORDER BY food_image_id ASC
        LIMIT 1
      ) AS image_url
    FROM foods f
    ORDER BY f.rating DESC
    LIMIT $1
  `, [limit]);
    return result.rows;
  }

  const result = await db.query(`
    SELECT 
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
      ) AS image_url
    FROM foods f
    LEFT JOIN food_translations ft ON ft.food_id = f.food_id AND ft.lang = $1
    ORDER BY f.rating DESC
    LIMIT $2
  `, [lang, limit]);

  return result.rows;
}

/**
 * Fetch a food along with its images and reviews.
 */

async function findFoodWithRelations(foodId, lang = 'jp') {
  if (lang === 'jp') {
    // Query foods table
    const foodResult = await db.query(
      `SELECT food_id, name, story, ingredient, taste, style, comparison, region_id, view_count, rating, number_of_rating, created_at
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

  // Query foods table with translations if available
  const foodResult = await db.query(
    `SELECT f.food_id,
            COALESCE(ft.name, f.name) AS name,
            COALESCE(ft.story, f.story) AS story,
            COALESCE(ft.ingredient, f.ingredient) AS ingredient,
            COALESCE(ft.taste, f.taste) AS taste,
            COALESCE(ft.style, f.style) AS style,
            COALESCE(ft.comparison, f.comparison) AS comparison,
            f.region_id, f.view_count, f.rating, f.number_of_rating, f.created_at
     FROM foods f
     LEFT JOIN food_translations ft ON ft.food_id = f.food_id AND ft.lang = $1
     WHERE f.food_id = $2`,
    [lang, foodId]
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

async function getFilterOptions() {
  const regions = await db.query('SELECT region_id as id, name FROM regions ORDER BY region_id');
  const flavors = await db.query('SELECT flavor_id as id, name FROM flavors ORDER BY name');
  const ingredients = await db.query('SELECT ingredient_id as id, name FROM ingredients ORDER BY name LIMIT 8'); // MAX 10 ingredient

  return {
    regions: regions.rows,
    flavors: flavors.rows,
    ingredients: ingredients.rows
  };
}

/**
 * Fetch all foods with filter
 * @param {Object} filters - { region_ids, flavor_ids, ingredient_ids }
 */
async function getAllFoods(filters = {}) {
  const lang = filters.lang || 'jp';

  const params = [];
  let paramIndex = 1;

  let sql;

  if (lang === 'jp') {
    sql = `
      SELECT 
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
        (SELECT image_url 
         FROM food_images fi 
         WHERE fi.food_id = f.food_id 
         ORDER BY display_order 
         LIMIT 1) AS image_url
      FROM foods f, food_translations ft
      WHERE 1=1
    `;
  } else {
    sql = `
      SELECT 
        f.food_id,
        COALESCE(ft.name, f.name) AS name,
        COALESCE(ft.story, f.story) AS story,
        COALESCE(ft.ingredient, f.ingredient) AS ingredient,
        COALESCE(ft.taste, f.taste) AS taste,
        COALESCE(ft.style, f.style) AS style,
        COALESCE(ft.comparison, f.comparison) AS comparison,
        f.region_id,
        f.view_count,
        f.rating,
        f.number_of_rating,
        f.created_at,
        (SELECT image_url 
         FROM food_images fi 
         WHERE fi.food_id = f.food_id 
         ORDER BY display_order 
         LIMIT 1) AS image_url
      FROM foods f
      LEFT JOIN food_translations ft 
        ON ft.food_id = f.food_id 
       AND ft.lang = $${paramIndex}
      WHERE 1=1
    `;
    params.push(lang);
    paramIndex++;
  }

  if (filters.search) {
    sql += ` AND f.name ILIKE $${paramIndex} OR ft.name ILIKE $${paramIndex}`;
    params.push(`%${filters.search}%`);
    paramIndex++;
  }

  if (filters.region_ids?.length) {
    sql += ` AND f.region_id = ANY($${paramIndex}::int[])`;
    params.push(filters.region_ids);
    paramIndex++;
  }

  if (filters.flavor_ids?.length) {
    sql += `
      AND EXISTS (
        SELECT 1 FROM food_flavors ff
        WHERE ff.food_id = f.food_id
          AND ff.flavor_id = ANY($${paramIndex}::int[])
      )
    `;
    params.push(filters.flavor_ids);
    paramIndex++;
  }

  if (filters.ingredient_ids?.length) {
    sql += `
      AND EXISTS (
        SELECT 1 FROM food_ingredients fi
        WHERE fi.food_id = f.food_id
          AND fi.ingredient_id = ANY($${paramIndex}::int[])
      )
    `;
    params.push(filters.ingredient_ids);
    paramIndex++;
  }

  sql += ` ORDER BY f.created_at DESC`;

  const result = await db.query(sql, params);
  return result.rows;
}

module.exports = {
  findFoodWithRelations,
  getPopularFoods,
  getAllFoods,
  getFilterOptions,
};
