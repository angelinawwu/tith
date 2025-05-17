require('dotenv').config();
const { Pinecone } = require('@pinecone-database/pinecone');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const VectorDBService = require('../services/vectorDB');

async function initializeVectorDB() {
    try {
        // Initialize Pinecone
        const pinecone = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY,
            environment: process.env.PINECONE_ENVIRONMENT
        });
        
        // Initialize Google's Generative AI
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const visionModel = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
        
        // Get Pinecone index
        const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);
        
        // Initialize VectorDBService
        const vectorDB = new VectorDBService(model, visionModel, index);
        
        console.log('Loading vectors from CSV into Pinecone...');
        const count = await vectorDB.loadVectorsFromCSV();
        console.log(`Successfully loaded ${count} vectors into Pinecone`);
        
        // Example query to verify the data was loaded
        console.log('Verifying data by querying similar vectors...');
        const testVector = Array(512).fill(0.1); // Using a simple test vector
        const results = await vectorDB.querySimilarVectors(testVector, 3);
        console.log('Sample query results:', results);
        
        return { success: true, count };
    } catch (error) {
        console.error('Error initializing vector database:', error);
        throw error;
    }
}

// Run the initialization
if (require.main === module) {
    initializeVectorDB()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error('Initialization failed:', error);
            process.exit(1);
        });
}

module.exports = { initializeVectorDB };
