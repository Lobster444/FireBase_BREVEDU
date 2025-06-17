import React, { useState } from 'react';
import { BookOpen, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

interface HeaderProps {
  currentPage?: string;
}

const Header: React.FC<HeaderProps> = ({ currentPage }) => {
  const { currentUser, logout } = useAuth();
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

  return (
    <>
      <header className="hidden md:flex items-center justify-between p-6 bg-primary border-b border-neutral-gray/20">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-accent-yellow" />
          <h1 className="text-h3 text-text-light font-semibold">BrevEdu</h1>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-8">
          <a 
            href="/courses" 
            className={`text-link ${currentPage === 'courses' ? 'text-accent-yellow' : 'text-text-light hover:text-accent-yellow'} transition-colors underline`}
          >
            Courses
          </a>
          <a 
            href="/brevedu-plus" 
            className={`text-link ${currentPage === 'brevedu-plus' ? 'text-accent-yellow' : 'text-text-light hover:text-accent-yellow'} transition-colors underline`}
          >
            BrevEdu+
          </a>
          
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 bg-accent-purple text-text-dark px-4 py-2 rounded-lg text-body font-medium hover:bg-accent-deep-purple transition-all shadow-button"
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
                    className="w-full text-left px-4 py-2 text-body text-text-light hover:bg-neutral-gray/20 transition-colors flex items-center space-x-2"
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
                className="text-text-light hover:text-accent-yellow transition-colors text-link underline"
              >
                Sign In
              </button>
              <button 
                onClick={() => openAuthModal('register')}
                className="bg-accent-purple text-text-dark px-6 py-3 rounded-lg text-body font-medium hover:bg-accent-deep-purple transition-all shadow-button"
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