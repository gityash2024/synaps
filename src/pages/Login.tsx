import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import gsap from 'gsap';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // Animation refs
  const containerRef = useRef<HTMLDivElement>(null);
  const cloudRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Initialize clouds
  useEffect(() => {
    // Create cloud elements
    const createClouds = () => {
      if (!containerRef.current) return;
      
      // First remove any existing clouds
      cloudRefs.current.forEach((cloud) => {
        if (cloud && cloud.parentNode) {
          cloud.parentNode.removeChild(cloud);
        }
      });
      cloudRefs.current = [];
      
      const cloudCount = 15;
      for (let i = 0; i < cloudCount; i++) {
        const cloud = document.createElement('div');
        
        // Add classes for styling
        cloud.className = 'absolute rounded-full bg-white blur-md drop-shadow-md';
        
        // Set size - making them bigger
        cloud.style.width = `${80 + Math.random() * 150}px`;
        cloud.style.height = `${50 + Math.random() * 80}px`;
        
        // Set position - spread them out
        cloud.style.left = `${Math.random() * 100}%`;
        cloud.style.top = `${Math.random() * 100}%`;
        
        // Make them visible
        cloud.style.opacity = `${Math.random() * 0.3 + 0.5}`; // 50-80% opacity
        
        // Add subtle border to make them more visible
        cloud.style.border = '1px solid rgba(255, 255, 255, 0.3)';
        
        // Set z-index to be behind content
        cloud.style.zIndex = '1';
        
        // Add to container and keep reference
        containerRef.current.appendChild(cloud);
        cloudRefs.current.push(cloud as HTMLDivElement);
      }
    };
    
    createClouds();
    
    // Animate clouds with GSAP
    cloudRefs.current.forEach((cloud) => {
      if (!cloud) return;
      
      const duration = 25 + Math.random() * 35; // Longer animation duration
      const xDirection = Math.random() > 0.5 ? 1 : -1;
      
      gsap.to(cloud, {
        x: `${xDirection * (150 + Math.random() * 250)}px`,
        y: Math.random() * 120 - 60,
        opacity: Math.random() * 0.3 + 0.55, // Higher opacity in animation
        scale: Math.random() * 0.5 + 1.1, // Larger scale during animation
        duration: duration,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    });
    
    return () => {
      // Clean up animations
      cloudRefs.current.forEach((cloud) => {
        if (cloud && cloud.parentNode) {
          cloud.parentNode.removeChild(cloud);
        }
      });
      cloudRefs.current = [];
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen flex items-center bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Add a semi-transparent overlay to make clouds more visible */}
      <div className="absolute inset-0 bg-blue-900/5 backdrop-blur-[1px] z-0"></div>
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between z-10">
        {/* Logo and Branding */}
        <div className="w-full lg:w-1/2 mb-10 lg:mb-0 flex justify-center">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6">
              <svg width="160" height="160" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="120" height="120" rx="20" fill="#EBF4FF" />
                <path d="M36 84L60 36L84 84H36Z" fill="#3B82F6" />
                <circle cx="60" cy="60" r="20" fill="#1E40AF" />
                <path d="M40 40L80 80" stroke="#3B82F6" strokeWidth="4" />
                <path d="M40 80L80 40" stroke="#3B82F6" strokeWidth="4" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold text-blue-900 tracking-tight">Synaps</h1>
            <p className="mt-6 text-xl text-blue-700 max-w-md">
              Cloud Infrastructure Management Platform
            </p>
          </div>
        </div>
        
        {/* Login Card */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100 z-10">
            <div className="text-center">
              <div className="flex justify-center lg:hidden mb-6">
                <svg width="80" height="80" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="120" height="120" rx="20" fill="#EBF4FF" />
                  <path d="M36 84L60 36L84 84H36Z" fill="#3B82F6" />
                  <circle cx="60" cy="60" r="20" fill="#1E40AF" />
                  <path d="M40 40L80 80" stroke="#3B82F6" strokeWidth="4" />
                  <path d="M40 80L80 40" stroke="#3B82F6" strokeWidth="4" />
                </svg>
              </div>
              <h2 className="text-center text-3xl font-extrabold text-gray-900">Sign in to Synaps</h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Enter your credentials to access your account
              </p>
            </div>
            
            {error && (
              <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <div className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md space-y-4">
                <div>
                  <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
    
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                <h3 className="text-sm font-semibold text-blue-800 mb-1">Demo Credentials</h3>
                <div className="flex flex-col text-xs text-blue-700">
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span className="font-mono bg-white px-2 py-1 rounded border border-blue-200">email@demo.com</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Password:</span>
                    <span className="font-mono bg-white px-2 py-1 rounded border border-blue-200">123456789</span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 