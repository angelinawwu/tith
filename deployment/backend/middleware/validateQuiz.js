const Joi = require('joi');

const quizValidationSchema = Joi.object({
  personalInfo: Joi.object({
    firstName: Joi.string().trim(),
    lastName: Joi.string().trim(),
    email: Joi.string().email(),
    phoneNumber: Joi.array().items(Joi.number()),
  }),

  demographics: Joi.object({
    gender: Joi.array().items(Joi.string()),
    ethnicity: Joi.array().items(Joi.string()),
    householdSize: Joi.string(),
    fosterCare: Joi.boolean(),
    disability: Joi.boolean(),
    disabilityDetails: Joi.string().allow(''),
  }),

  stylePreferences: Joi.object({
    homeMessage: Joi.array().items(Joi.string()),
    favoriteColors: Joi.array().items(Joi.string()),
    styleInWords: Joi.string(),
    styleAdmired: Joi.string(),
  }),

  comfortFactors: Joi.object({
    peacePlace: Joi.string(),
    peaceScent: Joi.array().items(Joi.string()),
    fabrics: Joi.array().items(Joi.string()),
    calmColors: Joi.array().items(Joi.string()),
  }),

  environmentalPreferences: Joi.object({
    artTypes: Joi.array().items(Joi.string()),
    allergies: Joi.boolean(),
    allergyDetails: Joi.string().allow(''),
    pets: Joi.boolean(),
    petDetails: Joi.string().allow(''),
  }),

  personalInterests: Joi.object({
    roomWords: Joi.array().items(Joi.string()),
  }),

  designElements: Joi.object({
    patternPreference: Joi.string(),
    patternTypes: Joi.array().items(Joi.string()),
    roomWords: Joi.array().items(Joi.string()),
  }),

  generatedPreferences: Joi.object({
    colorPalette: Joi.array().items(Joi.array().items(Joi.number())),
    moodboardImageUrl: Joi.string().allow(''),
    suggestedFurniture: Joi.array().items(Joi.object({
      name: Joi.string(),
      style: Joi.string(),
      image: Joi.string(),
    })),
  }),

  additionalNotes: Joi.string().allow(''),
}).options({ stripUnknown: true });

const validateQuiz = (req, res, next) => {
  console.log('Validating request body:', JSON.stringify(req.body, null, 2));
  
  const { error, value } = quizValidationSchema.validate(req.body);
  
  if (error) {
    console.error('Validation error details:', error.details);
    console.error('Validation error message:', error.message);
    return res.status(400).json({
      message: 'Invalid quiz submission',
      details: error.details.map(detail => ({
        message: detail.message,
        path: detail.path,
        type: detail.type
      }))
    });
  }

  // Replace the request body with the validated value
  req.body = value;
  next();
};

module.exports = validateQuiz; 