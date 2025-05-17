import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page-container">
      <div className="landing-page-content">
        <h1 className="landing-page-title">Welcome to the Landing Page</h1>
        <p className="landing-page-description">
          This is the landing page for the application.
        </p>
        <button 
          className="start-button"
          onClick={() => navigate('/quiz')}
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default LandingPage;