const express = require('express');
const router = express.Router();
const multer = require('multer');
const vectorDB = require('../services/vectorDB');

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Route to process and store an image
router.post('/process-image', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const result = await vectorDB.processAndStoreImage(req.file.buffer, {
            filename: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            // Add any additional metadata you want to store
            userId: req.body.userId,
            timestamp: new Date().toISOString()
        });

        res.json({
            success: true,
            id: result.id,
            description: result.description
        });
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ error: 'Error processing image' });
    }
});

// Route to get recommendations based on an image
router.post('/get-recommendations', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        // Convert image to text
        const description = await vectorDB.imageToText(req.file.buffer);
        
        // Convert text to vector
        const vector = await vectorDB.textToVector(description);
        
        // Query similar vectors
        const recommendations = await vectorDB.querySimilarVectors(vector, 5);

        res.json({
            success: true,
            queryDescription: description,
            recommendations: recommendations
        });
    } catch (error) {
        console.error('Error getting recommendations:', error);
        res.status(500).json({ error: 'Error getting recommendations' });
    }
});

module.exports = router; 