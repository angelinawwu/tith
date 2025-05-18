import React, { useState } from 'react';
import DesignResults from '../DesignResults/DesignResults';

const DesignGenerator: React.FC = () => {
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = () => {
    console.log('Submit clicked, current showResults:', showResults);
    setShowResults(true);
    console.log('After setShowResults, showResults:', showResults);
  };

  console.log('Current showResults state:', showResults);

  if (showResults) {
    console.log('Rendering results page');
    return <DesignResults onStartOver={() => setShowResults(false)} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={handleSubmit}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Generate My Interior Design
      </button>
    </div>
  );
};

export default DesignGenerator; 