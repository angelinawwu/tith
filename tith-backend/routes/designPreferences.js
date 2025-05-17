const express = require('express');
const router = express.Router();
const DesignPreferences = require('../models/DesignPreferences');

// Get design preferences for a user
router.get('/:userId', async (req, res) => {
  try {
    const preferences = await DesignPreferences.findOne({ userId: req.params.userId });
    if (!preferences) {
      return res.status(404).json({ message: 'Design preferences not found' });
    }
    res.json(preferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create or update design preferences
router.post('/', async (req, res) => {
  try {
    const { userId, quizAnswers, colorPalette, moodboardImageUrl, suggestedFurniture } = req.body;
    
    let preferences = await DesignPreferences.findOne({ userId });
    
    if (preferences) {
      // Update existing preferences
      preferences.quizAnswers = quizAnswers || preferences.quizAnswers;
      preferences.colorPalette = colorPalette || preferences.colorPalette;
      preferences.moodboardImageUrl = moodboardImageUrl || preferences.moodboardImageUrl;
      preferences.suggestedFurniture = suggestedFurniture || preferences.suggestedFurniture;
      
      await preferences.save();
    } else {
      // Create new preferences
      preferences = new DesignPreferences({
        userId,
        quizAnswers,
        colorPalette,
        moodboardImageUrl,
        suggestedFurniture
      });
      await preferences.save();
    }
    
    res.status(201).json(preferences);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete design preferences
router.delete('/:userId', async (req, res) => {
  try {
    const preferences = await DesignPreferences.findOneAndDelete({ userId: req.params.userId });
    if (!preferences) {
      return res.status(404).json({ message: 'Design preferences not found' });
    }
    res.json({ message: 'Design preferences deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 