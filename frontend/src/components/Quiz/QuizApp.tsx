import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { FC } from 'react';
import axios from 'axios';
import quizQuestions from './QuizQuestions';
import type { Question } from './QuizQuestions';
import './QuizStyle.css';
import TextToSpeech from './TextToSpeech';
import DesignResults from '../DesignResults/DesignResults';


const API_URL = import.meta.env.VITE_API_URL;

interface QuizProps {
  onQuestionChange?: (index: number) => void;
}

const Quiz: FC<QuizProps> = ({ onQuestionChange }) => {
  const [responses, setResponses] = useState<Record<number, string | number | number[] | null>>({});
  const [otherInputs, setOtherInputs] = useState<Record<number, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const questionSectionRef = useRef<HTMLElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoTTS, setAutoTTS] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'next' | 'prev'>('next');

  // Questions that should have "Other" option
  const QUESTIONS_WITH_OTHER = [4, 5, 25, 28, 29];
  const OTHER_OPTION_ID = 9999;

  useEffect(() => {
    const initialResponses: Record<number, string | number | number[] | null> = {};
    quizQuestions.forEach((question: Question) => {
      if (question.type === 'text' || 
          (question as { inputType?: string }).inputType === 'email' || 
          (question as { inputType?: string }).inputType === 'tel') {
        initialResponses[question.id] = '';
      } else if (question.type === 'multiSelect' || 
                (question.type === 'pictureSelection' && (question.id === 15 || question.id === 21))) {
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
    setResponses((prev) => ({
      ...prev,
      [questionId]: prev[questionId] === optionId ? null : optionId
    }));
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
        // For questions 15 and 21, limit to 3 selections
        if ((questionId === 15 || questionId === 21) && currentSelections.length >= 3) {
          console.log("Maximum 3 selections allowed");
          return prev; // Don't add more than 3 selections
        }
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
    if (isTransitioning) return;
    
    setTransitionDirection(direction);
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentQuestionIndex(newIndex);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
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
    if (event.key === 'Enter') {
      // Prevent default Enter behavior which submits forms
      event.preventDefault();
      
      if (!isSubmitDisabled && currentQuestionIndex === quizQuestions.length - 1) {
        handleSubmit(event as unknown as React.FormEvent);
      } else if (currentQuestionIndex < quizQuestions.length - 1) {
        goToNextQuestion();
      }
    }
  };

  const isCurrentQuestionAnswered = useCallback(() => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const response = responses[currentQuestion.id];
    
    if (response === null || response === undefined) return false;
    
    if (currentQuestion.type === 'text') {
      return typeof response === 'string' && response.trim() !== '';
    } else if (currentQuestion.type === 'multiSelect' || 
               (currentQuestion.type === 'pictureSelection' && (currentQuestion.id === 15 || currentQuestion.id === 21))) {
      // For multi-select questions, check if any option is selected
      if (!Array.isArray(response) || response.length === 0) return false;
      
      // For questions with "Other" option, require text input if "Other" is selected
      if (QUESTIONS_WITH_OTHER.includes(currentQuestion.id) && 
          response.includes(OTHER_OPTION_ID) && 
          (!otherInputs[currentQuestion.id] || otherInputs[currentQuestion.id].trim() === '')) {
        return false;
      }
      
      return true;
    } else if (currentQuestion.type === 'multipleChoice') {
      return response !== null && response !== undefined;
    }
    
    return response !== null;
  }, [currentQuestionIndex, responses, otherInputs, QUESTIONS_WITH_OTHER, OTHER_OPTION_ID]);

  const isNextDisabled = useCallback(() => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    return currentQuestion.required && !isCurrentQuestionAnswered();
  }, [currentQuestionIndex, isCurrentQuestionAnswered]);
  
  const isSubmitDisabled = isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Prepare final responses with "Other" text inputs
      const finalResponses: Record<number, any> = { ...responses };
      
      // Add "Other" text to specific questions
      Object.keys(otherInputs).forEach(questionId => {
        const qId = parseInt(questionId);
        const response = finalResponses[qId];
        
        // Only for multi-select questions with "Other" option selected
        if (Array.isArray(response) && response.includes(OTHER_OPTION_ID)) {
          finalResponses[qId] = {
            selectedOptions: response,
            otherText: otherInputs[qId] || ''
          };
        }
      });
      
      console.log('Submitting quiz responses:', finalResponses);
      const requestData = {
        personalInfo: {
          fullName: String(responses[1] || '').trim() || '',
          phoneNumber: String(responses[2] || '').trim() || '',
          email: String(responses[3] || '').trim() || ''
        }
      };
      console.log('Sending request to backend:', requestData);
      const randomUserId = 'user_' + Math.random().toString(36).substr(2, 9);
      const finalPayload = {
        userId: randomUserId,
        responses: finalResponses
      };
      console.log('Final payload:', finalPayload);
      const response = await axios.post(
        `${API_URL}/api/style-quiz/submit`,
        finalPayload
      );
      console.log('Backend response:', response);
      if (response.status === 200 || response.status === 201) {
        // Show results page after successful submission
        setSubmitted(true);
      }
    } catch (error: any) {
      console.error('Error submitting quiz:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
      console.error('Failed to submit quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPictureSelectionQuestion = (question: Question) => {
    // For questions 15 and 21, we need to handle multi-select
    const isMultiSelect = question.id === 15 || question.id === 21;
    const isQuestion15 = question.id === 15;
    let selectedOptions: number[] = [];
    
    if (isMultiSelect) {
      // For multi-select, make sure we have an array
      selectedOptions = Array.isArray(responses[question.id]) 
        ? (responses[question.id] as number[]) 
        : [];
    } else {
      // For single-select, convert to array for consistent handling
      selectedOptions = responses[question.id] !== null 
        ? [responses[question.id] as number] 
        : [];
    }
    
    return (
      <div className="picture-selection-options-container">
        <TextToSpeech
          text=""
          allOptions={question.options.map(opt => opt.name)}
          showAllOptions={true}
          showLabel={true}
          size="medium"
        />
        {isMultiSelect && (
          <div className="selection-limit-note">
            Select up to 3 options
          </div>
        )}
        <div 
          className={`picture-selection-options ${isQuestion15 ? 'question15-options' : ''}`}
          role={isMultiSelect ? "group" : "radiogroup"} 
          aria-labelledby={`question-${question.id}`}
        > 
          {question.options.map((option) => {
            const isSelected = selectedOptions.includes(option.id);
            
            return (
              <div key={option.id} className={`picture-option ${isQuestion15 ? 'question15-option' : ''}`}>
                <input
                  type={isMultiSelect ? "checkbox" : "radio"}
                  id={`${question.id}-${option.id}`}
                  name={`question-${question.id}`}
                  value={option.id}
                  checked={isSelected}
                  onChange={() => {
                    if (isMultiSelect) {
                      handleMultiSelectOption(question.id, option.id);
                    } else {
                      handleOptionSelect(question.id, option.id);
                    }
                  }}
                  className="hidden"
                />
                <label
                  htmlFor={`${question.id}-${option.id}`}
                  className={`picture-option-label ${isSelected ? 'selected' : ''} ${isQuestion15 ? 'question15-label' : ''}`}
                >
                  {option.imageUrl ? (
                    <img 
                      src={option.imageUrl} 
                      alt={option.altText || option.name} 
                      className={`option-image ${isQuestion15 ? 'question15-image' : ''}`}
                    />
                  ) : (
                    <div className="option-image-placeholder">
                      <span>{option.name.charAt(0)}</span>
                    </div>
                  )}
                  {option.description && !isQuestion15 && <span className="option-text">{option.description}</span>}
                </label>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScaleQuestion = (question: Question) => {
    return (
      <div className="scale-slider-container">
        <TextToSpeech
          text=""
          allOptions={question.options?.map(opt => opt.name) || []}
          showAllOptions={true}
          showLabel={true}
          size="medium"
        />
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
        <TextToSpeech
          text=""
          allOptions={question.options.map(opt => opt.name)}
          showAllOptions={true}
          showLabel={true}
          size="medium"
        />
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

  const renderMultiSelectQuestion = (question: Question) => {
    const selectedOptions = responses[question.id] as number[] || [];
    const hasOtherOption = QUESTIONS_WITH_OTHER.includes(question.id);
    const hasOtherSelected = hasOtherOption && selectedOptions.includes(OTHER_OPTION_ID);
    
    return (
      <div className="multi-select-container">
        <TextToSpeech
          text=""
          allOptions={question.options.map(opt => opt.name)}
          showAllOptions={true}
          showLabel={true}
          size="medium"
        />
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
                <TextToSpeech 
                  text={option.name} 
                  size="small" 
                  className="ml-2"
                  showLabel={false}
                />
              </label>
            </div>
          ))}
          
          {/* Add "Other" option for specific questions */}
          {hasOtherOption && (
            <div className="multi-select-option">
              <input
                type="checkbox"
                id={`question-${question.id}-option-other`}
                name={`question-${question.id}`}
                value={OTHER_OPTION_ID}
                checked={hasOtherSelected}
                onChange={() => handleMultiSelectOption(question.id, OTHER_OPTION_ID)}
                className="multi-select-checkbox"
              />
              <label 
                htmlFor={`question-${question.id}-option-other`}
                className="multi-select-label"
              >
                <span className="checkmark"></span>
                <span className="multi-select-label-text">Other</span>
                <TextToSpeech 
                  text="Other" 
                  size="small" 
                  className="ml-2"
                  showLabel={false}
                />
              </label>
            </div>
          )}
          
          {/* Show text input if "Other" is selected */}
          {hasOtherSelected && (
            <div className="other-input-container">
              <input
                type="text"
                placeholder="Please specify..."
                value={otherInputs[question.id] || ''}
                onChange={(e) => setOtherInputs(prev => ({ ...prev, [question.id]: e.target.value }))}
                className="other-input"
              />
              {otherInputs[question.id] && (
                <div className="other-input-tts">
                  <TextToSpeech 
                    text={otherInputs[question.id]} 
                    size="small" 
                    showLabel={false}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMultipleChoiceQuestion = (question: Question) => {
    return (
      <div className="multiple-choice-container">
        <TextToSpeech
          text=""
          allOptions={question.options.map(opt => opt.name)}
          showAllOptions={true}
          showLabel={true}
          size="medium"
        />
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
                <TextToSpeech 
                  text={option.name} 
                  size="small" 
                  className="ml-2"
                  showLabel={false}
                />
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

  const renderAutoTTSToggle = () => {
    if (currentQuestionIndex !== 0) return null;

    return (
      <div className="auto-tts-toggle">
        <label className="auto-tts-label">
          <input
            type="checkbox"
            checked={autoTTS}
            onChange={(e) => setAutoTTS(e.target.checked)}
            className="auto-tts-checkbox"
          />
          <span>Enable automatic text-to-speech for all questions</span>
        </label>
      </div>
    );
  };

  if (submitted) {
    return <DesignResults onStartOver={() => setSubmitted(false)} />;
  }

  return (
    <div className="quiz-container" onKeyDown={handleKeyDown} tabIndex={0}>
      <form onSubmit={handleSubmit} onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}>
        {renderAutoTTSToggle()}
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
            <div className="question-text-container">
              <p className="question-text">
                {currentQuestion.description}
                {currentQuestion.required && <span className="required-indicator">*</span>}
              </p>
              <TextToSpeech 
                text={currentQuestion.description} 
                showAllOptions={false}
                autoRead={autoTTS}
                size="medium"
              />
            </div>
          </div>
          {renderQuestionContent(currentQuestion)}
          
          <div className="navigation-container">
              <button 
                type="button" 
                className="nav-button prev-button"
                onClick={goToPreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </button>
            
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
          
          {currentQuestion.required && (
            <div className="required-note">
              * This question is required
            </div>
          )}
        </section>

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