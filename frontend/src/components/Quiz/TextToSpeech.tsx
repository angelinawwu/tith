import React, { useEffect } from 'react';
// Need to install @types/react-icons package to fix the type error
import { FaVolumeUp, FaList } from 'react-icons/fa';

interface TextToSpeechProps {
  text: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  allOptions?: string[];
  showAllOptions?: boolean;
  autoRead?: boolean;
  showLabel?: boolean;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({ 
  text, 
  size = 'medium', 
  className = '',
  allOptions,
  showAllOptions = false,
  autoRead = false,
  showLabel = true
}) => {
  const speak = (textToSpeak: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.9; // Slightly slower than default
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const speakAllOptions = () => {
    if (!allOptions) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Create a queue of utterances
    allOptions.forEach((option, index) => {
      const utterance = new SpeechSynthesisUtterance(option);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      // Add a small pause between options
      if (index > 0) {
        utterance.onstart = () => {
          // Add a 500ms pause before starting the next option
          setTimeout(() => {}, 500);
        };
      }
      
      window.speechSynthesis.speak(utterance);
    });
  };

  // Auto-read effect
  useEffect(() => {
    if (autoRead) {
      speak(text);
      if (allOptions && showAllOptions) {
        // Add a small delay before reading options
        setTimeout(() => {
          speakAllOptions();
        }, 1000);
      }
    }
  }, [text, allOptions, showAllOptions, autoRead]);

  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  };

  return (
    <div className="tts-container">
      {text && (
        <button
          onClick={() => speak(text)}
          className={`speaker-button ${sizeClasses[size]} ${className}`}
          aria-label="Read question aloud"
          title="Read question aloud"
        >
          <FaVolumeUp />
          {showLabel && <span className="tts-label">Read Question</span>}
        </button>
      )}
      {allOptions && showAllOptions && (
        <button
          onClick={speakAllOptions}
          className={`speaker-button ${sizeClasses[size]} ${className}`}
          aria-label="Read all options"
          title="Read all options"
        >
          <FaList />
          {showLabel && <span className="tts-label">Read All Options</span>}
        </button>
      )}
    </div>
  );
};

export default TextToSpeech; 