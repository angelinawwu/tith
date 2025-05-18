import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { FC } from 'react';
import axios from 'axios';
import quizQuestions from './QuizQuestions';
import type { Question } from './QuizQuestions';
import './QuizStyle.css';


const API_URL = import.meta.env.VITE_API_URL;

interface QuizProps {
  onQuestionChange?: (index: number) => void;
}

const Quiz: FC<QuizProps> = ({ onQuestionChange }) => {
  const [responses, setResponses] = useState<Record<number, string | number | number[] | null>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'next' | 'prev'>('next');
  const questionSectionRef = useRef<HTMLElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const initialResponses: Record<number, string | number | number[] | null> = {};
    quizQuestions.forEach((question: Question) => {
      if (question.type === 'text' ||
          (question as { inputType?: string }).inputType === 'email' ||
          (question as { inputType?: string }).inputType === 'tel') {
        initialResponses[question.id] = '';
      } else if (question.type === 'multiSelect') {
        initialResponses[question.id] = [];
      } else {
        initialResponses[question.id] = null;
      }
    });
    setResponses(prev => (Object.keys(prev).length === 0 ? initialResponses : prev));
  }, []);

  useEffect(() => {
    // Notify parent component when question changes
    if (onQuestionChange) {
      onQuestionChange(currentQuestionIndex);
    }
  }, [currentQuestionIndex, onQuestionChange]);

  const handleOptionSelect = (questionId: number, optionId: number) => {
    setResponses((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleMultiSelectOption = (questionId: number, optionId: number) => {
    setResponses((prev) => {
      const currentSelections = Array.isArray(prev[questionId]) ? (prev[questionId] as number[]) : [];
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

  const handleTextInput = (questionId: number, value: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !isSubmitDisabled && currentQuestionIndex === quizQuestions.length - 1) {
      handleSubmit(event as unknown as React.FormEvent);
    } else if (event.key === 'Enter' && currentQuestionIndex < quizQuestions.length - 1) {
      goToNextQuestion();
    }
  };

  const isCurrentQuestionAnswered = useCallback(() => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const response = responses[currentQuestion.id];
    if (response === null || response === undefined) return false;
    if (currentQuestion.type === 'text') {
      return typeof response === 'string' && response.trim() !== '';
    } else if (currentQuestion.type === 'multiSelect') {
      return Array.isArray(response) && response.length > 0;
    } else if (currentQuestion.type === 'multipleChoice') {
      return response !== null && response !== undefined;
    }
    return response !== null;
  }, [currentQuestionIndex, responses]);

  const isNextDisabled = useCallback(() => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    return currentQuestion.required && !isCurrentQuestionAnswered();
  }, [currentQuestionIndex, isCurrentQuestionAnswered]);

  const isSubmitDisabled = isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      console.log('Submitting quiz responses:', responses);
      // Only use fullName for name input
      const requestData = {
        personalInfo: {
          fullName: String(responses[1] || '').trim() || '',
          phoneNumber: String(responses[2] || '').trim() || '',
          email: String(responses[3] || '').trim() || ''
        }
        // Add other fields as needed, using getMultipleOptionTexts(questionId, responses)
      };
      console.log('Sending request to backend:', requestData);
      // Generate a random userId for each submission
      const randomUserId = 'user_' + Math.random().toString(36).substr(2, 9);
      const finalPayload = {
        userId: randomUserId,
        responses: responses
      };
      console.log('Final payload:', finalPayload);
      const response = await axios.post(
        `${API_URL}/api/style-quiz/submit`,
        finalPayload
      );
      console.log('Backend response:', response);
      if (response.status === 200 || response.status === 201) {
        // Handle successful submission
      }
    } catch (error: any) {
      console.error('Error submitting quiz:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPictureSelectionQuestion = (question: Question) => {
    return (
      <div className="picture-selection-options" role="radiogroup" aria-labelledby={`question-${question.id}`}>
        {question.options?.map((option: { id: number; name: string; imageUrl?: string }) => (
          <div key={option.id} className="picture-option">
            <input
              type="radio"
              id={`${question.id}-${option.id}`}
              name={`question-${question.id}`}
              value={option.id}
              checked={responses[question.id] === option.id}
              onChange={() => handleOptionSelect(question.id, option.id)}
              className="hidden"
            />
            <label
              htmlFor={`${question.id}-${option.id}`}
              className={`picture-option-label ${
                responses[question.id] === option.id ? 'selected' : ''
              }`}
            >
              {option.imageUrl && (
                <img src={option.imageUrl} alt={option.name} className="option-image" />
              )}
              <span className="option-text">{option.name}</span>
            </label>
          </div>
        ))}
      </div>
    );
  };

  const renderScaleQuestion = (question: Question) => {
    return (
      <div className="scale-slider-container">
        <div className="scale-labels">
          {question.options?.map((option) => (
            <span key={option.id}>{option.name}</span>
          ))}
        </div>
        <div className="scale-slider" role="group" aria-labelledby={`question-${question.id}`}>
          {question.options?.map((option) => (
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

  const renderTextQuestion = (question: Question) => {
    const getPlaceholderText = () => {
      switch (question.inputType) {
        case 'tel':
          return 'ex: (555) 123-4567';
        case 'email':
          return 'ex: name@example.com';
        case 'name':
          return 'ex: John Smith';
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
            value={String(responses[question.id] ?? '')}
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

  const renderDropdownQuestion = (question: Question) => {
    return (
      <div className="dropdown-container">
        <select
          id={`question-${question.id}`}
          name={`question-${question.id}`}
          value={String(responses[question.id] ?? '')}
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

  const renderMultiSelectQuestion = (question: Question) => {
    const selectedOptions = Array.isArray(responses[question.id]) ? (responses[question.id] as number[]) : [];
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

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;

  return (
    <div className="quiz-container" onKeyDown={handleKeyDown} tabIndex={0}>
      <form onSubmit={handleSubmit}>
        <section 
          ref={questionSectionRef}
          className={`question-section ${isTransitioning ? 
            (transitionDirection === 'next' ? 'question-exit' : 'question-enter') : 
            ''}`}
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
        
        {isSubmitting && (
          <div className="submitting-message">
            Submitting...
          </div>
        )}
      </form>
    </div>
  );
};

export default Quiz;
