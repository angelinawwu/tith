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
    console.log('Received quiz submission for userId:', req.params.userId);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const userId = req.params.userId;
    const isComplete = req.query.complete === 'true';
    
    let preferences = await DesignPreferences.findOne({ userId });
    console.log('Existing preferences found:', preferences ? 'Yes' : 'No');
    
    if (preferences) {
      // Update existing preferences
      console.log('Updating existing preferences');
      Object.assign(preferences, {
        ...preferences.toObject(),
        ...req.body,
        status: isComplete ? 'completed' : 'draft'
      });
    } else {
      // Create new preferences
      console.log('Creating new preferences');
      preferences = new DesignPreferences({
        userId,
        ...req.body,
        status: isComplete ? 'completed' : 'draft'
      });
    }

    console.log('Attempting to save preferences:', JSON.stringify(preferences, null, 2));
    
    try {
      await preferences.save();
      console.log('Preferences saved successfully');
      res.status(201).json(preferences);
    } catch (saveError) {
      console.error('Error during save operation:', saveError);
      console.error('Save error details:', {
        name: saveError.name,
        message: saveError.message,
        code: saveError.code,
        errors: saveError.errors
      });
      res.status(400).json({ 
        message: 'Error saving preferences',
        details: saveError.message
      });
    }
  } catch (error) {
    console.error('Error in route handler:', error);
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