import React, { useState } from 'react';
import styles from './QuizStyle';

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
      <div style={styles.quizContainer}>
        <h2>Thank you for completing the quiz!</h2>
        <p>Your preferences have been saved.</p>
      </div>
    );
  }

  return (
    <div style={styles.quizContainer}>
      <h1>Interior Design Style Quiz</h1>
      <form onSubmit={handleSubmit}>
        {/* Question 1: Style Preference */}
        <section style={styles.questionSection}>
          <h2 id="style-question">
            <span style={styles.questionNumber}>1</span> Which style best matches your personal preference?
          </h2>
          <div style={styles.styleOptions} role="radiogroup" aria-labelledby="style-question">
            {styleOptions.map((style) => (
              <div 
                key={style.id}
                style={{
                  ...styles.styleOption, 
                  ...(responses.stylePreference === style.id ? styles.styleOptionSelected : {})
                }}
              >
                <input 
                  type="radio"
                  id={`style-${style.id}`}
                  name="stylePreference"
                  value={style.id}
                  checked={responses.stylePreference === style.id}
                  onChange={() => handleStyleSelect(style.id)}
                  style={styles.visuallyHidden}
                />
                <label htmlFor={`style-${style.id}`} style={styles.styleLabel}>
                  <div style={styles.styleImage}>
                    {/* Placeholder for style images */}
                    <span style={styles.placeholderText}>{style.name}</span>
                  </div>
                  <div style={styles.styleInfo}>
                    <h3 style={styles.styleInfoHeading}>{style.name}</h3>
                    <p style={styles.styleInfoParagraph}>{style.description}</p>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </section>

        {/* Question 2: Texture Preference */}
        <section style={styles.questionSection}>
          <h2 id="texture-question">
            <span style={styles.questionNumber}>2</span> What texture do you prefer in cloth?
          </h2>
          <div style={styles.textureSliderContainer}>
            <div style={styles.textureLabels}>
              {textureOptions.map((texture) => (
                <span key={texture.id}>{texture.name}</span>
              ))}
            </div>
            <div style={styles.textureSlider} role="group" aria-labelledby="texture-question">
              {textureOptions.map((texture) => (
                <div key={texture.id} style={styles.textureOption}>
                  <input
                    type="radio"
                    id={`texture-${texture.id}`}
                    name="texturePreference"
                    value={texture.id}
                    checked={responses.texturePreference === texture.id}
                    onChange={() => handleTextureSelect(texture.id)}
                    style={styles.visuallyHidden}
                  />
                  <label 
                    htmlFor={`texture-${texture.id}`}
                    style={{
                      ...styles.textureButton,
                      ...(responses.texturePreference === texture.id ? styles.textureButtonSelected : {})
                    }}
                    aria-label={texture.name}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <div style={styles.submitContainer}>
          <button 
            type="submit" 
            style={{
              ...styles.submitButton,
              ...((!responses.stylePreference || !responses.texturePreference) 
                ? styles.submitButtonDisabled 
                : {})
            }}
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
