const fs = require('fs').promises;
const path = require('path');
const vectorDB = require('../services/vectorDB');

async function testRecommendation(imagePath) {
    try {
        // Read the test image
        const imageBuffer = await fs.readFile(imagePath);
        
        console.log('Testing recommendation system...');
        console.log('1. Converting image to text...');
        const description = await vectorDB.imageToText(imageBuffer);
        console.log('Image description:', description);
        
        console.log('\n2. Converting text to vector...');
        const vector = await vectorDB.textToVector(description);
        console.log('Vector created successfully');
        
        console.log('\n3. Finding similar images...');
        const recommendations = await vectorDB.querySimilarVectors(vector, 3);
        
        console.log('\nTop 3 recommendations:');
        recommendations.forEach((rec, index) => {
            console.log(`\n${index + 1}. Match (Score: ${rec.score})`);
            console.log('Metadata:', rec.metadata);
        });
    } catch (error) {
        console.error('Error testing recommendations:', error);
    }
}

// Usage: node testRecommendations.js <image_path>
const imagePath = process.argv[2];
if (!imagePath) {
    console.error('Please provide an image path');
    process.exit(1);
}

testRecommendation(imagePath); 