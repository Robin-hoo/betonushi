const FavoriteModel = require('../models/favoriteModel');

function buildHttpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

/**
 * Toggle favorite status.
 * If exists -> remove.
 * If not exists -> add.
 * Returns { added: boolean }
 */
async function toggleFavorite(userId, targetId, type) {
  if (!targetId || !type) {
    throw buildHttpError(400, 'Missing targetId or type');
  }

  // Validate type
  if (!['food', 'restaurant'].includes(type)) {
    throw buildHttpError(400, 'Invalid type (must be food or restaurant)');
  }

  const exists = await FavoriteModel.checkFavorite(userId, targetId, type);

  if (exists) {
    await FavoriteModel.removeFavorite(userId, targetId, type);
    return { added: false };
  } else {
    await FavoriteModel.addFavorite(userId, targetId, type);
    return { added: true };
  }
}

/**
 * Get user favorites
 */
async function getUserFavorites(userId, type, lang) {
  if (!['food', 'restaurant'].includes(type)) {
    throw buildHttpError(400, 'Invalid type');
  }
  return await FavoriteModel.getFavoritesByUser(userId, type, lang);
}

/**
 * Check if a specific item is favorited
 */
async function checkIsFavorited(userId, targetId, type) {
  return await FavoriteModel.checkFavorite(userId, targetId, type);
}


module.exports = {
  toggleFavorite,
  getUserFavorites,
  checkIsFavorited
};
