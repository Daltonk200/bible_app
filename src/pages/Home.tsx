// src/pages/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
          Welcome to Bible Reader
        </h1>
        <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
          Explore different Bible versions, books, and chapters with a clean, modern interface.
        </p>
        <Link
          to="/read"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition duration-200"
        >
          Start Reading
        </Link>
      </div>
      
      <div className="mt-16 grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Multiple Versions</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Access various Bible translations including KJV, NIV, ESV, and more.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Simple Navigation</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Easily navigate between books and chapters with an intuitive interface.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Search Scripture</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Find specific verses with keyword search functionality.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;

