const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// user schema

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  // Additional user fields
});

// quiz response schema

module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');

const quizResponseSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  answers: [String],
  // Additional fields as needed
});







module.exports = mongoose.model('QuizResponse', quizResponseSchema);

function getDesignPreferences(answers) {
    // Example logic
    if (answers.includes('minimalist')) {
      return {
        colorPalette: ['#FFFFFF', '#000000'],
        furnitureStyle: 'Modern',
      };
    }
    // Add more conditions as needed
  }
  

