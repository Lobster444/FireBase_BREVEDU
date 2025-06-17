import React from 'react';
import Header from './Header';
import MobileNavigation from './MobileNavigation';

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage }) => {
  return (
    <div className="min-h-screen bg-primary text-text-light">
      <Header currentPage={currentPage} />
      
      {/* Mobile Logo Header */}
      <div className="md:hidden flex items-center justify-center p-4 border-b border-neutral-gray/20">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-accent-yellow rounded flex items-center justify-center">
            <span className="text-text-dark font-bold text-small">B</span>
          </div>
          <h1 className="text-h3 text-text-light font-semibold">BrevEdu</h1>
        </div>
      </div>

      <main className="pb-20 md:pb-0">
        {children}
      </main>

      <MobileNavigation currentPage={currentPage} />
    </div>
  );
};

export default Layout;