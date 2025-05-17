import React, { useState } from 'react';
import type { KeyboardEvent } from 'react';
import './QuizStyle.css';
import quizQuestions from './QuizQuestions';
import type { Question } from './QuizQuestions';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface QuizResponse {
  [key: number]: string | number | number[] | null;
}

interface ApiResponse {
  status: number;
  data: any;
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Navigate to the next question
  const goToNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // Navigate to the previous question
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !isSubmitDisabled && currentQuestionIndex === quizQuestions.length - 1) {
      handleSubmit(event as unknown as React.FormEvent);
    } else if (event.key === 'Enter' && currentQuestionIndex < quizQuestions.length - 1) {
      goToNextQuestion();
    }
  };

  // Check if the current question is answered
  const isCurrentQuestionAnswered = () => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const response = responses[currentQuestion.id];
    
    if (currentQuestion.type === 'text') {
      return typeof response === 'string' && response.trim() !== '';
    } else if (currentQuestion.type === 'multiSelect') {
      return Array.isArray(response) && response.length > 0;
    }
    
    return response !== null;
  };

  // Calculate if the next button should be disabled
  const isNextDisabled = () => {
    // If the question is required, it must be answered before proceeding
    const currentQuestion = quizQuestions[currentQuestionIndex];
    return currentQuestion.required && !isCurrentQuestionAnswered();
  };

  // Submit form data to database
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log('Submitting quiz responses:', responses);
      
      // Helper function to get option text from ID
      const getOptionText = (questionId: number, optionId: number): string => {
        const question = quizQuestions.find(q => q.id === questionId);
        const option = question?.options.find(o => o.id === optionId);
        return option?.name || '';
      };

      const getMultipleOptionTexts = (questionId: number, optionIds: number[] | null): string[] => {
        if (!optionIds || !Array.isArray(optionIds)) {
          return [];
        }
        return optionIds.map(id => getOptionText(questionId, id));
      };

      const requestData = {
        personalInfo: {
          firstName: String(responses[1] || '').trim().split(' ')[0] || '',
          lastName: String(responses[1] || '').trim().split(' ').slice(1).join(' ') || '',
          phoneNumber: String(responses[2] || '').trim() || '',
          email: String(responses[3] || '').trim() || ''
        },
        demographics: {
          gender: getMultipleOptionTexts(4, responses[4] as number[]) || [],
          ethnicity: getMultipleOptionTexts(5, responses[5] as number[]) || [],
          householdSize: String(getOptionText(6, responses[6] as number) || '').trim() || '',
          fosterCare: responses[7] === 1,
          disability: responses[8] === 1,
          disabilityDetails: String(responses[9] || '').trim() || '',
        },
        stylePreferences: {
          homeMessage: getMultipleOptionTexts(10, responses[10] as number[]) || [],
          favoriteColors: getMultipleOptionTexts(11, responses[11] as number[]) || [],
          styleInWords: String(responses[12] || '').trim() || '',
          styleAdmired: String(responses[13] || '').trim() || '',
        },
        comfortFactors: {
          peacePlace: String(responses[14] || '').trim() || '',
          peaceScent: getMultipleOptionTexts(15, responses[15] as number[]) || [],
          fabrics: getMultipleOptionTexts(16, responses[16] as number[]) || [],
          calmColors: getMultipleOptionTexts(17, responses[17] as number[]) || [],
        },
        environmentalPreferences: {
          artTypes: getMultipleOptionTexts(18, responses[18] as number[]) || [],
          allergies: responses[19] === 1,
          allergyDetails: String(responses[20] || '').trim() || '',
          pets: responses[21] === 1,
          petDetails: String(responses[22] || '').trim() || '',
        },
        personalInterests: {
          roomWords: getMultipleOptionTexts(23, responses[23] as number[]) || [],
        },
        designElements: {
          patternPreference: String(responses[24] || '').trim() || '',
          patternTypes: getMultipleOptionTexts(25, responses[25] as number[]) || [],
          roomWords: getMultipleOptionTexts(26, responses[26] as number[]) || [],
        },
        generatedPreferences: {
          colorPalette: [], // Will be generated by backend
          moodboardImageUrl: '', // Will be generated by backend
          suggestedFurniture: [] // Will be generated by backend
        },
        additionalNotes: String(responses[28] || '').trim() || '',
      };
      
      console.log('Sending request to backend:', requestData);
      
      // Generate a random userId for each submission
      const randomUserId = 'user_' + Math.random().toString(36).substr(2, 9);
      const finalPayload = {
        userId: randomUserId,
        responses: responses // Send the raw responses object
      };
      console.log("Final payload:", finalPayload);
      const response: ApiResponse = await axios.post(
        `${API_URL}/api/style-quiz/submit`,
        finalPayload
      );

      console.log('Backend response:', response);
      
      if (response.status === 201) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
        console.error('Response headers:', error.response?.headers);
      }
      setError(error instanceof Error ? error.message : 'An error occurred while submitting the quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = (): boolean => {
    // Check required personal info fields
    const fullName = (responses[1] as string)?.trim() || '';
    const email = responses[3] as string;
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = email && email.trim() !== '' && emailRegex.test(email);
    
    // Check if required fields are filled
    if (!fullName || fullName.split(' ').length < 2 || !isEmailValid) {
      return false;
    }

    // Check other required questions
    const requiredQuestions = quizQuestions.filter(q => q.required);
    return requiredQuestions.every(question => {
      const response = responses[question.id];
      if (question.type === 'multiSelect') {
        return Array.isArray(response) && response.length > 0;
      }
      return response !== null && response !== '';
    });
  };

  // Is the submit button disabled?
  const isSubmitDisabled = isSubmitting;

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
        case 'name':
          return 'e.g., John Smith';
        default:
          return '';
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
            required={question.id === 3}
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

  // Get the current question to display
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;

  return (
    <div className="quiz-container" onKeyDown={handleKeyDown} tabIndex={0}>
      <h1>Interior Design Style Quiz</h1>
      <form onSubmit={handleSubmit}>
        <section className="question-section">
          <div className="question-heading">
            <h2 id={`question-${currentQuestion.id}`}>
              <span className="question-number">{currentQuestion.number}</span>
            </h2>
            <p className="question-text">
              {currentQuestion.description}
            </p>
          </div>
          {renderQuestionContent(currentQuestion)}
        </section>

        <div className="navigation-container">
          {currentQuestionIndex > 0 && (
            <button 
              type="button" 
              className="nav-button prev-button"
              onClick={goToPreviousQuestion}
            >
              Previous
            </button>
          )}
          
          {!isLastQuestion ? (
            <button 
              type="button" 
              className="nav-button next-button"
              onClick={goToNextQuestion}
              disabled={isNextDisabled()}
            >
              Next
            </button>
          ) : (
            <button 
              type="submit" 
              className={`submit-button ${isSubmitDisabled ? 'disabled' : ''}`}
              disabled={isSubmitDisabled}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Responses'}
            </button>
          )}
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default Quiz;
