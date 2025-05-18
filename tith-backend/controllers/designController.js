const { GoogleGenerativeAI } = require('@google/generative-ai');
const VectorDBFactory = require('../services/vectorDBFactory');
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
  preferences: { type: Object, required: true },
  vector: { type: [Number], required: true },
  createdAt: { type: Date, default: Date.now }
});

const Design = mongoose.models.Design || mongoose.model('Design', designSchema);

/**
 * Helper function to extract values from responses
 */
const extractValue = (value) => {
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  return value || 'not specified';
};

/**
 * Generate interior design based on quiz responses
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const generateDesign = async (req, res) => {
  try {
    console.log('Received design generation request with body:', req.body);
    const { responses } = req.body;
    
    if (!responses) {
      console.error('No responses provided in request');
      return res.status(400).json({
        success: false,
        error: 'No responses provided'
      });
    }

    // Extract relevant design preferences from responses
    const designPreferences = {
      style: responses.stylePreference || 'modern',
      colorScheme: responses.colorScheme || 'neutral',
      roomType: responses.roomType || 'living room',
      budget: responses.budget || 'medium',
      additionalNotes: responses.additionalNotes || '',
      householdSize: responses.demographics?.householdSize,
      accessibilityNeeds: responses.accessibilityNeeds || 'none specified',
      culturalElements: responses.culturalElements || 'none specified'
    };

    console.log('Generating design with preferences:', designPreferences);
    
    // Create a detailed prompt for the AI
    const prompt = `You are an expert interior designer. Create a detailed interior design concept based on the following preferences:

Room Type: ${designPreferences.roomType}
Style: ${designPreferences.style}
Color Scheme: ${designPreferences.colorScheme}
Budget: ${designPreferences.budget}
Household Size: ${designPreferences.householdSize || 'not specified'}
Accessibility Needs: ${designPreferences.accessibilityNeeds}
Cultural Elements: ${designPreferences.culturalElements}
Additional Notes: ${designPreferences.additionalNotes || 'none'}

Please provide a comprehensive design that includes:
1. A detailed description of the overall aesthetic and mood
2. Specific furniture recommendations with placement
3. Color palette and material selections
4. Lighting plan
5. Decorative elements and accessories
6. Any special considerations based on the provided preferences

Format your response in clear, well-structured paragraphs.`;

    // Generate design description using Gemini with retry mechanism
    console.log('Sending prompt to Gemini API');
    
    const maxRetries = 3;
    let lastError;
    let response;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await model.generateContent(prompt);
        response = await result.response;
        break; // If successful, exit the retry loop
      } catch (error) {
        lastError = error;
        if (error.status === 429 && attempt < maxRetries) {
          // Extract retry delay from error or use default
          const retryAfter = error.errorDetails?.find(d => d['@type'] === 'type.googleapis.com/google.rpc.RetryInfo')?.retryDelay || '5s';
          const delayMs = parseInt(retryAfter) * 1000 || 5000; // Default to 5 seconds if parsing fails
          
          console.log(`Rate limited. Retrying in ${delayMs/1000} seconds (attempt ${attempt + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
          continue;
        }
        throw error; // Re-throw if not a rate limit error or out of retries
      }
    }
    
    if (lastError) {
      throw lastError; // If we've exhausted retries, throw the last error
    }
    
    if (!response) {
      console.error('No response received from Gemini API');
      throw new Error('No response from AI service');
    }
    
    // Generate vector embedding for the design
    if (vectorDB) {
      try {
        const designText = response.text();
        const vector = await vectorDB.textToVector(designText);
        
        // Store the design and its vector
        const design = new Design({
          userId: req.user?.id || 'anonymous',
          preferences: req.body,
          vector: vector
        });
        
        await design.save();
        
        // Also store in Pinecone for similarity search
        await vectorDB.upsertVectors([{
          id: design._id.toString(),
          values: vector,
          metadata: {
            userId: design.userId,
            createdAt: design.createdAt
          }
        }]);
        
        console.log('Design saved to vector database');
      } catch (error) {
        console.error('Error saving design to vector database:', error);
        // Don't fail the request if vector DB save fails
      }
    }
    
    const designDescription = response.text();
    console.log('Received design description from Gemini API');

    console.log('Design generation successful');
    
    // In a real implementation, you would generate an image here
    // For example, using DALL-E, Stable Diffusion, or another image generation API
    // const designImage = await generateDesignImage(designDescription);

    // Save the design to the database (optional)
    // await saveDesignToDatabase(designDescription, designPreferences, userId);

    res.json({
      success: true,
      design: {
        description: designDescription,
        // imageUrl: designImage?.url,
        preferences: designPreferences,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error generating design:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate design',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get design recommendations based on user preferences
 */
const getDesignRecommendations = async (req, res) => {
  try {
    if (!vectorDB) {
      return res.status(503).json({ error: 'Vector database service is not available' });
    }
    
    const userId = req.user?.id || 'anonymous';
    const limit = parseInt(req.query.limit) || 5;
    
    // Get user's recent designs
    const userDesigns = await Design.find({ userId })
      .sort({ createdAt: -1 })
      .limit(1);
    
    if (userDesigns.length === 0) {
      return res.status(404).json({ error: 'No design history found' });
    }
    
    // Search for similar designs
    const queryVector = userDesigns[0].vector;
    const similarDesigns = await vectorDB.similaritySearch(queryVector, { 
      filter: { userId: { $ne: userId } }, // Don't return user's own designs
      topK: limit,
      includeMetadata: true
    });
    
    res.json({
      recommendations: similarDesigns.map(d => ({
        id: d.id,
        score: d.score,
        preferences: d.metadata.preferences
      }))
    });
    
  } catch (error) {
    console.error('Error getting design recommendations:', error);
    res.status(500).json({ error: 'Failed to get design recommendations' });
  }
};

module.exports = {
  generateDesign,
  getDesignRecommendations
};
