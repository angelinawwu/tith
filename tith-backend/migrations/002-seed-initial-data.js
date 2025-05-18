const mongoose = require('mongoose');
const StyleQuiz = require('../models/StyleQuiz');

exports.up = async function(next) {
    try {
        // Sample style quiz data
        const sampleQuizzes = [
            {
                userId: 'sample-user-1',
                responses: {
                    preferredRooms: [{
                        imageId: 'sample-room-1',
                        description: 'Modern minimalist living room',
                        selected: true
                    }],
                    textures: ['smooth', 'natural'],
                    safetyFactors: ['lighting', 'space'],
                    culturalPreferences: ['minimalist', 'modern'],
                    accessibilityNeeds: ['open-space']
                },
                summary: 'Prefers modern, minimalist spaces with natural textures and good lighting',
                vectorId: 'sample-vector-1'
            },
            {
                userId: 'sample-user-2',
                responses: {
                    preferredRooms: [{
                        imageId: 'sample-room-2',
                        description: 'Cozy traditional living room',
                        selected: true
                    }],
                    textures: ['soft', 'textured'],
                    safetyFactors: ['furniture', 'colors'],
                    culturalPreferences: ['traditional', 'warm'],
                    accessibilityNeeds: ['comfortable-seating']
                },
                summary: 'Prefers traditional, cozy spaces with soft textures and warm colors',
                vectorId: 'sample-vector-2'
            }
        ];

        // Insert sample data
        await StyleQuiz.insertMany(sampleQuizzes);
        next();
    } catch (error) {
        next(error);
    }
};

exports.down = async function(next) {
    try {
        // Remove sample data
        await StyleQuiz.deleteMany({
            userId: { $in: ['sample-user-1', 'sample-user-2'] }
        });
        next();
    } catch (error) {
        next(error);
    }
}; 