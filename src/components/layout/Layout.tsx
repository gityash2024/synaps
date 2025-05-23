import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import FloatingContactButton from '../common/FloatingContactButton';

const Layout: React.FC = () => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar />
      <div className="pt-16 md:pl-64">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
      <FloatingContactButton />
    </div>
  );
};

export default Layout; 