import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import LogoutConfirmModal from '../modals/LogoutConfirmModal';

// Mock notification data
const mockNotifications = [
  {
    id: 1,
    message: "Your VM deployment has completed",
    time: "10 minutes ago",
    read: false
  },
  {
    id: 2,
    message: "Storage disk allocation increased",
    time: "1 hour ago",
    read: false
  },
  {
    id: 3,
    message: "System update scheduled for next week",
    time: "3 hours ago",
    read: true
  },
  {
    id: 4,
    message: "New security policy applied to your project",
    time: "1 day ago",
    read: true
  }
];

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
  };

  const markAsRead = (id?: number) => {
    if (id) {
      // Mark specific notification as read
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
    } else {
      // Mark all as read
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    }
  };
  
  // Close notifications dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-10 bg-white shadow-sm h-16 flex items-center justify-end pl-64 md:pl-64 pr-6">
      <div className="flex items-center space-x-4">
        {user && (
          <>
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-primary-darkBlue transition-colors rounded-full hover:bg-primary-mint/10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                
                {/* Unread badge */}
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-secondary-coral text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {/* Notifications dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50">
                  <div className="flex items-center justify-between border-b px-4 py-2">
                    <h3 className="font-medium text-gray-700 font-montserrat">Notifications</h3>
                    <button 
                      onClick={() => markAsRead()} 
                      className="text-xs text-primary-teal hover:text-primary-darkBlue font-montserrat"
                    >
                      Mark all as read
                    </button>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div key={notification.id} className={`px-4 py-3 border-b hover:bg-gray-50 ${!notification.read ? 'bg-primary-mint/5' : ''}`}>
                          <div className="flex items-center justify-between">
                            <p className={`text-sm ${!notification.read ? 'font-medium' : 'text-gray-600'}`}>
                              {notification.message}
                            </p>
                            <button 
                              onClick={() => markAsRead(notification.id)} 
                              className="ml-2 text-primary-mint hover:text-primary-teal"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500">
                        No notifications
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-lg bg-primary-mint bg-opacity-20 flex items-center justify-center mr-2">
                <span className="text-primary-darkBlue font-montserrat font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-primary-darkBlue font-montserrat">{user.name}</span>
            </div>
            
            <button
              onClick={() => setShowLogoutModal(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-darkBlue rounded-md hover:bg-opacity-90 transition-colors duration-200 flex items-center"
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