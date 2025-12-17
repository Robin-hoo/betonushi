const FavoriteService = require('../services/favoriteService');

async function toggleFavorite(req, res, next) {
  try {
    const userId = req.user.userId || req.user.id;
    if (!userId) {
      console.error("Favorite Controller: Missing userId in req.user", req.user);
      return res.status(401).json({ message: "User not authenticated correctly (missing ID)" });
    }
    const { targetId, type } = req.body;

    const result = await FavoriteService.toggleFavorite(userId, targetId, type);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

async function getFavorites(req, res, next) {
  try {
    const userId = req.user.userId || req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated correctly" });
    }
    const { type = 'food' } = req.query; // Default to food

    const favorites = await FavoriteService.getUserFavorites(userId, type);
    return res.json(favorites);
  } catch (error) {
    return next(error);
  }
}

async function checkStatus(req, res, next) {
  try {
    const userId = req.user.userId || req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated correctly" });
    }
    const { targetId, type = 'food' } = req.query;
    if (!targetId) return res.status(400).json({ message: "Missing targetId" });

    const isFavorited = await FavoriteService.checkIsFavorited(userId, targetId, type);
    return res.json({ isFavorited });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  toggleFavorite,
  getFavorites,
  checkStatus
};
