const fs = require('fs').promises;
const path = require('path');
const vectorDB = require('../services/vectorDB');
const StyleQuiz = require('../models/StyleQuiz');

async function testSystem() {
    console.log('🧪 Starting system test...\n');

    try {
        // Test 1: Process and store a sample image
        console.log('📸 Test 1: Processing sample image...');
        const sampleImagePath = path.join(__dirname, '../test-images/sample-room.jpg');
        const imageBuffer = await fs.readFile(sampleImagePath);
        
        const imageResult = await vectorDB.processAndStoreImage(imageBuffer, {
            filename: 'sample-room.jpg',
            category: 'living-room',
            style: 'modern'
        });
        
        console.log('✅ Image processed successfully:');
        console.log('Description:', imageResult.description);
        console.log('Tags:', imageResult.tags);
        console.log('Vector ID:', imageResult.id);
        console.log('---\n');

        // Test 2: Submit a style quiz
        console.log('📝 Test 2: Submitting style quiz...');
        const quizResponses = {
            preferredRooms: [
                {
                    imageId: imageResult.id,
                    description: imageResult.description,
                    selected: true
                }
            ],
            textures: ['soft', 'natural'],
            safetyFactors: ['lighting', 'space'],
            culturalPreferences: ['minimalist', 'modern'],
            accessibilityNeeds: ['open-space']
        };

        const quizResult = await vectorDB.processStyleQuiz('test-user-123', quizResponses);
        console.log('✅ Style quiz processed successfully:');
        console.log('Summary:', quizResult.summary);
        console.log('Vector ID:', quizResult.vectorId);
        console.log('---\n');

        // Test 3: Get personalized recommendations
        console.log('🔍 Test 3: Getting personalized recommendations...');
        const recommendations = await vectorDB.getPersonalizedRecommendations('test-user-123', 3);
        
        console.log('✅ Recommendations retrieved successfully:');
        console.log('User Summary:', recommendations.userSummary);
        console.log('\nTop 3 Recommendations:');
        recommendations.recommendations.forEach((rec, index) => {
            console.log(`\n${index + 1}. Match (Score: ${rec.score})`);
            console.log('Metadata:', rec.metadata);
        });
        console.log('---\n');

        // Test 4: Verify MongoDB storage
        console.log('🗄️ Test 4: Verifying MongoDB storage...');
        const storedQuiz = await StyleQuiz.findOne({ userId: 'test-user-123' });
        console.log('✅ MongoDB verification:');
        console.log('Stored Quiz:', {
            userId: storedQuiz.userId,
            summary: storedQuiz.summary,
            vectorId: storedQuiz.vectorId,
            createdAt: storedQuiz.createdAt
        });

        console.log('\n✨ All tests completed successfully!');
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Run the tests
testSystem(); 