import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Recommendations.css';

interface RecommendationMetadata {
  description?: string;
  tags?: string[];
  imageUrl?: string;
  source?: string;
  timestamp?: string;
}

interface RecommendationItem {
  id: string;
  score: number;
  metadata?: RecommendationMetadata;
}

interface RecommendationsProps {
  styleSummary: string;
  onBack?: () => void;
}

const Recommendations: React.FC<RecommendationsProps> = ({ styleSummary, onBack }) => {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response = await axios.post('http://localhost:5001/api/vector/similar/text', {
          text: styleSummary,
          limit: 6
        });
        setRecommendations(response.data.matches || []);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError('Failed to load recommendations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (styleSummary) {
      fetchRecommendations();
    }
  }, [styleSummary]);

  if (loading) {
    return (
      <div className="recommendations-container">
        <div className="loading-spinner"></div>
        <p>Finding your perfect design matches...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommendations-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations-container">
      <div className="recommendations-header">
        <h2>Recommended For You</h2>
        <p className="style-summary">Based on your style: "{styleSummary}"</p>
      </div>
      
      <div className="recommendations-grid">
        {recommendations.map((item) => (
          <div key={item.id} className="recommendation-card">
            <div className="recommendation-image">
              {item.metadata?.imageUrl ? (
                <img 
                  src={item.metadata.imageUrl} 
                  alt={item.metadata.description || 'Design recommendation'}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/300x200?text=Design+Preview';
                  }}
                />
              ) : (
                <div className="image-placeholder">
                  <span>Preview</span>
                </div>
              )}
            </div>
            <div className="recommendation-details">
              {item.metadata?.description && (
                <p className="description">{item.metadata.description}</p>
              )}
              {item.metadata?.tags && item.metadata.tags.length > 0 && (
                <div className="tags">
                  {item.metadata.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              )}
              <div className="similarity-score">
                Match: {Math.round(item.score * 100)}%
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {onBack && (
        <div className="recommendations-actions">
          <button onClick={onBack} className="back-button">
            Back to Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
