const express = require('express');
const router = express.Router();
const { Pinecone } = require('@pinecone-database/pinecone');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const VectorDBService = require('../services/vectorDB');

// Initialize services
const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
const visionModel = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);
const vectorDB = new VectorDBService(model, visionModel, index);

// Get similar items by vector
router.post('/similar', async (req, res) => {
    try {
        const { vector, limit = 5 } = req.body;
        
        if (!vector || !Array.isArray(vector)) {
            return res.status(400).json({ error: 'Vector array is required' });
        }
        
        const results = await vectorDB.querySimilarVectors(vector, limit);
        res.json(results);
    } catch (error) {
        console.error('Error finding similar vectors:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get similar items by text query
router.post('/similar/text', async (req, res) => {
    try {
        const { text, limit = 5 } = req.body;
        
        if (!text) {
            return res.status(400).json({ error: 'Text query is required' });
        }
        
        // Convert text to vector
        const vector = await vectorDB.textToVector(text);
        
        // Find similar vectors
        const results = await vectorDB.querySimilarVectors(vector, limit);
        res.json(results);
    } catch (error) {
        console.error('Error finding similar items by text:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get similar items by image
router.post('/similar/image', async (req, res) => {
    try {
        if (!req.files || !req.files.image) {
            return res.status(400).json({ error: 'Image file is required' });
        }
        
        const imageBuffer = req.files.image.data;
        
        // Process image and get its vector
        const { id, vector } = await vectorDB.processAndStoreImage(imageBuffer);
        
        // Find similar vectors
        const results = await vectorDB.querySimilarVectors(vector, 5);
        
        res.json({
            imageId: id,
            similarItems: results
        });
    } catch (error) {
        console.error('Error finding similar items by image:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
