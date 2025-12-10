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
async function getFoodDetails(foodIdParam) {
  const foodId = Number.parseInt(foodIdParam, 10);
  if (Number.isNaN(foodId) || foodId <= 0) {
    throw buildHttpError(400, 'foodId phải là số nguyên dương');
  }

  try {
    const result = await FoodModel.findFoodWithRelations(foodId);
    if (!result.food) {
      throw buildHttpError(404, 'Food không tồn tại');
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
    throw buildHttpError(500, `Lỗi khi lấy dữ liệu food: ${err.message}`);
  }
}

/**
 * Get all foods from the database.
 * @returns {Promise<Array>}
 */
async function getAllFoods() {
  try {
    const foods = await FoodModel.getAllFoods();
    return foods;
  } catch (err) {
    console.error('Database error in getAllFoods:', err);
    throw buildHttpError(500, `Lỗi khi lấy danh sách món ăn: ${err.message}`);
  }
}

module.exports = {
  getFoodDetails,
  getAllFoods,
};


