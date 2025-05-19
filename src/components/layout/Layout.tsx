import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar />
      <div className="pt-16 md:pl-64">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout; 