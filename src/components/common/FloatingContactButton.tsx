import React from 'react';
import { useNavigate } from 'react-router-dom';

const FloatingContactButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/contact-us')}
      className="fixed bottom-6 right-6 bg-primary-mint hover:bg-primary-teal text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:shadow-xl z-50 flex items-center justify-center"
      aria-label="Contact Support"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    </button>
  );
};

export default FloatingContactButton; 