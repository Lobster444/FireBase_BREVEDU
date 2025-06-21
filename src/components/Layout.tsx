import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage={currentPage} />
      
      {/* Main Content Container */}
      <main className="relative">
        {/* Centered Container with Headspace-style spacing */}
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Optional Page Title Section */}
          {currentPage && currentPage !== 'home' && (
            <div className="py-6 border-b border-gray-100 mb-8">
              <h1 className="text-2xl font-bold text-gray-900 capitalize">
                {currentPage === 'brevedu-plus' ? 'BrevEdu+' : currentPage}
              </h1>
            </div>
          )}
          
          {/* Page Content with vertical spacing */}
          <div className="space-y-8 pb-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;