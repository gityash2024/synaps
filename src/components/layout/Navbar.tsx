import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import LogoutConfirmModal from '../modals/LogoutConfirmModal';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-10 bg-white shadow-sm h-16 flex items-center justify-end pl-64 md:pl-64 pr-6">
      <div className="flex items-center space-x-4">
        {user && (
          <>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                <span className="text-blue-600 font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
            </div>
            
            <button
              onClick={() => setShowLogoutModal(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                />
              </svg>
              Logout
            </button>
          </>
        )}
      </div>

      <LogoutConfirmModal 
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default Navbar; 