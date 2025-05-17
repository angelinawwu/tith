const mongoose = require('mongoose');

exports.up = function(next) {
    const styleQuizSchema = new mongoose.Schema({
        userId: {
            type: String,
            required: true,
            index: true // Add index for faster queries
        },
        responses: {
            preferredRooms: [{
                imageId: String,
                description: String,
                selected: Boolean
            }],
            textures: [{
                type: String,
                enum: ['soft', 'rough', 'smooth', 'textured', 'natural', 'synthetic']
            }],
            safetyFactors: [{
                type: String,
                enum: ['lighting', 'space', 'furniture', 'colors', 'textures', 'layout']
            }],
            culturalPreferences: [{
                type: String
            }],
            accessibilityNeeds: [{
                type: String
            }]
        },
        summary: {
            type: String,
            required: true
        },
        vectorId: {
            type: String,
            required: true,
            index: true // Add index for faster queries
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    });

    // Create indexes
    styleQuizSchema.index({ createdAt: -1 });
    styleQuizSchema.index({ updatedAt: -1 });

    // Create the collection
    mongoose.connection.db.createCollection('stylequizzes', (err) => {
        if (err) {
            return next(err);
        }
        next();
    });
};

exports.down = function(next) {
    mongoose.connection.db.dropCollection('stylequizzes', (err) => {
        if (err) {
            return next(err);
        }
        next();
    });
}; 