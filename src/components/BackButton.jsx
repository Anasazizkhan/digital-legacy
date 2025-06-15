import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './BackButton.css';

const BackButton = ({ className = '' }) => {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate(-1)} 
      className={`back-button ${className}`}
      aria-label="Go back"
    >
      <FaArrowLeft className="back-icon" />
      <span>Back</span>
    </button>
  );
};

export default BackButton; 