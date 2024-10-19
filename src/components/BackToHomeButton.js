import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackToHomeButton = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/home');
  };

  return (
    <button 
      onClick={handleBackToHome} 
      className="fixed top-16 left-2 bg-accent text-white p-2 rounded text-sm hover:bg-opacity-80 transition z-50"
    >
      ← {/* Flèche unicode */}
    </button>
  );
};

export default BackToHomeButton;
