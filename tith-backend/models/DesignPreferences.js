const mongoose = require("mongoose");

const designPreferencesSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  status: {
    type: String,
    enum: ['draft', 'completed'],
    default: 'draft'
  },
  personalInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: String,
  },
  demographics: {
    gender: String,
    ethnicity: String,
    householdSize: String,
    fosterCare: Boolean,
    disability: Boolean,
    disabilityDetails: String,
  },
  stylePreferences: {
    homeMessage: [String],
    favoriteColors: [String],
    styleInWords: String,
    styleAdmired: String,
  },
  comfortFactors: {
    peacePlace: String,
    peaceScent: [String],
    fabrics: [String],
    calmColors: [String],
  },
  environmentalPreferences: {
    artTypes: [String],
    allergies: Boolean,
    allergyDetails: String,
    pets: Boolean,
    petDetails: String,
  },
  personalInterests: {
    soothingSounds: [String],
    relaxationActivities: [String],
    favoriteMusic: [String],
    favoriteMovie: String,
    joySongs: String,
  },
  designElements: {
    patternPreference: String,
    patternTypes: [String],
    roomWords: [String],
  },
  generatedPreferences: {
    colorPalette: [[Number]], // e.g., [[255, 255, 255], [0, 0, 0]]
    moodboardImageUrl: String,
    suggestedFurniture: [{
      name: String,
      style: String,
      image: String,
    }],
  },
  additionalNotes: String,
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  }
});

// Update the lastUpdated timestamp before saving
designPreferencesSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model("DesignPreferences", designPreferencesSchema); 