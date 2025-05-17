const { Pinecone } = require('@pinecone-database/pinecone');
const OpenAI = require('openai');
const StyleQuiz = require('../models/StyleQuiz');
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
                            { 
                                type: "text", 
                                text: "Describe this interior design image in detail. Focus on:\n" +
                                      "1. Mood and atmosphere\n" +
                                      "2. Color palette\n" +
                                      "3. Textures and materials\n" +
                                      "4. Cultural elements\n" +
                                      "5. Accessibility features\n" +
                                      "6. Furniture and layout\n" +
                                      "Format the response as a JSON object with 'description' and 'tags' fields."
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:image/jpeg;base64,${imageBuffer.toString('base64')}`
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 500
            });
            
            // Parse the JSON response
            const content = response.choices[0].message.content;
            return JSON.parse(content);
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
            const analysis = await this.imageToText(imageBuffer);
            
            // Convert text to vector
            const vector = await this.textToVector(analysis.description);
            
            // Generate a unique ID
            const id = `img_${Date.now()}`;
            
            // Store vector with metadata
            await this.storeVector(id, vector, {
                ...metadata,
                description: analysis.description,
                tags: analysis.tags
            });
            
            return { id, ...analysis };
        } catch (error) {
            console.error('Error processing and storing image:', error);
            throw error;
        }
    }

    // Generate style summary from quiz responses
    async generateStyleSummary(quizResponses) {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are an interior design expert. Create a natural language summary of the user's style preferences based on their quiz responses."
                    },
                    {
                        role: "user",
                        content: JSON.stringify(quizResponses)
                    }
                ],
                max_tokens: 300
            });
            
            return response.choices[0].message.content;
        } catch (error) {
            console.error('Error generating style summary:', error);
            throw error;
        }
    }

    // Process style quiz and store preferences
    async processStyleQuiz(userId, quizResponses) {
        try {
            // Generate style summary
            const summary = await this.generateStyleSummary(quizResponses);
            
            // Convert summary to vector
            const vector = await this.textToVector(summary);
            
            // Generate vector ID
            const vectorId = `style_${userId}_${Date.now()}`;
            
            // Store vector in Pinecone
            await this.storeVector(vectorId, vector, {
                type: 'style_preference',
                userId: userId,
                summary: summary
            });
            
            // Store quiz in MongoDB
            const styleQuiz = new StyleQuiz({
                userId,
                responses: quizResponses,
                summary,
                vectorId
            });
            
            await styleQuiz.save();
            
            return {
                vectorId,
                summary
            };
        } catch (error) {
            console.error('Error processing style quiz:', error);
            throw error;
        }
    }

    // Get personalized recommendations based on style preferences
    async getPersonalizedRecommendations(userId, limit = 5) {
        try {
            // Get user's latest style quiz
            const latestQuiz = await StyleQuiz.findOne({ userId })
                .sort({ createdAt: -1 });
            
            if (!latestQuiz) {
                throw new Error('No style preferences found for user');
            }
            
            // Query similar vectors
            const recommendations = await this.querySimilarVectors(
                await this.textToVector(latestQuiz.summary),
                limit
            );
            
            return {
                userSummary: latestQuiz.summary,
                recommendations
            };
        } catch (error) {
            console.error('Error getting personalized recommendations:', error);
            throw error;
        }
    }
}

module.exports = new VectorDBService(); 