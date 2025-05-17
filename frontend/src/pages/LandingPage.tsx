import LandingPageApp from '../components/LandingPage/LandingPageApp';
import { useNavigate } from 'react-router-dom';

interface LandingPageProps {
  onTransitionComplete?: () => void;
}

const LandingPage = ({ onTransitionComplete }: LandingPageProps) => {
  const navigate = useNavigate();
  
  const handleTransition = () => {
    if (onTransitionComplete) {
      onTransitionComplete();
    } else {
      // Default behavior if no transition callback provided
      setTimeout(() => {
        navigate('/quiz');
      }, 800);
    }
  };

  return (
    <div className="flex flex-col min-h-full w-full top-0 h-full">
      <LandingPageApp onTransitionComplete={handleTransition} />
    </div>
  );
};

export default LandingPage;
