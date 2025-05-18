import React from 'react';
import { useNavigate } from 'react-router-dom';
import TextToSpeech from '../Quiz/TextToSpeech';

interface DesignResultsProps {
  onStartOver: () => void;
}

const DesignResults: React.FC<DesignResultsProps> = ({ onStartOver }) => {
  const navigate = useNavigate();
  
  const goToLandingPage = () => {
    navigate('/');
  };
  
  const leftAlignStyle = {
    textAlign: 'left' as const,
    marginLeft: '20px'
  };
  
  const headingStyle = {
    textAlign: 'left' as const,
    margin: '20px 40px 30px 40px',
    padding: '15px',
    borderRadius: '8px'
  };
  
  const containerStyle = {
    textAlign: 'left' as const,
    padding: '30px'
  };
  
  const whiteBoxStyle = {
    textAlign: 'left' as const,
    padding: '30px',
    backgroundColor: '#F9F0E3',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    border: '3px solid #640A09',
    marginBottom: '40px',
    width: '100%'
  };
  
  const headerWithTTSStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  };
  
  const getColorSchemeText = () => {
    return "Color Scheme. Based on your preferences, we recommend a warm and inviting color palette: Use Warm Beige as your primary wall color. Incorporate Dusty Rose in accent pieces and textiles. Add Charcoal elements for contrast and definition.";
  };
  
  const getFurnitureStyleText = () => {
    return "Furniture Style. We recommend a blend of modern and traditional pieces: Mid-century modern sofa with clean lines. Traditional wooden coffee table with modern accents. Contemporary accent chairs with plush upholstery. Minimalist entertainment unit with hidden storage.";
  };
  
  const getLightingPlanText = () => {
    return "Lighting Plan. Create the perfect ambiance with these lighting elements: Statement chandelier in the living room. Floor lamps for task lighting. Wall sconces for ambient lighting. Smart bulbs for customizable mood lighting.";
  };
  
  const getDecorativeElementsText = () => {
    return "Decorative Elements. Add personality to your space with these finishing touches: Large abstract art piece for the main wall. Textured throw pillows in complementary colors. Indoor plants for natural elements. Decorative mirrors to enhance light and space.";
  };
  
  const getNextStepsText = () => {
    return "Next Steps. Ready to bring your design to life? Here's what you can do next: Schedule a consultation with our interior designers. Browse our curated collection of recommended products. Download your personalized design guide. Share your design preferences with friends and family.";
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg" style={containerStyle}>
      <h2 className="text-3xl font-bold text-gray-800" style={headingStyle}>Your Personalized Interior Design Recommendations!</h2>
      
      <div className="space-y-16" style={leftAlignStyle}>
        {/* Color Scheme */}
        <div className="rounded-lg" style={whiteBoxStyle}>
          <div style={headerWithTTSStyle}>
            <h3 className="text-xl font-semibold text-gray-800 mb-4" style={leftAlignStyle}>Color Scheme</h3>
            <TextToSpeech text={getColorSchemeText()} size="medium" showLabel={false} />
          </div>
          <p className="text-gray-600 mb-4" style={leftAlignStyle}>Based on your preferences, we recommend a warm and inviting color palette:</p>
          <ul className="list-disc text-gray-600 space-y-2 pl-6 mb-6" style={leftAlignStyle}>
            <li style={leftAlignStyle}>Use Warm Beige as your primary wall color</li>
            <li style={leftAlignStyle}>Incorporate Dusty Rose in accent pieces and textiles</li>
            <li style={leftAlignStyle}>Add Charcoal elements for contrast and definition</li>
          </ul>
        </div>

        {/* Furniture Style */}
        <div className="rounded-lg" style={whiteBoxStyle}>
          <div style={headerWithTTSStyle}>
            <h3 className="text-xl font-semibold text-gray-800 mb-4" style={leftAlignStyle}>Furniture Style</h3>
            <TextToSpeech text={getFurnitureStyleText()} size="medium" showLabel={false} />
          </div>
          <p className="text-gray-600 mb-4" style={leftAlignStyle}>We recommend a blend of modern and traditional pieces:</p>
          <ul className="list-disc text-gray-600 space-y-2 pl-6" style={leftAlignStyle}>
            <li style={leftAlignStyle}>Mid-century modern sofa with clean lines</li>
            <li style={leftAlignStyle}>Traditional wooden coffee table with modern accents</li>
            <li style={leftAlignStyle}>Contemporary accent chairs with plush upholstery</li>
            <li style={leftAlignStyle}>Minimalist entertainment unit with hidden storage</li>
          </ul>
        </div>

        {/* Lighting Recommendations */}
        <div className="rounded-lg" style={whiteBoxStyle}>
          <div style={headerWithTTSStyle}>
            <h3 className="text-xl font-semibold text-gray-800 mb-4" style={leftAlignStyle}>Lighting Plan</h3>
            <TextToSpeech text={getLightingPlanText()} size="medium" showLabel={false} />
          </div>
          <p className="text-gray-600 mb-4" style={leftAlignStyle}>Create the perfect ambiance with these lighting elements:</p>
          <ul className="list-disc text-gray-600 space-y-2 pl-6" style={leftAlignStyle}>
            <li style={leftAlignStyle}>Statement chandelier in the living room</li>
            <li style={leftAlignStyle}>Floor lamps for task lighting</li>
            <li style={leftAlignStyle}>Wall sconces for ambient lighting</li>
            <li style={leftAlignStyle}>Smart bulbs for customizable mood lighting</li>
          </ul>
        </div>

        {/* Decorative Elements */}
        <div className="rounded-lg" style={whiteBoxStyle}>
          <div style={headerWithTTSStyle}>
            <h3 className="text-xl font-semibold text-gray-800 mb-4" style={leftAlignStyle}>Decorative Elements</h3>
            <TextToSpeech text={getDecorativeElementsText()} size="medium" showLabel={false} />
          </div>
          <p className="text-gray-600 mb-4" style={leftAlignStyle}>Add personality to your space with these finishing touches:</p>
          <ul className="list-disc text-gray-600 space-y-2 pl-6" style={leftAlignStyle}>
            <li style={leftAlignStyle}>Large abstract art piece for the main wall</li>
            <li style={leftAlignStyle}>Textured throw pillows in complementary colors</li>
            <li style={leftAlignStyle}>Indoor plants for natural elements</li>
            <li style={leftAlignStyle}>Decorative mirrors to enhance light and space</li>
          </ul>
        </div>

        {/* Next Steps */}
        <div className="rounded-lg" style={whiteBoxStyle}>
          <div style={headerWithTTSStyle}>
            <h3 className="text-xl font-semibold text-blue-800 mb-4" style={leftAlignStyle}>Next Steps</h3>
            <TextToSpeech text={getNextStepsText()} size="medium" showLabel={false} />
          </div>
          <p className="text-blue-600 mb-4" style={leftAlignStyle}>Ready to bring your design to life? Here's what you can do next:</p>
          <ul className="list-disc text-blue-600 space-y-2 pl-6" style={leftAlignStyle}>
            <li style={leftAlignStyle}>Schedule a consultation with our interior designers</li>
            <li style={leftAlignStyle}>Browse our curated collection of recommended products</li>
            <li style={leftAlignStyle}>Download your personalized design guide</li>
            <li style={leftAlignStyle}>Share your design preferences with friends and family</li>
          </ul>
        </div>
      </div>

      <div className="mt-16 flex" style={{ justifyContent: 'flex-start', marginLeft: '20px' }}>
        <button
          onClick={goToLandingPage || onStartOver}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Start Over
        </button>
      </div>
    </div>
  );
};

export default DesignResults; 