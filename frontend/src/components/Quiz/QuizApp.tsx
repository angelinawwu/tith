import React, { useState } from 'react';
import './QuizStyle.css';
import quizQuestions from './QuizQuestions';
import type { Question } from './QuizQuestions';

interface QuizResponse {
  [key: number]: number | null | string;
}

const Quiz: React.FC = () => {
  const [responses, setResponses] = useState<QuizResponse>(
    quizQuestions.reduce((acc, question) => {
      acc[question.id] = question.type === 'text' ? '' : null;
      return acc;
    }, {} as QuizResponse)
  );
  const [submitted, setSubmitted] = useState(false);

  // Handle option selection for any question
  const handleOptionSelect = (questionId: number, optionId: number) => {
    setResponses((prev) => ({ ...prev, [questionId]: optionId }));
  };

  // Handle text input for text questions
  const handleTextInput = (questionId: number, value: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  // Submit form data to database
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send the data to your backend
    console.log('Submitting responses:', responses);
    
    // Simulate successful submission
    setSubmitted(true);
  };

  // Check if all questions have been answered
  const isFormComplete = () => {
    return Object.entries(responses).every(([questionId, response]) => {
      const question = quizQuestions.find(q => q.id === parseInt(questionId));
      if (question?.type === 'text') {
        return typeof response === 'string' && response.trim() !== '';
      }
      return response !== null;
    });
  };

  // Render a style question
  const renderStyleQuestion = (question: Question) => {
    return (
      <div className="style-options" role="radiogroup" aria-labelledby={`question-${question.id}`}>
        {question.options.map((option) => (
          <div 
            key={option.id}
            className={`style-option ${responses[question.id] === option.id ? 'selected' : ''}`}
          >
            <input 
              type="radio"
              id={`question-${question.id}-option-${option.id}`}
              name={`question-${question.id}`}
              value={option.id}
              checked={responses[question.id] === option.id}
              onChange={() => handleOptionSelect(question.id, option.id)}
              className="visually-hidden"
            />
            <label htmlFor={`question-${question.id}-option-${option.id}`} className="style-label">
              <div className="style-image">
                <span className="placeholder-text">{option.name}</span>
              </div>
              <div className="style-info">
                <h3>{option.name}</h3>
                {option.description && <p>{option.description}</p>}
              </div>
            </label>
          </div>
        ))}
      </div>
    );
  };

  // Render a texture question
  const renderTextureQuestion = (question: Question) => {
    return (
      <div className="texture-slider-container">
        <div className="texture-labels">
          {question.options.map((option) => (
            <span key={option.id}>{option.name}</span>
          ))}
        </div>
        <div className="texture-slider" role="group" aria-labelledby={`question-${question.id}`}>
          {question.options.map((option) => (
            <div key={option.id} className="texture-option">
              <input
                type="radio"
                id={`question-${question.id}-option-${option.id}`}
                name={`question-${question.id}`}
                value={option.id}
                checked={responses[question.id] === option.id}
                onChange={() => handleOptionSelect(question.id, option.id)}
                className="visually-hidden"
              />
              <label 
                htmlFor={`question-${question.id}-option-${option.id}`}
                className={`texture-button ${responses[question.id] === option.id ? 'selected' : ''}`}
                aria-label={option.name}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render a text input question
  const renderTextQuestion = (question: Question) => {
    // Get placeholder text based on input type
    const getPlaceholderText = () => {
      switch (question.inputType) {
        case 'tel':
          return 'e.g., (555) 123-4567';
        case 'email':
          return 'e.g., name@example.com';
        default:
          return 'e.g., John Smith';
      }
    };

    return (
      <div className="text-input-container">
        <div className="text-input-wrapper">
          <input
            type={question.inputType || 'text'}
            id={`question-${question.id}`}
            name={`question-${question.id}`}
            value={responses[question.id] as string}
            onChange={(e) => handleTextInput(question.id, e.target.value)}
            className="text-input"
            placeholder={getPlaceholderText()}
            required
            aria-label={question.placeholder}
          />
        </div>
      </div>
    );
  };

  // Render question based on its type
  const renderQuestionContent = (question: Question) => {
    switch (question.type) {
      case 'style':
        return renderStyleQuestion(question);
      case 'texture':
        return renderTextureQuestion(question);
      case 'text':
        return renderTextQuestion(question);
      default:
        return null;
    }
  };

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
        {quizQuestions.map((question) => (
          <section key={question.id} className="question-section">
            <div className="question-heading">
              <h2 id={`question-${question.id}`}>
                <span className="question-number">{question.number}</span>
              </h2>
              <p className="question-text">
                {question.description}
              </p>
            </div>
            {renderQuestionContent(question)}
          </section>
        ))}

        <div className="submit-container">
          <button 
            type="submit" 
            className={`submit-button ${!isFormComplete() ? 'disabled' : ''}`}
            disabled={!isFormComplete()}
          >
            Submit Responses
          </button>
        </div>
      </form>
    </div>
  );
};

export default Quiz;
