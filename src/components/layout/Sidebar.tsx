import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';

interface NavItemProps {
  to: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, label, isActive, onClick }) => {
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
        isActive 
          ? 'bg-blue-100 text-blue-700' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
      onClick={onClick}
    >
      <span>{label}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  const closeSidebar = () => {
    setIsOpen(false);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  return (
    <>
      {/* Mobile toggle button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-30 p-2 rounded-md bg-white shadow-md"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <Bars3Icon className="w-6 h-6 text-gray-700" />
      </button>
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-20 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-4 py-4 border-b">
            <Link to="/" className="flex items-center">
              <svg width="40" height="40" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                <rect width="120" height="120" rx="20" fill="#EBF4FF" />
                <path d="M36 84L60 36L84 84H36Z" fill="#3B82F6" />
                <circle cx="60" cy="60" r="20" fill="#1E40AF" />
                <path d="M40 40L80 80" stroke="#3B82F6" strokeWidth="4" />
                <path d="M40 80L80 40" stroke="#3B82F6" strokeWidth="4" />
              </svg>
              <span className="text-xl font-bold text-blue-600">Synaps</span>
            </Link>
            <button 
              className="md:hidden p-1 rounded-md hover:bg-gray-100"
              onClick={toggleSidebar}
              aria-label="Close sidebar"
            >
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            <NavItem 
              to="/dashboard" 
              label="Dashboard" 
              isActive={isActive('/dashboard')}
              onClick={closeSidebar}
            />
            <NavItem 
              to="/projects" 
              label="Projects" 
              isActive={isActive('/projects')}
              onClick={closeSidebar}
            />
            <NavItem 
              to="/admin" 
              label="Admin" 
              isActive={isActive('/admin')}
              onClick={closeSidebar}
            />
          </nav>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 z-10 bg-black bg-opacity-50"
          onClick={closeSidebar}
        />
      )}
    </>
  );
};

export default Sidebar; 