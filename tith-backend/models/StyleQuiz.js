const mongoose = require('mongoose');

const styleQuizSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    responses: {
        type: mongoose.Schema.Types.Mixed,
        required: true
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