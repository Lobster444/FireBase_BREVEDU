import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

interface HeaderProps {
  currentPage?: string;
}

const Header: React.FC<HeaderProps> = ({ currentPage }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  // Check if current path is active
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || currentPage === 'home';
    }
    return location.pathname === path || currentPage === path.slice(1);
  };

  return (
    <>
      <header className="hidden md:flex items-center justify-between p-6 bg-primary border-b border-neutral-gray/20">
        {/* Logo - Clickable */}
        <Link 
          to="/" 
          className="flex items-center space-x-2 group focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:ring-offset-2 focus:ring-offset-primary rounded-lg p-1 -m-1 transition-all"
          aria-label="Go to homepage"
        >
          <BookOpen className="h-8 w-8 text-accent-yellow group-hover:text-accent-green transition-colors" />
          <h1 className="text-h3 text-text-light font-semibold group-hover:text-accent-yellow transition-colors">
            BrevEdu
          </h1>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-8" aria-label="Main navigation">
          <Link 
            to="/" 
            className={`text-link font-medium transition-colors underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:ring-offset-2 focus:ring-offset-primary rounded px-1 ${
              isActive('/') 
                ? 'text-accent-yellow underline' 
                : 'text-text-light hover:text-accent-yellow'
            }`}
            aria-label="Go to homepage"
          >
            Home
          </Link>
          <Link 
            to="/courses" 
            className={`text-link font-medium transition-colors underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:ring-offset-2 focus:ring-offset-primary rounded px-1 ${
              isActive('/courses') 
                ? 'text-accent-yellow underline' 
                : 'text-text-light hover:text-accent-yellow'
            }`}
          >
            Courses
          </Link>
          <Link 
            to="/brevedu-plus" 
            className={`text-link font-medium transition-colors underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:ring-offset-2 focus:ring-offset-primary rounded px-1 ${
              isActive('/brevedu-plus') 
                ? 'text-accent-yellow underline' 
                : 'text-text-light hover:text-accent-yellow'
            }`}
          >
            BrevEdu+
          </Link>
          
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 bg-accent-purple text-text-dark px-4 py-2 rounded-lg text-body font-medium hover:bg-accent-deep-purple transition-all shadow-button focus:outline-none focus:ring-2 focus:ring-accent-purple focus:ring-offset-2 focus:ring-offset-primary"
                aria-expanded={showUserMenu}
                aria-haspopup="true"
              >
                <User className="h-4 w-4" />
                <span className="max-w-[120px] truncate">{currentUser.name}</span>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 bg-primary border border-neutral-gray/30 rounded-lg shadow-lg py-2 min-w-[200px] z-50">
                  <div className="px-4 py-2 border-b border-neutral-gray/20">
                    <p className="text-small text-text-light font-medium">{currentUser.name}</p>
                    <p className="text-x-small text-neutral-gray">{currentUser.email}</p>
                    <p className="text-x-small text-accent-yellow capitalize mt-1">{currentUser.role} Plan</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-body text-text-light hover:bg-neutral-gray/20 transition-colors flex items-center space-x-2 focus:outline-none focus:bg-neutral-gray/20"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => openAuthModal('login')}
                className="text-text-light hover:text-accent-yellow transition-colors text-link underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:ring-offset-2 focus:ring-offset-primary rounded px-1"
              >
                Sign In
              </button>
              <button 
                onClick={() => openAuthModal('register')}
                className="bg-accent-purple text-text-dark px-6 py-3 rounded-lg text-body font-medium hover:bg-accent-deep-purple transition-all shadow-button focus:outline-none focus:ring-2 focus:ring-accent-purple focus:ring-offset-2 focus:ring-offset-primary"
              >
                Sign Up
              </button>
            </div>
          )}
        </nav>
      </header>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </>
  );
};

export default Header;