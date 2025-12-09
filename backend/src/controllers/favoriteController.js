const favoriteModel = require('../models/favoriteModel');

/**
 * Add a food item to favorites
 */
async function addFavorite(req, res) {
    try {
        const userId = req.user.id; // from auth middleware
        const { foodId } = req.body;

        if (!foodId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Food ID is required' 
            });
        }

        const favorite = await favoriteModel.addFavorite(userId, foodId);
        
        res.status(201).json({
            success: true,
            message: 'Added to favorites',
            data: favorite
        });
    } catch (error) {
        console.error('Error adding favorite:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add to favorites'
        });
    }
}

/**
 * Remove a food item from favorites
 */
async function removeFavorite(req, res) {
    try {
        const userId = req.user.id;
        const { foodId } = req.params;

        if (!foodId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Food ID is required' 
            });
        }

        const deleted = await favoriteModel.removeFavorite(userId, parseInt(foodId));
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Favorite not found'
            });
        }

        res.json({
            success: true,
            message: 'Removed from favorites'
        });
    } catch (error) {
        console.error('Error removing favorite:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove from favorites'
        });
    }
}

/**
 * Get all favorites for the authenticated user
 */
async function getFavorites(req, res) {
    try {
        const userId = req.user.id;
        const favorites = await favoriteModel.getFavoritesByUserId(userId);
        
        res.json({
            success: true,
            data: favorites
        });
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch favorites'
        });
    }
}

/**
 * Check if a specific food is favorited
 */
async function checkFavorite(req, res) {
    try {
        const userId = req.user.id;
        const { foodId } = req.params;

        if (!foodId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Food ID is required' 
            });
        }

        const isFavorited = await favoriteModel.isFavorite(userId, parseInt(foodId));
        
        res.json({
            success: true,
            isFavorite: isFavorited
        });
    } catch (error) {
        console.error('Error checking favorite:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check favorite status'
        });
    }
}

/**
 * Get favorite status for multiple foods
 */
async function getFavoritesStatus(req, res) {
    try {
        const userId = req.user.id;
        const { foodIds } = req.query; // expecting comma-separated IDs

        if (!foodIds) {
            return res.json({
                success: true,
                data: {}
            });
        }

        const ids = foodIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
        const status = await favoriteModel.getFavoritesStatus(userId, ids);
        
        res.json({
            success: true,
            data: status
        });
    } catch (error) {
        console.error('Error fetching favorites status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch favorites status'
        });
    }
}

module.exports = {
    addFavorite,
    removeFavorite,
    getFavorites,
    checkFavorite,
    getFavoritesStatus
};
