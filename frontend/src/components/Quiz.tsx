import React, { useState } from 'react';
import './Quiz.css';

interface QuizResponse {
  stylePreference: number | null;
  texturePreference: number | null;
}

const Quiz: React.FC = () => {
  const [responses, setResponses] = useState<QuizResponse>({
    stylePreference: null,
    texturePreference: null,
  });
  const [submitted, setSubmitted] = useState(false);

  // Handle style preference selection
  const handleStyleSelect = (styleId: number) => {
    setResponses((prev) => ({ ...prev, stylePreference: styleId }));
  };

  // Handle texture preference selection
  const handleTextureSelect = (textureId: number) => {
    setResponses((prev) => ({ ...prev, texturePreference: textureId }));
  };

  // Submit form data to database
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send the data to your backend
    console.log('Submitting responses:', responses);
    
    // Simulate successful submission
    setSubmitted(true);
  };

  // Placeholder styles for demo purposes
  const styleOptions = [
    { id: 1, name: 'Modern', description: 'Clean lines and minimal decoration' },
    { id: 2, name: 'Traditional', description: 'Classic design with warm colors' },
    { id: 3, name: 'Contemporary', description: 'Blend of modern and traditional' },
  ];

  // Texture options
  const textureOptions = [
    { id: 1, name: 'Rough' },
    { id: 2, name: 'Slightly Rough' },
    { id: 3, name: 'Medium' },
    { id: 4, name: 'Slightly Soft' },
    { id: 5, name: 'Soft' },
  ];

  if (submitted) {
    return (
      <div className="quiz-container">
        <h2>Thank you for completing the quiz!</h2>
        <p>Your preferences have been saved.</p>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h1>Interior Design Style Quiz</h1>
      <form onSubmit={handleSubmit}>
        {/* Question 1: Style Preference */}
        <section className="question-section">
          <h2 id="style-question">
            <span className="question-number">1</span> Which style best matches your personal preference?
          </h2>
          <div className="style-options" role="radiogroup" aria-labelledby="style-question">
            {styleOptions.map((style) => (
              <div 
                key={style.id}
                className={`style-option ${responses.stylePreference === style.id ? 'selected' : ''}`}
              >
                <input 
                  type="radio"
                  id={`style-${style.id}`}
                  name="stylePreference"
                  value={style.id}
                  checked={responses.stylePreference === style.id}
                  onChange={() => handleStyleSelect(style.id)}
                  className="visually-hidden"
                />
                <label htmlFor={`style-${style.id}`} className="style-label">
                  <div className="style-image placeholder-image">
                    {/* Placeholder for style images */}
                    <span className="placeholder-text">{style.name}</span>
                  </div>
                  <div className="style-info">
                    <h3>{style.name}</h3>
                    <p>{style.description}</p>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </section>

        {/* Question 2: Texture Preference */}
        <section className="question-section">
          <h2 id="texture-question">
            <span className="question-number">2</span> What texture do you prefer in cloth?
          </h2>
          <div className="texture-slider-container">
            <div className="texture-labels">
              {textureOptions.map((texture) => (
                <span key={texture.id} className="texture-label">{texture.name}</span>
              ))}
            </div>
            <div className="texture-slider" role="group" aria-labelledby="texture-question">
              {textureOptions.map((texture) => (
                <div key={texture.id} className="texture-option">
                  <input
                    type="radio"
                    id={`texture-${texture.id}`}
                    name="texturePreference"
                    value={texture.id}
                    checked={responses.texturePreference === texture.id}
                    onChange={() => handleTextureSelect(texture.id)}
                    className="visually-hidden"
                  />
                  <label 
                    htmlFor={`texture-${texture.id}`}
                    className={`texture-button ${responses.texturePreference === texture.id ? 'selected' : ''}`}
                    aria-label={texture.name}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="submit-container">
          <button 
            type="submit" 
            className="submit-button"
            disabled={!responses.stylePreference || !responses.texturePreference}
          >
            Submit Responses
          </button>
        </div>
      </form>
    </div>
  );
};

export default Quiz;
