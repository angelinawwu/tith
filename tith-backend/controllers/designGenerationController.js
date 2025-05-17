const VectorDBFactory = require('../services/vectorDBFactory');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const mongoose = require('mongoose');
require('dotenv').config();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-pro',
  generationConfig: {
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 2048,
  },
});

// Initialize VectorDB service
const vectorDB = VectorDBFactory.createService();

// Design Schema for MongoDB
const designSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  description: { type: String, required: true },
  inspirationImages: [{ type: String }],
  stylePreferences: { type: Object },
  vector: { type: [Number], required: true },
  createdAt: { type: Date, default: Date.now }
});

const Design = mongoose.models.Design || mongoose.model('Design', designSchema);

/**
 * Generate design based on inspiration images and style preferences
 */
const generateDesign = async (req, res) => {
  try {
    const { userId, inspirationImages = [], stylePreferences = {} } = req.body;
    
    if (!vectorDB) {
      return res.status(503).json({ error: 'Vector database service is not available' });
    }

    // Process inspiration images
    const imageAnalyses = [];
    for (const image of inspirationImages) {
      try {
        // Convert base64 string to buffer
        const imageBuffer = Buffer.from(image.split(',')[1], 'base64');
        const analysis = await vectorDB.processAndStoreImage(imageBuffer, { 
          type: 'inspiration', 
          userId,
          stylePreferences
        });
        imageAnalyses.push(analysis);
      } catch (error) {
        console.error('Error processing image:', error);
        // Continue with other images if one fails
      }
    }


    // Create a prompt for design generation
    const prompt = `You are an expert interior designer. Create a detailed interior design based on the following inspiration and preferences:

${imageAnalyses.length > 0 ? '## Inspiration Images Analysis\n' + 
  imageAnalyses.map((img, i) => `Image ${i + 1}:\n${img.description}`).join('\n\n') : ''}

## Style Preferences
${Object.entries(stylePreferences).map(([key, value]) => 
  `- ${key}: ${Array.isArray(value) ? value.join(', ') : value}`
).join('\n')}

Please provide a comprehensive design that includes:
1. A detailed description of the overall aesthetic and mood
2. Specific furniture recommendations with placement
3. Color palette and material selections
4. Lighting plan
5. Decorative elements and accessories
6. Any special considerations based on the provided preferences`;

    // Generate design description
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const designDescription = response.text();

    // Generate vector for the design
    const designVector = await vectorDB.textToVector(designDescription);
    
    // Save the design
    const design = new Design({
      userId,
      description: designDescription,
      inspirationImages: inspirationImages,
      stylePreferences,
      vector: designVector
    });
    
    await design.save();
    
    // Store in vector database for similarity search
    await vectorDB.storeVector(
      design._id.toString(),
      designVector,
      {
        type: 'design',
        userId,
        description: designDescription,
        stylePreferences,
        createdAt: new Date().toISOString()
      }
    );

    res.json({
      success: true,
      design: {
        id: design._id,
        description: designDescription,
        inspirationAnalyses: imageAnalyses,
        stylePreferences,
        createdAt: design.createdAt
      }
    });

  } catch (error) {
    console.error('Error in design generation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate design',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get design recommendations based on a design
 */
const getDesignRecommendations = async (req, res) => {
  try {
    const { designId } = req.params;
    const { limit = 5 } = req.query;
    
    if (!vectorDB) {
      return res.status(503).json({ error: 'Vector database service is not available' });
    }
    
    // Get the design
    const design = await Design.findById(designId);
    if (!design) {
      return res.status(404).json({ error: 'Design not found' });
    }
    
    // Find similar designs
    const similarDesigns = await vectorDB.querySimilarVectors(
      design.vector,
      parseInt(limit) + 1 // +1 to account for the query design itself
    );
    
    // Filter out the query design and format results
    const recommendations = similarDesigns
      .filter(item => item.id !== design._id.toString())
      .map(item => ({
        id: item.id,
        score: item.score,
        description: item.metadata.description,
        stylePreferences: item.metadata.stylePreferences
      }));
    
    res.json({
      success: true,
      recommendations
    });
    
  } catch (error) {
    console.error('Error getting design recommendations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get design recommendations'
    });
  }
};

module.exports = {
  generateDesign,
  getDesignRecommendations
};
