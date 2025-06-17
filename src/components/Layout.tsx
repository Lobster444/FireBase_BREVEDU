import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
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
        <Link 
          to="/" 
          className="flex items-center space-x-2 group focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:ring-offset-2 focus:ring-offset-primary rounded-lg p-1 -m-1 transition-all"
          aria-label="Go to homepage"
        >
          <div className="h-8 w-8 bg-accent-yellow rounded flex items-center justify-center group-hover:bg-accent-green transition-colors">
            <BookOpen className="h-5 w-5 text-text-dark" />
          </div>
          <h1 className="text-h3 text-text-light font-semibold group-hover:text-accent-yellow transition-colors">
            BrevEdu
          </h1>
        </Link>
      </div>

      <main className="pb-20 md:pb-0">
        {children}
      </main>

      <MobileNavigation currentPage={currentPage} />
    </div>
  );
};

export default Layout;