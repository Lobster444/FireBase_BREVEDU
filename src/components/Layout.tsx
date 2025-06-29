import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage }) => {
  return (
    <div className="min-h-screen bg-white">
      <Header currentPage={currentPage} />
      
      {/* Main Content Container */}
      <main className="relative px-4 sm:px-8">
        {/* Centered Container with Headspace-style spacing */}
        <div className="max-w-screen-2xl mx-auto">
          {/* Optional Page Title Section */}
          {currentPage && currentPage !== 'home' && (
            <div className="py-6 sm:py-8 border-b border-black/5 mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-black capitalize">
                {currentPage === 'brevedu-plus' ? 'BrevEdu+' : currentPage}
              </h1>
            </div>
          )}
          
          {/* Page Content with vertical spacing */}
          <div className="space-y-8 sm:space-y-12 pb-8 sm:pb-12">
            {children}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;