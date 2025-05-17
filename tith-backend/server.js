const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Set strictQuery to false to remove deprecation warning
mongoose.set('strictQuery', false);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Error handling for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Error handling for unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// MongoDB Connection
console.log('Attempting to connect to MongoDB...');
console.log('MongoDB URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/UserResponses1');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/UserResponses1', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Import routes
const designPreferencesRoutes = require('./routes/designPreferences');
const recommendationsRoutes = require('./routes/recommendations');
const styleQuizRoutes = require('./routes/styleQuiz');
const designController = require('./controllers/designController');
const designGenerationController = require('./controllers/designGenerationController');

// API Routes
app.use('/api/design-preferences', designPreferencesRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/style-quiz', styleQuizRoutes);

// Design generation endpoints
app.post('/api/v1/designs/generate', designGenerationController.generateDesign);
app.get('/api/v1/designs/:designId/recommendations', designGenerationController.getDesignRecommendations);

// Legacy endpoints (to be deprecated)
app.post('/api/generate-design', designController.generateDesign);
app.get('/api/design-recommendations', designController.getDesignRecommendations);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Express error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 