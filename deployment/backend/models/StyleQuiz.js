const mongoose = require('mongoose');

const styleQuizSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
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
        required: true
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

// Update the updatedAt timestamp before saving
styleQuizSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('StyleQuiz', styleQuizSchema); 