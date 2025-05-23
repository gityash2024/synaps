import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { XMarkIcon, Bars3Icon, ChevronRightIcon } from '@heroicons/react/24/outline';
import LogoutConfirmModal from '../modals/LogoutConfirmModal';
import { useAuth } from '../../context/AuthContext';

interface NavItemProps {
  to: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

// Animation variants removed as we don't need them anymore

const NavItem: React.FC<NavItemProps> = ({ 
  to, 
  label, 
  isActive, 
  onClick, 
  icon, 
  children 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  
  const toggleExpand = (e: React.MouseEvent) => {
    if (children) {
      e.preventDefault();
      e.stopPropagation();
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="relative">
      <Link
        to={to}
        className={`group flex items-center px-4 py-3 rounded-lg transition-all duration-300 relative overflow-hidden ${
          isActive 
            ? 'text-white font-medium' 
            : 'text-gray-300 hover:text-white'
        }`}
        onClick={(e) => {
          if (children) {
            toggleExpand(e);
          } else {
            onClick?.();
          }
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background effect */}
        <div className={`absolute inset-0 rounded-lg transition-all duration-300 z-0 ${
          isActive 
            ? 'bg-gradient-to-r from-primary-mint to-primary-teal' 
            : isHovered 
              ? 'bg-gradient-to-r from-gray-800 to-gray-700 opacity-50' 
              : 'bg-transparent'
        }`}></div>
        
        {/* Icon with animation */}
        {icon && (
          <div className={`relative z-10 flex items-center justify-center w-10 h-10 transition-transform duration-300 ${
            isHovered && !isActive ? 'scale-110' : ''
          }`}>
            {icon}
          </div>
        )}
        
        {/* Label with hover animation */}
        <span className="relative z-10 font-montserrat ml-3 transition-all duration-300 whitespace-nowrap">
          {label}
        </span>
        
        {/* Expand indicator for nested menus */}
        {children && (
          <ChevronRightIcon 
            className={`ml-auto h-5 w-5 transition-transform duration-300 relative z-10 ${
              isExpanded ? 'rotate-90' : ''
            }`} 
          />
        )}

        {/* Animated highlight bar */}
        <div 
          className={`absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-300 ${
            isActive ? 'w-full opacity-100' : isHovered ? 'w-1/2 opacity-50' : 'w-0 opacity-0'
          }`}
        ></div>
      </Link>

      {/* Nested menu items with slide animation */}
      {children && (
        <div 
          className={`overflow-hidden transition-all duration-300 pl-4 ${
            isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {children}
        </div>
      )}
    </div>
  );
};

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [animatingLogo, setAnimatingLogo] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  // Handle click outside to close sidebar on mobile
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  const closeSidebar = () => {
    setIsOpen(false);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowLogoutModal(false);
  };

  const triggerLogoAnimation = () => {
    setAnimatingLogo(true);
    setTimeout(() => setAnimatingLogo(false), 1000);
  };
  
  // Custom global styles - replacing JSX style tag
  const customStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 4px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.3);
    }
    
    @keyframes spin-slow {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .animate-spin-slow {
      animation: spin-slow 1.5s ease-in-out;
    }
  `;

  // Add style element to document
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = customStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  return (
    <>
      {/* Mobile toggle button with pulse animation */}
      <button 
        className="md:hidden fixed top-4 left-4 z-30 p-2 rounded-full bg-primary-darkBlue shadow-lg hover:shadow-primary-teal/20 transition-all duration-300 animate-pulse"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <Bars3Icon className="w-6 h-6 text-white" />
      </button>
      
      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-20 bg-gradient-to-b from-gray-900 via-gray-800 to-primary-darkBlue shadow-xl transform transition-all duration-500 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } md:w-64`}
        style={{
          width: '240px',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-4 py-5 border-b border-gray-700/50">
            <Link 
              to="/" 
              className="flex items-center transition-all duration-300"
              onClick={triggerLogoAnimation}
            >
              <div 
                className={`transition-all duration-500 ${
                  animatingLogo ? 'animate-spin-slow' : ''
                }`}
              >
                <svg width="40" height="40" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-transform duration-500 ${animatingLogo ? 'scale-110' : ''}`}>
                  <rect width="120" height="120" rx="20" fill="#EBF7F4" />
                  <path d="M36 84L60 36L84 84H36Z" fill="#7DD3C0" />
                  <circle cx="60" cy="60" r="20" fill="#155366" />
                  <path d="M40 40L80 80" stroke="#4DA892" strokeWidth="4" />
                  <path d="M40 80L80 40" stroke="#4DA892" strokeWidth="4" />
                </svg>
              </div>
              <span className="ml-3 text-xl font-bold font-montserrat text-white transition-opacity duration-300 ease-in-out">
                Synapse
              </span>
            </Link>
            
            <div className="flex space-x-1">
              {/* Close button (mobile only) */}
              <button 
                className="md:hidden p-1 rounded-md hover:bg-gray-700/50"
                onClick={toggleSidebar}
                aria-label="Close sidebar"
              >
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>
          
          {/* Navigation Links with glass-morphic effect */}
          <nav className="flex-1 px-3 py-5 space-y-2 overflow-y-auto custom-scrollbar">
            <NavItem 
              to="/dashboard" 
              label="Dashboard" 
              isActive={isActive('/dashboard')}
              onClick={closeSidebar}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              }
            />
            <NavItem 
              to="/projects" 
              label="Projects" 
              isActive={isActive('/projects')}
              onClick={closeSidebar}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              }
            />
            <NavItem 
              to="/admin" 
              label="Admin" 
              isActive={isActive('/admin')}
              onClick={closeSidebar}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              }
            />
            <NavItem 
              to="/contact-us" 
              label="Contact Us" 
              isActive={isActive('/contact-us')}
              onClick={closeSidebar}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />
          </nav>
          
          {/* User profile section with animated highlight */}
          <div className="px-4 py-3 transition-all duration-300">
            <div className="p-2 rounded-lg bg-gray-800/50 backdrop-blur-sm transition-all duration-300 flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary-mint/20 flex items-center justify-center text-primary-mint font-medium">
                S
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Synapse User</p>
                <p className="text-xs text-gray-400">admin@synapse.com</p>
              </div>
            </div>
          </div>
          
          {/* Logout button with hover effect */}
          <div className="p-4 border-t border-gray-700/50 transition-all duration-300">
            <button
              onClick={handleLogoutClick}
              className="group relative overflow-hidden w-full flex items-center px-4 py-3 rounded-lg text-gray-300 hover:text-white transition-colors"
            >
              {/* Animated hover background */}
              <div className="absolute inset-0 bg-red-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
              
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              
              <span className="ml-3 font-montserrat relative z-10">Logout</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Animated overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 z-10 bg-black backdrop-blur-sm transition-opacity duration-300 ease-in-out"
          style={{
            opacity: isOpen ? 0.7 : 0,
            backdropFilter: 'blur(4px)'
          }}
          onClick={closeSidebar}
        />
      )}

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default Sidebar; 