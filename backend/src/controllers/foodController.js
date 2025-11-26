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

module.exports = {
  getFoodById,
};


