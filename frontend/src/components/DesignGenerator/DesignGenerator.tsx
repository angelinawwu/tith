import { useState, useEffect } from 'react';
import axios from 'axios';
import './DesignGenerator.css';

// Define Axios error type
type AxiosErrorType = {
  response?: {
    data?: {
      error?: string;
      details?: string;
    };
  };
  message?: string;
};

interface QuizResponses {
  personalInfo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
  };
  demographics?: {
    gender?: string | string[];
    ethnicity?: string | string[];
    householdSize?: string | number;
    fosterCare?: boolean;
    // Add other known properties here
    [key: string]: string | string[] | number | boolean | undefined;
  };
  stylePreference?: string;
  colorScheme?: string;
  roomType?: string;
  budget?: string;
  additionalNotes?: string;
  [key: string]: string | string[] | number | boolean | undefined | { [key: string]: unknown };
}

interface DesignGeneratorProps {
  quizResponses: QuizResponses;
  onBack: () => void;
}

interface GeneratedDesign {
  description: string;
  preferences: {
    style: string;
    colorScheme: string;
    roomType: string;
    budget: string;
  };
  imageUrl?: string;
}

const DesignGenerator: React.FC<DesignGeneratorProps> = ({ quizResponses, onBack }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [design, setDesign] = useState<GeneratedDesign | null>(null);
  const [error, setError] = useState<{message: string; details?: string} | null>(null);

  useEffect(() => {
    const generateDesign = async () => {
      console.log('Starting design generation with responses:', quizResponses);
      setIsGenerating(true);
      setError(null);
      
      try {
        const response = await axios.post<{
          success: boolean;
          design?: GeneratedDesign;
          error?: string;
        }>('/api/api/generate-design', {
          responses: quizResponses
        });
        
        console.log('Design generation response:', response.data);
        
        if (response.data.success && response.data.design) {
          setDesign(response.data.design);
        } else {
          setError({
            message: 'Failed to generate design',
            details: response.data.error || 'No design was generated. Please try again.'
          });
        }
      } catch (error) {
        console.error('Error generating design:', error);
        setError({
          message: 'An error occurred while generating your design',
          details: (error as AxiosErrorType).response?.data?.error || (error as Error).message || 'Please try again later.'
        });
      } finally {
        setIsGenerating(false);
      }
    };

    generateDesign();
  }, [quizResponses]);

  const regenerateDesign = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await axios.post<{
        success: boolean;
        design?: GeneratedDesign;
        error?: string;
      }>('/api/api/generate-design', {
        responses: quizResponses
      });
      
      if (response.data.success && response.data.design) {
        setDesign(response.data.design);
      } else {
        setError({
          message: 'Failed to regenerate design',
          details: response.data.error || 'No design was generated. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error regenerating design:', error);
      setError({
        message: 'An error occurred while regenerating your design',
        details: (error as AxiosErrorType).response?.data?.error || (error as Error).message || 'Please try again.'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="design-generator loading">
        <div className="spinner"></div>
        <p>Generating your custom interior design...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="design-generator error">
        <h3>Something went wrong</h3>
        <p className="error-message">{error.message}</p>
        {error.details && (
          <details className="error-details">
            <summary>Details</summary>
            <pre>{error.details}</pre>
          </details>
        )}
        <div className="error-actions">
          <button onClick={regenerateDesign} className="btn">
            Try Again
          </button>
          <button onClick={onBack} className="btn btn-secondary">
            Back to Quiz
          </button>
        </div>
      </div>
    );
  }

  if (!design) {
    return (
      <div className="design-generator">
        <p>No design generated yet.</p>
        <button onClick={onBack} className="btn">
          Back to Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="design-generator">
      <h2>Your Custom Interior Design</h2>
      
      <div className="design-preferences">
        <h3>Based on your preferences:</h3>
        <ul>
          <li><strong>Style:</strong> {design.preferences.style}</li>
          <li><strong>Color Scheme:</strong> {design.preferences.colorScheme}</li>
          <li><strong>Room Type:</strong> {design.preferences.roomType}</li>
          <li><strong>Budget:</strong> {design.preferences.budget}</li>
        </ul>
      </div>

      <div className="design-result">
        <h3>Design Concept</h3>
        <div className="design-description">
          {design.description.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        
        {design.imageUrl && (
          <div className="design-image">
            <img src={design.imageUrl} alt="Generated interior design" />
          </div>
        )}
      </div>

      <div className="design-actions">
        <button onClick={regenerateDesign} className="btn">
          Generate New Design
        </button>
        <button onClick={onBack} className="btn btn-secondary">
          Back to Quiz
        </button>
      </div>
    </div>
  );
};

export default DesignGenerator;
