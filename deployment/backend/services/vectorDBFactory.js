const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Pinecone } = require('@pinecone-database/pinecone');
require('dotenv').config();

class VectorDBFactory {
    static createService() {
        // Check if required environment variables are present
        if (!process.env.GEMINI_API_KEY || !process.env.PINECONE_API_KEY || !process.env.PINECONE_ENVIRONMENT || !process.env.PINECONE_INDEX_NAME) {
            console.warn('VectorDB service is disabled: Missing required environment variables');
            return null;
        }

        try {
            // Initialize Pinecone
            const pinecone = new Pinecone({
                apiKey: process.env.PINECONE_API_KEY,
                environment: process.env.PINECONE_ENVIRONMENT
            });

            // Initialize Gemini
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const visionModel = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

            const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);

            // Import and return the service
            const VectorDBService = require('./vectorDB');
            return new VectorDBService(model, visionModel, index);
        } catch (error) {
            console.error('Failed to initialize VectorDB service:', error);
            return null;
        }
    }
}

module.exports = VectorDBFactory;
