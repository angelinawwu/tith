const express = require('express');
const router = express.Router();
const vectorDB = require('../services/vectorDB');

// Submit style quiz responses
router.post('/submit', async (req, res) => {
    try {
        const { userId, responses } = req.body;
        
        if (!userId || !responses) {
            return res.status(400).json({ 
                error: 'Missing required fields: userId and responses' 
            });
        }

        const result = await vectorDB.processStyleQuiz(userId, responses);
        
        res.json({
            success: true,
            vectorId: result.vectorId,
            summary: result.summary
        });
    } catch (error) {
        console.error('Error submitting style quiz:', error);
        res.status(500).json({ error: 'Error processing style quiz' });
    }
});

// Get personalized recommendations
router.get('/recommendations/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { limit } = req.query;
        
        const recommendations = await vectorDB.getPersonalizedRecommendations(
            userId,
            limit ? parseInt(limit) : 5
        );
        
        res.json({
            success: true,
            ...recommendations
        });
    } catch (error) {
        console.error('Error getting recommendations:', error);
        res.status(500).json({ error: 'Error getting recommendations' });
    }
});

module.exports = router; 