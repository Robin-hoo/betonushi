const FoodService = require('../services/foodService');

/**
 * Controller layer: receives req/res, delegates to service, handles response.
 */
async function getFoodById(req, res, next) {
  try {
    const lang = (req.query.lang || (req.headers['accept-language'] || '').split(',')[0] || 'jp').slice(0,2);
    const data = await FoodService.getFoodDetails(req.params.id, lang);

    // Convert relative upload paths to absolute URLs pointing to this server
    const makeAbsolute = (u) => {
      if (!u) return u;
      if (u.startsWith('http') || u.startsWith('data:')) return u;
      return `${req.protocol}://${req.get('host')}${u}`;
    };

    if (Array.isArray(data.images)) {
      data.images = data.images.map(makeAbsolute);
    }
    if (Array.isArray(data.images_meta)) {
      data.images_meta = data.images_meta.map((im) => ({ ...im, image_url: makeAbsolute(im.image_url) }));
    }
    if (data.image_url) {
      data.image_url = makeAbsolute(data.image_url);
    }

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
    const lang = (req.query.lang || (req.headers['accept-language'] || '').split(',')[0] || 'jp').slice(0,2);
    const limit = req.query.limit || 4;

    const foods = await FoodService.getPopularFoods(limit, lang);

    const makeAbsolute = (u) => {
      if (!u) return u;
      if (u.startsWith('http') || u.startsWith('data:')) return u;
      return `${req.protocol}://${req.get('host')}${u}`;
    };

    const normalized = foods.map((f) => ({
      ...f,
      image_url: makeAbsolute(f.image_url),
    }));

    return res.json(normalized);
  } catch (error) {
    return next(error);
  }
}
/**
 * Get all foods.
 */
async function getAllFoods(req, res, next) {
  try {
    const { search, flavors, ingredients, types } = req.query;
    const lang = (req.query.lang || (req.headers['accept-language'] || '').split(',')[0] || 'jp').slice(0,2);

    const filters = {
      search: search || '',
      flavor_ids: flavors ? flavors.split(',').map(Number) : [],
      ingredient_ids: ingredients ? ingredients.split(',').map(Number) : [],
      food_type_ids: types ? types.split(',').map(Number) : [],
      lang
    };

    const foods = await FoodService.getAllFoods(filters);

    const makeAbsolute = (u) => {
      if (!u) return u;
      if (u.startsWith('http') || u.startsWith('data:')) return u;
      return `${req.protocol}://${req.get('host')}${u}`;
    };

    const normalized = foods.map((f) => ({
      ...f,
      image_url: makeAbsolute(f.image_url),
    }));

    return res.json(normalized);
  } catch (error) {
    return next(error);
  }
}

// ----------------- Admin write endpoints -----------------
async function createFood(req, res, next) {
  try {
    const payload = req.body || {};
    const file = req.file;
    const result = await FoodService.createFood(payload, file);
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

async function updateFood(req, res, next) {
  try {
    const payload = req.body || {};
    const file = req.file;
    const result = await FoodService.updateFood(req.params.id, payload, file);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

async function deleteFood(req, res, next) {
  try {
    await FoodService.deleteFood(req.params.id);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
}

async function uploadFoodImage(req, res, next) {
  try {
    const file = req.file;
    if (!file) {
      const err = new Error('No file uploaded');
      err.status = 400;
      throw err;
    }
    const img = await FoodService.addFoodImage(req.params.id, file);
    return res.status(201).json(img);
  } catch (error) {
    return next(error);
  }
}

async function deleteFoodImage(req, res, next) {
  try {
    const { id, imageId } = req.params;
    const result = await FoodService.deleteFoodImage(id, imageId);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getFoodById,
  getPopularFoods,
  getAllFoods,
  getFilterOptions,
  createFood,
  updateFood,
  deleteFood,
  uploadFoodImage,
  deleteFoodImage,
};


