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

async function getFilterOptions(req, res, next) {
  try {
    const options = await FoodService.getFilterOptions();
    return res.json(options);
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
    const { search, regions, flavors, ingredients } = req.query;

    const filters = {
      search: search || '',
      region_ids: regions ? regions.split(',').map(Number) : [],
      flavor_ids: flavors ? flavors.split(',').map(Number) : [],
      ingredient_ids: ingredients ? ingredients.split(',').map(Number) : []
    };

    const foods = await FoodService.getAllFoods(filters);
    return res.json(foods);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getFoodById,
  getPopularFoods,
  getAllFoods,
  getFilterOptions,
};


