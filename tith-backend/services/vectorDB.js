const { Pinecone } = require('@pinecone-database/pinecone');
const OpenAI = require('openai');
require('dotenv').config();

// Initialize Pinecone
const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT
});

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);

class VectorDBService {
    // Convert image to text description using OpenAI Vision
    async imageToText(imageBuffer) {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4-vision-preview",
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: "Describe this image in detail, focusing on its key visual elements and characteristics." },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:image/jpeg;base64,${imageBuffer.toString('base64')}`
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 300
            });
            return response.choices[0].message.content;
        } catch (error) {
            console.error('Error in image to text conversion:', error);
            throw error;
        }
    }

    // Convert text to vector using OpenAI embeddings
    async textToVector(text) {
        try {
            const response = await openai.embeddings.create({
                model: "text-embedding-3-small",
                input: text,
                encoding_format: "float"
            });
            return response.data[0].embedding;
        } catch (error) {
            console.error('Error in text to vector conversion:', error);
            throw error;
        }
    }

    // Store vector in Pinecone
    async storeVector(id, vector, metadata = {}) {
        try {
            await index.upsert([{
                id: id,
                values: vector,
                metadata: metadata
            }]);
        } catch (error) {
            console.error('Error storing vector:', error);
            throw error;
        }
    }

    // Query similar vectors
    async querySimilarVectors(vector, topK = 5) {
        try {
            const queryResponse = await index.query({
                vector: vector,
                topK: topK,
                includeMetadata: true
            });
            return queryResponse.matches;
        } catch (error) {
            console.error('Error querying similar vectors:', error);
            throw error;
        }
    }

    // Process image and store its vector
    async processAndStoreImage(imageBuffer, metadata = {}) {
        try {
            // Convert image to text
            const description = await this.imageToText(imageBuffer);
            
            // Convert text to vector
            const vector = await this.textToVector(description);
            
            // Generate a unique ID
            const id = `img_${Date.now()}`;
            
            // Store vector with metadata
            await this.storeVector(id, vector, {
                ...metadata,
                description: description
            });
            
            return { id, description };
        } catch (error) {
            console.error('Error processing and storing image:', error);
            throw error;
        }
    }
}

module.exports = new VectorDBService(); 