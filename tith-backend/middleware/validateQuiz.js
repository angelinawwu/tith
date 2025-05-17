const Joi = require('joi');

const quizValidationSchema = Joi.object({
  personalInfo: Joi.object({
    firstName: Joi.string().trim(),
    lastName: Joi.string().trim(),
    email: Joi.string().email(),
    phoneNumber: Joi.string(),
  }),

  demographics: Joi.object({
    gender: Joi.string().valid('Nonbinary', 'Trans', 'Female', 'Male', 'Prefer not to answer'),
    ethnicity: Joi.string(),
    householdSize: Joi.string().valid('1', '2', '3', '4+'),
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
    soothingSounds: Joi.array().items(Joi.string()),
    relaxationActivities: Joi.array().items(Joi.string()),
    favoriteMusic: Joi.array().items(Joi.string()),
    favoriteMovie: Joi.string(),
    joySongs: Joi.string(),
  }),

  designElements: Joi.object({
    patternPreference: Joi.string(),
    patternTypes: Joi.array().items(Joi.string()),
    roomWords: Joi.array().items(Joi.string()),
  }),

  additionalNotes: Joi.string().allow(''),
}).options({ stripUnknown: true });

const validateQuiz = (req, res, next) => {
  const { error, value } = quizValidationSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      message: 'Invalid quiz submission',
      details: error.details.map(detail => detail.message)
    });
  }

  // Replace the request body with the validated value
  req.body = value;
  next();
};

module.exports = validateQuiz; 