// src/layout/Layout.tsx
import React from 'react';
import Navbar from '../components/Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main>{children}</main>
      <footer className="mt-12 py-6 text-center text-gray-500 text-sm dark:text-gray-400">
        Bible Reader App &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default Layout;



