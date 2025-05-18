<<<<<<< HEAD
import React, { useState, useEffect, useCallback, useMemo } from 'react';
=======
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { FC } from 'react';
>>>>>>> origin/main
import axios from 'axios';
import quizQuestions from './QuizQuestions';
import type { Question } from './QuizQuestions';
import DesignGenerator from '../DesignGenerator/DesignGenerator';
import './QuizStyle.css';
import TextToSpeech from './TextToSpeech';


<<<<<<< HEAD
const Quiz = () => {
=======
const API_URL = import.meta.env.VITE_API_URL;

interface QuizProps {
  onQuestionChange?: (index: number) => void;
}

const Quiz: FC<QuizProps> = ({ onQuestionChange }) => {
>>>>>>> origin/main
  const [responses, setResponses] = useState<Record<number, string | number | number[] | null>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'next' | 'prev'>('next');
  const questionSectionRef = useRef<HTMLElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
<<<<<<< HEAD
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<Record<string, any> | null>(null);
  const [showResponses, setShowResponses] = useState(false);
  const [showDesignGenerator, setShowDesignGenerator] = useState(false);
=======
  const [autoTTS, setAutoTTS] = useState(false);
>>>>>>> origin/main

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
    if (isSubmitting) return; // Prevent multiple submissions
    
    setIsSubmitting(true);
<<<<<<< HEAD
    
    try {
      const cleanValue = <T,>(value: T): T | string | undefined => {
        if (value === null || value === undefined) return undefined;
        if (typeof value === 'string') return value.trim() || undefined;
        if (Array.isArray(value)) return value.length > 0 ? value : undefined;
        return value;
      };

    const formData: Record<string, unknown> = {};
    
    formData.personalInfo = {
      firstName: cleanValue(responses[1]),
      lastName: cleanValue(responses[2]),
      email: cleanValue(responses[3]),
      phoneNumber: cleanValue(responses[4])
    };
    
    formData.demographics = {
      gender: cleanValue(getMultipleOptionTexts(4, responses[4] as number[])),
      ethnicity: cleanValue(getMultipleOptionTexts(5, responses[5] as number[])),
      householdSize: cleanValue(getOptionText(6, responses[6] as number)),
      fosterCare: responses[7] === 1,
      disability: responses[8] === 1,
      disabilityDetails: cleanValue(responses[9])
    };
    
    formData.stylePreferences = {
      homeMessage: cleanValue(getMultipleOptionTexts(10, responses[10] as number[])),
      favoriteColors: cleanValue(getMultipleOptionTexts(11, responses[11] as number[])),
      styleInWords: cleanValue(responses[12]),
      styleAdmired: cleanValue(responses[13])
    };
    
    formData.comfortFactors = {
      peacePlace: cleanValue(responses[14]),
      peaceScent: cleanValue(getMultipleOptionTexts(15, responses[15] as number[])),
      fabrics: cleanValue(getMultipleOptionTexts(16, responses[16] as number[])),
      calmColors: cleanValue(getMultipleOptionTexts(17, responses[17] as number[]))
    };
    
    formData.environmentalPreferences = {
      artTypes: cleanValue(getMultipleOptionTexts(18, responses[18] as number[])),
      allergies: responses[19] === 1,
      allergyDetails: cleanValue(responses[20]),
      pets: responses[21] === 1,
      petDetails: cleanValue(responses[22])
    };
    
    formData.personalInterests = {
      roomWords: cleanValue(getMultipleOptionTexts(23, responses[23] as number[]))
    };
    
    formData.designElements = {
      patternPreference: cleanValue(responses[24]),
      patternTypes: cleanValue(getMultipleOptionTexts(25, responses[25] as number[])),
      roomWords: cleanValue(getMultipleOptionTexts(26, responses[26] as number[]))
    };
    
    if (responses[28]) {
      formData.additionalNotes = cleanValue(responses[28]);
    }
    
      const cleanedData = JSON.parse(JSON.stringify(formData, (_, value) => 
        value === null || value === undefined || value === '' || 
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === 'object' && value !== null && Object.keys(value).length === 0) ? undefined : value
      ));

      console.log('Submitting form with data:', cleanedData);
      
      const response = await axios.post(
        `http://localhost:5001/api/design-preferences/mock-user-id`,
        cleanedData,
        {
          params: { complete: 'true' },
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
=======
    try {
      console.log('Submitting quiz responses:', responses);
      // Only use fullName for name input
      const requestData = {
        personalInfo: {
          fullName: String(responses[1] || '').trim() || '',
          phoneNumber: String(responses[2] || '').trim() || '',
          email: String(responses[3] || '').trim() || ''
>>>>>>> origin/main
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
<<<<<<< HEAD

      console.log('Response from server:', response.data);
      
      if (response.data) {
        console.log('Form submitted successfully');
        setSubmittedData(cleanedData);
        setIsSubmitted(true);
      }
      
      return response.data;
    } catch (err) {
      console.error('Error submitting form:', err);
      // Show error to user
      alert('There was an error submitting your form. Please try again.');
      return { error: 'Submission failed' };
    } finally {
      setIsSubmitting(false); // Always reset submitting state
=======
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
>>>>>>> origin/main
    }
  };

  const renderPictureSelectionQuestion = (question: Question) => {
    return (
      <div className="picture-selection-options-container">
        <TextToSpeech
          text=""
          allOptions={question.options.map(opt => opt.name)}
          showAllOptions={true}
          showLabel={true}
          size="medium"
        />
        <div className="picture-selection-options" role="radiogroup" aria-labelledby={`question-${question.id}`}> 
          {question.options.map((option) => (
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
                {option.imageUrl ? (
                  <img 
                    src={option.imageUrl} 
                    alt={option.altText || option.name} 
                    className="option-image" 
                  />
                ) : (
                  <div className="option-image-placeholder">
                    <span>{option.name.charAt(0)}</span>
                  </div>
                )}
                {option.description && <span className="option-text">{option.description}</span>}
              </label>
            </div>
          ))}
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
  }

  // If form is submitted, show success message
  if (isSubmitted && submittedData) {
    if (showDesignGenerator) {
      return (
        <DesignGenerator 
          quizResponses={submittedData} 
          onBack={() => setShowDesignGenerator(false)}
        />
      );
    }

    return (
      <div className="quiz-complete">
        <h2>Thank you for completing the quiz!</h2>
        <p>Your responses have been recorded.</p>
        
        <div className="action-buttons">
          <button 
            onClick={() => setShowResponses(!showResponses)} 
            className="btn"
          >
            {showResponses ? 'Hide My Responses' : 'View My Responses'}
          </button>
          
          <button
            onClick={() => setShowDesignGenerator(true)}
            className="btn btn-primary"
          >
            Generate My Interior Design
          </button>
        </div>
        
        {showResponses && (
          <div className="responses-summary">
            <h3>Your Responses:</h3>
            <pre>{JSON.stringify(submittedData, null, 2)}</pre>
          </div>
        )}
      </div>
    );
  }

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

  return (
    <div className="quiz-container" onKeyDown={handleKeyDown} tabIndex={0}>
<<<<<<< HEAD
      <h1>Interior Design Style Quiz</h1>
      <form onSubmit={handleSubmit} className="quiz-form">
        <section className="question-section">
=======
      <form onSubmit={handleSubmit}>
        {renderAutoTTSToggle()}
        <section 
          ref={questionSectionRef}
          className={`question-section ${isTransitioning ? 
            (transitionDirection === 'next' ? 'question-exit' : 'question-enter') : 
            ''}`}
        >
>>>>>>> origin/main
          <div className="question-heading">
            <h2 id={`question-${currentQuestion.id}`}>
              <span className="question-number">{currentQuestion.number}</span>
            </h2>
            <div className="question-text-container">
            <p className="question-text">
              {currentQuestion.description}
            </p>
              <TextToSpeech 
                text={currentQuestion.description} 
                showAllOptions={false}
                autoRead={autoTTS}
              />
            </div>
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
