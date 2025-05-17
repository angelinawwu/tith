import React from 'react';
import './ProgressBarStyle.css';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  // Calculate progress percentage
  const progressPercentage = (currentStep / (totalSteps - 1)) * 100;
  
  return (
    <div className="progress-bar-container">
      <div 
        className="progress-bar" 
        style={{ width: `${progressPercentage}%` }}
      />
    </div>
  );
};

export default ProgressBar; 