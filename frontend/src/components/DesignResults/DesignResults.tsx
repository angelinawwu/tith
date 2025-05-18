import React from 'react';
import { useNavigate } from 'react-router-dom';

interface DesignResultsProps {
  onStartOver: () => void;
}

const DesignResults: React.FC<DesignResultsProps> = ({ onStartOver }) => {
  const navigate = useNavigate();
  
  const goToLandingPage = () => {
    navigate('/');
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Personalized Interior Design Recommendations</h2>
      
      <div className="space-y-8">
        {/* Color Scheme */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Color Scheme</h3>
          <p className="text-gray-600 mb-4">Based on your preferences, we recommend a warm and inviting color palette:</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-24 bg-[#E6B89C] rounded-lg flex items-center justify-center text-white font-medium">Warm Beige</div>
            <div className="h-24 bg-[#9B8281] rounded-lg flex items-center justify-center text-white font-medium">Dusty Rose</div>
            <div className="h-24 bg-[#4A4A4A] rounded-lg flex items-center justify-center text-white font-medium">Charcoal</div>
          </div>
        </div>

        {/* Furniture Style */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Furniture Style</h3>
          <p className="text-gray-600 mb-4">We recommend a blend of modern and traditional pieces:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Mid-century modern sofa with clean lines</li>
            <li>Traditional wooden coffee table with modern accents</li>
            <li>Contemporary accent chairs with plush upholstery</li>
            <li>Minimalist entertainment unit with hidden storage</li>
          </ul>
        </div>

        {/* Lighting Recommendations */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Lighting Plan</h3>
          <p className="text-gray-600 mb-4">Create the perfect ambiance with these lighting elements:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Statement chandelier in the living room</li>
            <li>Floor lamps for task lighting</li>
            <li>Wall sconces for ambient lighting</li>
            <li>Smart bulbs for customizable mood lighting</li>
          </ul>
        </div>

        {/* Decorative Elements */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Decorative Elements</h3>
          <p className="text-gray-600 mb-4">Add personality to your space with these finishing touches:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Large abstract art piece for the main wall</li>
            <li>Textured throw pillows in complementary colors</li>
            <li>Indoor plants for natural elements</li>
            <li>Decorative mirrors to enhance light and space</li>
          </ul>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">Next Steps</h3>
          <p className="text-blue-600 mb-4">Ready to bring your design to life? Here's what you can do next:</p>
          <ul className="list-disc list-inside text-blue-600 space-y-2">
            <li>Schedule a consultation with our interior designers</li>
            <li>Browse our curated collection of recommended products</li>
            <li>Download your personalized design guide</li>
            <li>Share your design preferences with friends and family</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={goToLandingPage}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Return Home
        </button>
      </div>
    </div>
  );
};

export default DesignResults; 