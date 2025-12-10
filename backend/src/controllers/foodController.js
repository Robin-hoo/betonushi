const FoodService = require('../services/foodService');

/**
 * Controller layer: receives req/res, delegates to service, handles response.
 */
async function getFoodById(req, res, next) {
  try {
    const data = await FoodService.getFoodDetails(req.params.id);
    return res.json(data);
  } catch (error) {
    return next(error);
  }
}
async function getPopularFoods(req, res, next) {
  try {
    const foods = await FoodService.getFoods();
    return res.json(data);
  } catch (error) {
    return next(error);
  }
}
/**
 * Get all foods.
 */
async function getAllFoods(req, res, next) {
  try {
    const foods = await FoodService.getAllFoods();
    return res.json(foods);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getFoodById,
  getPopularFoods,
  getAllFoods,
};


