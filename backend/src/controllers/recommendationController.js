const recommendationService = require('../services/recommendationService');

exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user ? req.user.userId : null; // extracted from auth middleware if present
    const limit = parseInt(req.query.limit) || 4;
    const lang = req.query.lang || 'en';

    // Parse criteria from query if available (for anonymous/direct search)
    let criteria = null;
    if (req.query.criteria) {
      try {
        criteria = JSON.parse(req.query.criteria);
      } catch (e) {
        console.error("Invalid criteria format", e);
      }
    }

    const recommendations = await recommendationService.getRecommendations(userId, limit, lang, criteria);

    res.json(recommendations);
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ message: 'Error fetching recommendations' });
  }
};

exports.saveSurvey = async (req, res) => {
  try {
    const userId = req.user ? req.user.userId : null;
    const surveyData = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized. Please log in to save survey.' });
    }

    if (!surveyData) {
      return res.status(400).json({ message: 'Missing survey data' });
    }

    const preferences = await recommendationService.savePreferences(userId, surveyData);
    res.json({ message: 'Survey saved successfully', preferences });

  } catch (error) {
    console.error('Save survey error:', error);
    res.status(500).json({ message: 'Error saving survey' });
  }
};
