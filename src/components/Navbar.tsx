// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
// import { useDarkMode } from '../hooks/useDarkMode';
// import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
//   const { theme, toggleTheme } = useDarkMode();

  return (
    <nav className="bg-white shadow-md dark:bg-gray-800 dark:text-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 font-bold text-xl">
              Bible Reader
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              Home
            </Link>
            <Link to="/read" className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              Read
            </Link>
            {/* <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button> */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;



