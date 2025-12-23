const FoodModel = require('../models/foodModel');
const db = require('../db');

function buildHttpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

/**
 * Business logic wrapper that validates input before hitting the DB.
 * @param {string} foodIdParam
 */
async function getFoodDetails(foodIdParam, lang = 'jp') {
  const foodId = Number.parseInt(foodIdParam, 10);
  if (Number.isNaN(foodId) || foodId <= 0) {
    throw buildHttpError(400, 'foodId must be a positive integer');
  }

  try {
    const result = await FoodModel.findFoodWithRelations(foodId, lang);
    if (!result.food) {
      throw buildHttpError(404, 'Food does not exist');
    }

    // result.images is an array of { food_image_id, image_url }
    const images_meta = result.images || [];
    const images = images_meta.map((r) => r.image_url);

    return {
      ...result.food,
      images,
      images_meta,
      reviews: result.reviews,
    };
  } catch (err) {
    if (err.status) {
      throw err;
    }
    // Log the actual error for debugging
    console.error('Database error in getFoodDetails:', err);
    // Bubble up a sanitized error for unexpected DB issues.
    throw buildHttpError(500, `Error when fetching food details: ${err.message}`);
  }
}

async function deleteFood(foodIdParam) {
  const foodId = Number.parseInt(foodIdParam, 10);
  if (Number.isNaN(foodId) || foodId <= 0) {
    throw buildHttpError(400, 'foodId must be a positive integer');
  }

  const client = db;
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM food_images WHERE food_id = $1', [foodId]);
    await client.query('DELETE FROM food_translations WHERE food_id = $1', [foodId]);
    const res = await client.query('DELETE FROM foods WHERE food_id = $1', [foodId]);
    if (res.rowCount === 0) {
      await client.query('ROLLBACK');
      throw buildHttpError(404, 'Food not found');
    }
    await client.query('COMMIT');
    return true;
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error in deleteFood:', err);
    if (err.status) throw err;
    throw buildHttpError(500, `Error when deleting food: ${err.message}`);
  }
}

