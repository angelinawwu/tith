import React, { useState, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import './QuizStyle.css';
import quizQuestions from './QuizQuestions';
import type { Question } from './QuizQuestions';
import axios from 'axios';

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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'next' | 'prev'>('next');
  const questionSectionRef = useRef<HTMLElement>(null);
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

  // Navigate to the next question with transition
  const animateQuestionTransition = (newIndex: number, direction: 'next' | 'prev') => {
    setTransitionDirection(direction);
    setIsTransitioning(true);
    
    // Add exit animation classes
    if (questionSectionRef.current) {
      questionSectionRef.current.classList.add('question-exit', 'question-exit-active');
    }
  
    setTimeout(() => {
      setCurrentQuestionIndex(newIndex);
      
      // Remove exit classes and add enter classes
      if (questionSectionRef.current) {
        questionSectionRef.current.classList.remove('question-exit', 'question-exit-active');
        questionSectionRef.current.classList.add('question-enter');
        
        // Force reflow to ensure the enter animation plays
        void questionSectionRef.current.offsetHeight;
        
        // Start enter animation
        questionSectionRef.current.classList.add('question-enter-active');
        
        // Clean up after animation completes
        setTimeout(() => {
          if (questionSectionRef.current) {
            questionSectionRef.current.classList.remove('question-enter', 'question-enter-active');
            setIsTransitioning(false);
          }
        }, 300);
      }
    }, 300);
  };
  
  const goToNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1 && !isTransitioning) {
      animateQuestionTransition(currentQuestionIndex + 1, 'next');
    }
  };
  
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0 && !isTransitioning) {
      animateQuestionTransition(currentQuestionIndex - 1, 'prev');
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !isSubmitDisabled && currentQuestionIndex === quizQuestions.length - 1) {
      handleSubmit(event as unknown as React.FormEvent);
    } else if (event.key === 'Enter' && currentQuestionIndex < quizQuestions.length - 1 && !isTransitioning) {
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

      const response: ApiResponse = await axios.post(
        'http://localhost:5000/api/design-preferences/mock-user-id',
        {
          personalInfo: {
            firstName: responses[1] as string,
            lastName: responses[2] as string,
            email: responses[3] as string,
            phoneNumber: responses[4] as string,
          },
          demographics: {
            gender: getMultipleOptionTexts(4, responses[4] as number[]),
            ethnicity: getMultipleOptionTexts(5, responses[5] as number[]),
            householdSize: getOptionText(6, responses[6] as number),
            fosterCare: responses[7] === 1,
            disability: responses[8] === 1,
            disabilityDetails: responses[9] as string,
          },
          stylePreferences: {
            homeMessage: getMultipleOptionTexts(10, responses[10] as number[]),
            favoriteColors: getMultipleOptionTexts(11, responses[11] as number[]),
            styleInWords: responses[12] as string,
            styleAdmired: responses[13] as string,
          },
          comfortFactors: {
            peacePlace: responses[14] as string,
            peaceScent: getMultipleOptionTexts(15, responses[15] as number[]),
            fabrics: getMultipleOptionTexts(16, responses[16] as number[]),
            calmColors: getMultipleOptionTexts(17, responses[17] as number[]),
          },
          environmentalPreferences: {
            artTypes: getMultipleOptionTexts(18, responses[18] as number[]),
            allergies: responses[19] === 1,
            allergyDetails: responses[20] as string,
            pets: responses[21] === 1,
            petDetails: responses[22] as string,
          },
          personalInterests: {
            roomWords: getMultipleOptionTexts(23, responses[23] as number[]),
          },
          designElements: {
            patternPreference: responses[24] as string,
            patternTypes: getMultipleOptionTexts(25, responses[25] as number[]),
            roomWords: getMultipleOptionTexts(26, responses[26] as number[]),
          },
          generatedPreferences: {
            colorPalette: [], // Will be generated by backend
            moodboardImageUrl: '', // Will be generated by backend
            suggestedFurniture: [] // Will be generated by backend
          },
          additionalNotes: responses[27] as string,
        },
        {
          params: {
            complete: 'true'
          }
        }
      );

      if (response.status === 201) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while submitting the quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = (): boolean => {
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
  const isSubmitDisabled = !validateForm() || isSubmitting;

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

  // Get the current question to display
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;

  return (
    <div className="quiz-container" onKeyDown={handleKeyDown} tabIndex={0}>
      <form onSubmit={handleSubmit}>
        <section 
          ref={questionSectionRef} 
          className={`question-section ${isTransitioning ? 'question-enter' : ''}`}
        >
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
          {/* Always show the previous button but disable it on first question */}
          <button 
            type="button" 
            className="nav-button prev-button"
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0 || isTransitioning}
          >
            Previous
          </button>
          
          {!isLastQuestion ? (
            <button 
              type="button" 
              className="nav-button next-button"
              onClick={goToNextQuestion}
              disabled={isNextDisabled() || isTransitioning}
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
