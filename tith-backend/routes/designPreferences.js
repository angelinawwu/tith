const express = require('express');
const router = express.Router();
const DesignPreferences = require('../models/DesignPreferences');
const validateQuiz = require('../middleware/validateQuiz');

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

// Save partial or complete quiz submission
router.post('/:userId', validateQuiz, async (req, res) => {
  try {
    const userId = req.params.userId;
    const isComplete = req.query.complete === 'true';
    
    let preferences = await DesignPreferences.findOne({ userId });
    
    if (preferences) {
      // Update existing preferences
      Object.assign(preferences, {
        ...preferences.toObject(),
        ...req.body,
        status: isComplete ? 'completed' : 'draft'
      });
    } else {
      // Create new preferences
      preferences = new DesignPreferences({
        userId,
        ...req.body,
        status: isComplete ? 'completed' : 'draft'
      });
    }

    await preferences.save();
    res.status(201).json(preferences);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update specific section of preferences
router.patch('/:userId/:section', async (req, res) => {
  try {
    const { userId, section } = req.params;
    const update = { [section]: req.body };
    
    const preferences = await DesignPreferences.findOneAndUpdate(
      { userId },
      { $set: update },
      { new: true, upsert: true }
    );

    res.json(preferences);
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