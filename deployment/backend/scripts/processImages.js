const fs = require('fs').promises;
const path = require('path');
const vectorDB = require('../services/vectorDB');

async function processImageDirectory(directoryPath) {
    try {
        // Read all files in the directory
        const files = await fs.readdir(directoryPath);
        
        // Filter for image files
        const imageFiles = files.filter(file => 
            /\.(jpg|jpeg|png|gif)$/i.test(file)
        );

        console.log(`Found ${imageFiles.length} images to process`);

        // Process each image
        for (const file of imageFiles) {
            try {
                const filePath = path.join(directoryPath, file);
                const imageBuffer = await fs.readFile(filePath);
                
                console.log(`Processing ${file}...`);
                
                const result = await vectorDB.processAndStoreImage(imageBuffer, {
                    filename: file,
                    originalPath: filePath,
                    processedAt: new Date().toISOString()
                });

                console.log(`Successfully processed ${file}`);
                console.log(`Description: ${result.description}`);
                console.log(`Vector ID: ${result.id}`);
                console.log('---');
            } catch (error) {
                console.error(`Error processing ${file}:`, error);
            }
        }
    } catch (error) {
        console.error('Error processing directory:', error);
    }
}

// Usage: node processImages.js <directory_path>
const directoryPath = process.argv[2];
if (!directoryPath) {
    console.error('Please provide a directory path');
    process.exit(1);
}

processImageDirectory(directoryPath); 