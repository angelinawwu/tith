import React, { useState } from 'react';
import './QuizStyle.css';
import quizQuestions from './QuizQuestions';
import type { Question } from './QuizQuestions';

interface QuizResponse {
  [key: number]: number | null | string | number[];
}

const Quiz: React.FC = () => {
  const [responses, setResponses] = useState<QuizResponse>(
    quizQuestions.reduce((acc, question) => {
      if (question.type === 'text') {
        acc[question.id] = '';
      } else if (question.type === 'multiSelect') {
        acc[question.id] = [];
      } else {
        acc[question.id] = null;
      }
      return acc;
    }, {} as QuizResponse)
  );
  const [submitted, setSubmitted] = useState(false);

  // Handle option selection for any question
  const handleOptionSelect = (questionId: number, optionId: number) => {
    setResponses((prev) => ({ ...prev, [questionId]: optionId }));
  };

  // Handle multi-select option selection
  const handleMultiSelectOption = (questionId: number, optionId: number) => {
    setResponses((prev) => {
      const currentSelections = prev[questionId] as number[] || [];
      
      // If option is already selected, remove it; otherwise, add it
      if (currentSelections.includes(optionId)) {
        return {
          ...prev,
          [questionId]: currentSelections.filter(id => id !== optionId)
        };
      } else {
        return {
          ...prev,
          [questionId]: [...currentSelections, optionId]
        };
      }
    });
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
      } else if (question?.type === 'multiSelect') {
        // For multiSelect, check that at least one option is selected
        return Array.isArray(response) && response.length > 0;
      }
      
      return response !== null;
    });
  };

  // Render a picture selection question
  const renderPictureSelectionQuestion = (question: Question) => {
    return (
      <div className="picture-selection-options" role="radiogroup" aria-labelledby={`question-${question.id}`}>
        {question.options.map((option) => (
          <div 
            key={option.id}
            className={`picture-selection-option ${responses[question.id] === option.id ? 'selected' : ''}`}
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
            <label htmlFor={`question-${question.id}-option-${option.id}`} className="picture-selection-label">
              <div className="picture-selection-image">
                <span className="placeholder-text">{option.name}</span>
              </div>
              <div className="picture-selection-info">
                <h3>{option.name}</h3>
                {option.description && <p>{option.description}</p>}
              </div>
            </label>
          </div>
        ))}
      </div>
    );
  };

  // Render a scale selection question
  const renderScaleQuestion = (question: Question) => {
    return (
      <div className="scale-slider-container">
        <div className="scale-labels">
          {question.options.map((option) => (
            <span key={option.id}>{option.name}</span>
          ))}
        </div>
        <div className="scale-slider" role="group" aria-labelledby={`question-${question.id}`}>
          {question.options.map((option) => (
            <div key={option.id} className="scale-option">
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
                className={`scale-button ${responses[question.id] === option.id ? 'selected' : ''}`}
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

  // Render a dropdown question
  const renderDropdownQuestion = (question: Question) => {
    return (
      <div className="dropdown-container">
        <select
          id={`question-${question.id}`}
          name={`question-${question.id}`}
          value={responses[question.id] as number || ""}
          onChange={(e) => handleOptionSelect(question.id, Number(e.target.value))}
          className="dropdown-select"
          required
          aria-labelledby={`question-${question.id}`}
        >
          <option value="" disabled>Please select an option</option>
          {question.options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
    );
  };

  // Render a multi-select question
  const renderMultiSelectQuestion = (question: Question) => {
    const selectedOptions = responses[question.id] as number[] || [];
    
    return (
      <div className="multi-select-container">
        <div className="multi-select-options" role="group" aria-labelledby={`question-${question.id}`}>
          {question.options.map((option) => (
            <div key={option.id} className="multi-select-option">
              <input
                type="checkbox"
                id={`question-${question.id}-option-${option.id}`}
                name={`question-${question.id}`}
                value={option.id}
                checked={selectedOptions.includes(option.id)}
                onChange={() => handleMultiSelectOption(question.id, option.id)}
                className="multi-select-checkbox"
              />
              <label 
                htmlFor={`question-${question.id}-option-${option.id}`}
                className="multi-select-label"
              >
                <span className="checkmark"></span>
                <span className="multi-select-label-text">{option.name}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render a multiple choice question
  const renderMultipleChoiceQuestion = (question: Question) => {
    return (
      <div className="multiple-choice-container">
        <div className="multiple-choice-options" role="radiogroup" aria-labelledby={`question-${question.id}`}>
          {question.options.map((option) => (
            <div key={option.id} className="multiple-choice-option">
              <input
                type="radio"
                id={`question-${question.id}-option-${option.id}`}
                name={`question-${question.id}`}
                value={option.id}
                checked={responses[question.id] === option.id}
                onChange={() => handleOptionSelect(question.id, option.id)}
                className="multiple-choice-radio"
              />
              <label 
                htmlFor={`question-${question.id}-option-${option.id}`}
                className="multiple-choice-label"
              >
                <span className="radio-mark"></span>
                <span className="multiple-choice-label-text">{option.name}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render question based on its type
  const renderQuestionContent = (question: Question) => {
    switch (question.type) {
      case 'pictureSelection':
        return renderPictureSelectionQuestion(question);
      case 'scale': 
        return renderScaleQuestion(question);
      case 'text':
        return renderTextQuestion(question);
      case 'dropdown':
        return renderDropdownQuestion(question);
      case 'multiSelect':
        return renderMultiSelectQuestion(question);
      case 'multipleChoice':
        return renderMultipleChoiceQuestion(question);
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
