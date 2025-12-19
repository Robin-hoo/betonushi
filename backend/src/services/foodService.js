const FoodModel = require('../models/foodModel');

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

    return {
      ...result.food,
      images: result.images,
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



module.exports = {
  getFoodDetails,
  getPopularFoods,
  getAllFoods,
  getFilterOptions,
};


