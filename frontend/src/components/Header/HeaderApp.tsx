import './HeaderStyle.css';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className="header-container">
      <img 
        src="/images/TITH-logo-offwhite.png" 
        alt="Tith Logo" 
        className="header-logo" 
        onClick={handleLogoClick}
      />
      <h1 className="header-title">Tori's Style Quiz</h1>
    </div>
  );
};

export default Header;