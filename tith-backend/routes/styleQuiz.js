const express = require('express');
const router = express.Router();
const vectorDB = require('../services/vectorDB');
const StyleQuiz = require('../models/StyleQuiz');

// Submit style quiz responses
router.post('/submit', async (req, res) => {
    try {
        const { userId, responses } = req.body;
        
        console.log('Received quiz submission:', { userId, responses });
        
        // Commented out validation for development/testing
        // if (!userId || !responses) {
        //     console.error('Missing required fields:', { userId, responses });
        //     return res.status(400).json({ 
        //         error: 'Missing required fields: userId and responses' 
        //     });
        // }

        // Log what will be saved to MongoDB
        console.log('About to save to MongoDB:', { userId, responses });
        // Save the exact responses object from the frontend
        const styleQuiz = new StyleQuiz({
            userId,
            responses, // Save the raw responses object as received
            summary: 'Pending AI analysis',
            vectorId: `temp_${Date.now()}`
        });
        const savedQuiz = await styleQuiz.save();
        console.log('Saved quiz to MongoDB:', savedQuiz._id);

        // Then process with vector DB
        try {
            const result = await vectorDB.processStyleQuiz(userId, responses);
            
            // Update the saved quiz with the vector ID and summary
            savedQuiz.vectorId = result.vectorId;
            savedQuiz.summary = result.summary;
            await savedQuiz.save();
            
            console.log('Updated quiz with vector data:', savedQuiz._id);
            
            res.json({
                success: true,
                quizId: savedQuiz._id,
                vectorId: result.vectorId,
                summary: result.summary
            });
        } catch (vectorError) {
            console.error('Error processing with vector DB:', vectorError);
            // Even if vector processing fails, we still have the basic quiz data
            res.json({
                success: true,
                quizId: savedQuiz._id,
                warning: 'Vector processing failed, but quiz was saved'
            });
        }
    } catch (error) {
        console.error('Error submitting style quiz:', error);
        res.status(500).json({ 
            error: 'Error processing style quiz',
            details: error.message
        });
    }
});

// Get personalized recommendations
router.get('/recommendations/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { limit } = req.query;
        
        console.log('Fetching recommendations for user:', userId);
        
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
        res.status(500).json({ 
            error: 'Error getting recommendations',
            details: error.message
        });
    }
});

module.exports = router; 