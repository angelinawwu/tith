import './HeaderStyle.css';

const Header = () => {
  return (
    <div className="header-container">
      <img src="/images/TITH-logo-offwhite.png" alt="Tith Logo" className="header-logo" />
      <h1 className="header-title">Tori's Style Quiz</h1>
    </div>
  );
};

export default Header;