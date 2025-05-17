import { useState } from 'react';
import { MousePointerClick } from 'lucide-react';

import './LandingPageStyle.css';

interface LandingPageAppProps {
  onTransitionComplete: () => void;
}

const LandingPage = ({ onTransitionComplete }: LandingPageAppProps) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleClick = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Start the transition
    onTransitionComplete();
  };

  return (
    <div 
      className={`landing-page-container ${isTransitioning ? 'slide-up' : ''}`} 
      onClick={handleClick}
    >
      <div className="landing-page-content">
        <div className="landing-page-left-container">
          <img src={'/images/TITH-logo-offwhite.png'} alt="Logo" className="landing-page-logo" />
        </div>
        <div className="landing-page-right-container">
          <h1 className="landing-page-title">Welcome to<br />Tori's Style Quiz</h1>
          <p className="landing-page-description">
            Create a vision for your dream home
          </p>
          <div className="start-section">
            <MousePointerClick className="start-section-icon" />
            <p className="start-text">Click anywhere to start</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;