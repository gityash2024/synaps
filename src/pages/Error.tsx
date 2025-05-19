import React from 'react';
import { Link } from 'react-router-dom';

const Error: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-9xl font-extrabold text-blue-600">404</h1>
          <h2 className="text-3xl font-bold text-gray-900">Page Not Found</h2>
          <p className="text-gray-600 mt-4">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <div className="mt-8">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Go back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error; 