// Delete a single food image and remove the file
async function deleteFoodImage(foodIdParam, imageIdParam) {
  const foodId = Number.parseInt(foodIdParam, 10);
  const imageId = Number.parseInt(imageIdParam, 10);
  if (Number.isNaN(foodId) || foodId <= 0) {
    throw buildHttpError(400, 'foodId must be a positive integer');
  }
  if (Number.isNaN(imageId) || imageId <= 0) {
    throw buildHttpError(400, 'imageId must be a positive integer');
  }

  const client = db;
  try {
    await client.query('BEGIN');
    const sel = await client.query('SELECT image_url FROM food_images WHERE food_image_id = $1 AND food_id = $2', [imageId, foodId]);
    if (sel.rowCount === 0) {
      await client.query('ROLLBACK');
      throw buildHttpError(404, 'Image not found');
    }
    const imageUrl = sel.rows[0].image_url;

    // attempt to remove file from disk if it's a local path
    try {
      const fs = require('fs');
      const path = require('path');
      if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
        const filePath = path.join(__dirname, '..', '..', 'public', imageUrl.replace(/^\//, ''));
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    } catch (e) {
      console.warn('Failed to remove image file from disk:', e.message || e);
    }

    const del = await client.query('DELETE FROM food_images WHERE food_image_id = $1 RETURNING *', [imageId]);
    await client.query('COMMIT');
    return del.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error in deleteFoodImage:', err);
    if (err.status) throw err;
    throw buildHttpError(500, `Error when deleting food image: ${err.message}`);
  }
}

/**
 * list foods
 * @param {Object} filters - { region_ids, flavor_ids, ingredient_ids }
 */
async function getAllFoods(filters) {
  try {
    const foods = await FoodModel.getAllFoods(filters);
    return foods;
  } catch (err) {
    console.error('Database error in getAllFoods:', err);
    throw buildHttpError(500, `Error when fetching food list: ${err.message}`);
  }
}


async function getPopularFoods(limit, lang = 'jp') {
  try {
    const foods = await FoodModel.getPopularFoods(limit, lang);
    return foods;
  } catch (err) {
    console.error('Database error in getPopularFoods:', err);
    throw buildHttpError(500, `Error when fetching popular foods: ${err.message}`);
  }
}

/**
 * list sidebar filter options
 */
async function getFilterOptions() {
  try {
    const options = await FoodModel.getFilterOptions();
    return options;
  } catch (err) {
    console.error('Database error in getFilterOptions:', err);
    throw buildHttpError(500, `Error when fetching filter options: ${err.message}`);
  }
}

// ----------------- Admin write methods -----------------
async function createFood(payload, file) {
  if (!payload.name) {
    throw buildHttpError(400, 'name is required');
  }

  const client = db;
  try {
    await client.query('BEGIN');

    const insertFood = `INSERT INTO foods (name, story, ingredient, taste, style, comparison, region_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`;
    const foodRes = await client.query(insertFood, [
      payload.name,
      payload.story || null,
      payload.ingredient || null,
      payload.taste || null,
      payload.style || null,
      payload.comparison || null,
      payload.region_id || null,
    ]);
    const newFood = foodRes.rows[0];

    // translations (vi/en) if present
    if (payload.translations) {
      const { vi, en } = payload.translations;
      if (vi) {
        await client.query(`INSERT INTO food_translations (food_id, lang, name, story, ingredient, taste, style, comparison) VALUES ($1,'vi',$2,$3,$4,$5,$6,$7) ON CONFLICT (food_id, lang) DO UPDATE SET name = EXCLUDED.name, story = EXCLUDED.story, ingredient = EXCLUDED.ingredient, taste = EXCLUDED.taste, style = EXCLUDED.style, comparison = EXCLUDED.comparison`, [newFood.food_id, vi.name || null, vi.story || null, vi.ingredient || null, vi.taste || null, vi.style || null, vi.comparison || null]);
      }
      if (en) {
        await client.query(`INSERT INTO food_translations (food_id, lang, name, story, ingredient, taste, style, comparison) VALUES ($1,'en',$2,$3,$4,$5,$6,$7) ON CONFLICT (food_id, lang) DO UPDATE SET name = EXCLUDED.name, story = EXCLUDED.story, ingredient = EXCLUDED.ingredient, taste = EXCLUDED.taste, style = EXCLUDED.style, comparison = EXCLUDED.comparison`, [newFood.food_id, en.name || null, en.story || null, en.ingredient || null, en.taste || null, en.style || null, en.comparison || null]);
      }
    }

    if (file) {
      const imageUrl = `/uploads/foods/${file.filename}`;
      await client.query(`INSERT INTO food_images (food_id, image_url, display_order, is_primary) VALUES ($1,$2,$3,$4)`, [newFood.food_id, imageUrl, 1, true]);
    }

    await client.query('COMMIT');

    return await getFoodDetails(newFood.food_id, 'jp');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error in createFood:', err);
    throw buildHttpError(500, `Error when creating food: ${err.message}`);
  }
}

async function updateFood(foodIdParam, payload, file) {
  const foodId = Number.parseInt(foodIdParam, 10);
  if (Number.isNaN(foodId) || foodId <= 0) {
    throw buildHttpError(400, 'foodId must be a positive integer');
  }

  const client = db;
  try {
    await client.query('BEGIN');

    const updateSql = `UPDATE foods SET name = COALESCE($1,name), story = COALESCE($2,story), ingredient = COALESCE($3,ingredient), taste = COALESCE($4,taste), style = COALESCE($5,style), comparison = COALESCE($6,comparison), region_id = COALESCE($7,region_id) WHERE food_id = $8 RETURNING *`;
    const res = await client.query(updateSql, [
      payload.name || null,
      payload.story || null,
      payload.ingredient || null,
      payload.taste || null,
      payload.style || null,
      payload.comparison || null,
      payload.region_id || null,
      foodId,
    ]);

    if (res.rowCount === 0) {
      throw buildHttpError(404, 'Food not found');
    }

    // translations
    if (payload.translations) {
      const { vi, en } = payload.translations;
      if (vi) {
        await client.query(`INSERT INTO food_translations (food_id, lang, name, story, ingredient, taste, style, comparison) VALUES ($1,'vi',$2,$3,$4,$5,$6,$7) ON CONFLICT (food_id, lang) DO UPDATE SET name = EXCLUDED.name, story = EXCLUDED.story, ingredient = EXCLUDED.ingredient, taste = EXCLUDED.taste, style = EXCLUDED.style, comparison = EXCLUDED.comparison`, [foodId, vi.name || null, vi.story || null, vi.ingredient || null, vi.taste || null, vi.style || null, vi.comparison || null]);
      }
      if (en) {
        await client.query(`INSERT INTO food_translations (food_id, lang, name, story, ingredient, taste, style, comparison) VALUES ($1,'en',$2,$3,$4,$5,$6,$7) ON CONFLICT (food_id, lang) DO UPDATE SET name = EXCLUDED.name, story = EXCLUDED.story, ingredient = EXCLUDED.ingredient, taste = EXCLUDED.taste, style = EXCLUDED.style, comparison = EXCLUDED.comparison`, [foodId, en.name || null, en.story || null, en.ingredient || null, en.taste || null, en.style || null, en.comparison || null]);
      }
    }

    if (file) {
      const imageUrl = `/uploads/foods/${file.filename}`;
      await client.query(`INSERT INTO food_images (food_id, image_url, display_order, is_primary) VALUES ($1,$2,$3,$4)`, [foodId, imageUrl, 1, false]);
    }

    await client.query('COMMIT');

    return await getFoodDetails(foodId, 'jp');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error in updateFood:', err);
    if (err.status) throw err;
    throw buildHttpError(500, `Error when updating food: ${err.message}`);
  }
}

async function deleteFood(foodIdParam) {
  const foodId = Number.parseInt(foodIdParam, 10);
  if (Number.isNaN(foodId) || foodId <= 0) {
    throw buildHttpError(400, 'foodId must be a positive integer');
  }

  const client = db;
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM food_images WHERE food_id = $1', [foodId]);
    await client.query('DELETE FROM food_translations WHERE food_id = $1', [foodId]);
    const res = await client.query('DELETE FROM foods WHERE food_id = $1', [foodId]);
    if (res.rowCount === 0) {
      await client.query('ROLLBACK');
      throw buildHttpError(404, 'Food not found');
    }
    await client.query('COMMIT');
    return true;
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error in deleteFood:', err);
    if (err.status) throw err;
    throw buildHttpError(500, `Error when deleting food: ${err.message}`);
  }
}

async function addFoodImage(foodIdParam, file) {
  const foodId = Number.parseInt(foodIdParam, 10);
  if (Number.isNaN(foodId) || foodId <= 0) {
    throw buildHttpError(400, 'foodId must be a positive integer');
  }
  if (!file) {
    throw buildHttpError(400, 'file is required');
  }

  try {
    const imageUrl = `/uploads/foods/${file.filename}`;
    const res = await db.query(`INSERT INTO food_images (food_id, image_url, display_order, is_primary) VALUES ($1,$2,$3,$4) RETURNING *`, [foodId, imageUrl, 1, false]);
    return res.rows[0];
  } catch (err) {
    console.error('Error in addFoodImage:', err);
    throw buildHttpError(500, `Error when adding food image: ${err.message}`);
  }
}

module.exports = {
  getFoodDetails,
  getPopularFoods,
  getAllFoods,
  getFilterOptions,
  createFood,
  updateFood,
  deleteFood,
  addFoodImage,
  deleteFoodImage,
};


