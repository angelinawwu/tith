const mongoose = require("mongoose");

const designPreferencesSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  quizAnswers: [String], // e.g., ['minimalist', 'warm colors', ...]
  colorPalette: [[Number]], // e.g., [[255, 255, 255], [0, 0, 0]]
  moodboardImageUrl: String, // saved file path or URL to moodboard image
  suggestedFurniture: [
    {
      name: String,
      style: String,
      image: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("DesignPreferences", designPreferencesSchema); 