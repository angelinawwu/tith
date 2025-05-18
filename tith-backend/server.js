const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Set strictQuery to false to remove deprecation warning
mongoose.set('strictQuery', false);

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:5174', 'http://localhost:5175'],
    credentials: true
}));
app.use(express.json());

// MongoDB Connection Options
const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    family: 4 // Use IPv4, skip trying IPv6
};

// MongoDB Connection with Retry Logic
const connectWithRetry = async () => {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tith';
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', mongoURI);

    try {
        await mongoose.connect(mongoURI, mongoOptions);
        console.log('MongoDB connected successfully');

        // Set up connection event handlers
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected. Attempting to reconnect...');
            setTimeout(connectWithRetry, 5000);
        });

        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected');
        });

    } catch (err) {
        console.error('MongoDB connection error:', err);
        console.log('Retrying connection in 5 seconds...');
        setTimeout(connectWithRetry, 5000);
    }
};

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

// Initialize MongoDB connection
connectWithRetry();

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

// Health check endpoint
app.get('/health', (req, res) => {
    const health = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    };
    res.status(200).json(health);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 