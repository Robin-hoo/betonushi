const preferenceModel = require('../models/preferenceModel');

exports.upsertPreferences = async (req, res) => {
  try {
    const userId = req.user.userId;
    const preferences = req.body; // { favorite_taste, disliked_ingredients, dietary_criteria, etc. }

    // basic validation
    if (!preferences) {
      return res.status(400).json({ message: 'No preferences provided' });
    }

    const result = await preferenceModel.upsert(userId, preferences);
    res.json(result);
  } catch (error) {
    console.error('Upsert preferences error:', error);
    res.status(500).json({ message: 'Error saving preferences' });
  }
};

exports.getPreferences = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await preferenceModel.getByUserId(userId);
    res.json(result || {});
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({ message: 'Error fetching preferences' });
  }
}
