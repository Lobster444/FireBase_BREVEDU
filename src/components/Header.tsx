import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, User, LogOut, Menu, X } from 'lucide-react';
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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setShowMobileMenu(false);
  }, [location.pathname]);

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
    setShowMobileMenu(false);
  };

  // Handle navigation with access control
  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    // If trying to access courses page and user is anonymous, prevent navigation and show auth modal
    if (path === '/courses' && !currentUser) {
      e.preventDefault();
      setAuthMode('register');
      setShowAuthModal(true);
      return;
    }
    // Allow normal navigation for authenticated users or non-restricted pages
  };

  // Check if current path is active
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || currentPage === 'home';
    }
    return location.pathname === path || currentPage === path.slice(1);
  };

  // Handle logo click with blur to prevent sticky focus
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.blur();
  };

  // Handle navigation link click with blur
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.blur();
  };

  const navLinks = [
    { path: '/', label: 'Home', id: 'home' },
    { path: '/courses', label: 'Courses', id: 'courses' },
    { path: '/brevedu-plus', label: 'BrevEdu+', id: 'brevedu-plus' },
  ];

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden sm:block sticky top-0 bg-white z-50 shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-padding-small sm:px-padding-medium lg:px-padding-large py-padding-small">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 group focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FF7A59] focus-visible:ring-opacity-40 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-[12px] p-2 -m-2 transition-all hover:animate-[breathe_2s_infinite]"
              aria-label="Go to homepage"
              onClick={handleLogoClick}
            >
              <BookOpen className="h-8 w-8 text-white" />
            </div>
              <h1 className="text-2xl font-bold text-gray-900 group-hover:text-[#002fa7] transition-colors duration-300 ease-out">
                BrevEdu
              </h1>
            </Link>

            {/* Navigation Links */}
            <nav className="flex items-center space-x-2" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link 
                  key={link.id}
                  to={link.path} 
                  className={`
                    text-gray-700 font-medium px-4 py-2 rounded-[10px] transition-all duration-200 ease-out
                    hover:bg-[#002fa7]/10 hover:text-[#002fa7] hover:animate-[breathe_2s_infinite]
                    focus:outline-none focus-visible:outline-2 focus-visible:outline-[#002fa7] focus-visible:outline-offset-2
                    ${isActive(link.path) 
                      ? 'bg-[#002fa7]/15 text-[#002fa7] font-semibold' 
                      : ''
                    }
                  `}
                  onClick={(e) => {
                    handleNavClick(e);
                    handleNavigation(e, link.path);
                  }}
                  style={{
                    minHeight: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    animationTimingFunction: 'ease-in-out'
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              {currentUser ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 bg-[#002fa7] text-white px-5 py-3 rounded-[10px] font-medium hover:bg-[#0040d1] transition-all duration-200 ease-out shadow-[0_2px_8px_rgba(0,47,167,0.3)] hover:shadow-[0_4px_12px_rgba(0,47,167,0.4)] hover:animate-[breathe_2s_infinite] focus:outline-none focus-visible:outline-2 focus-visible:outline-[#002fa7] focus-visible:outline-offset-2"
                    aria-expanded={showUserMenu}
                    aria-haspopup="true"
                    style={{
                      minHeight: '44px',
                      animationTimingFunction: 'ease-in-out'
                    }}
                  >
                    <User className="h-5 w-5" />
                    <span className="max-w-[120px] truncate">{currentUser.name}</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] py-3 min-w-[220px] z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-base font-semibold text-gray-900">{currentUser.name}</p>
                        <p className="text-sm text-gray-600">{currentUser.email}</p>
                        <p className="text-sm text-[#002fa7] capitalize mt-1 font-medium">{currentUser.role} Plan</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-base text-gray-700 hover:bg-gray-50 hover:text-[#002fa7] transition-colors duration-200 ease-out flex items-center space-x-3 focus:outline-none focus-visible:outline-2 focus-visible:outline-[#002fa7] focus-visible:outline-offset-2 rounded-[8px] mx-2 mt-1"
                        style={{ minHeight: '44px' }}
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => openAuthModal('login')}
                    className="text-gray-700 hover:text-[#002fa7] transition-colors duration-200 ease-out font-medium underline underline-offset-4 px-3 py-2 rounded-[8px] focus:outline-none focus-visible:outline-2 focus-visible:outline-[#002fa7] focus-visible:outline-offset-2 hover:animate-[breathe_2s_infinite]"
                    style={{
                      minHeight: '44px',
                      display: 'flex',
                      alignItems: 'center',
                      animationTimingFunction: 'ease-in-out'
                    }}
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => openAuthModal('register')}
                    className="bg-[#002fa7] text-white px-5 py-3 rounded-[10px] font-medium hover:bg-[#0040d1] transition-all duration-200 ease-out shadow-[0_2px_8px_rgba(0,47,167,0.3)] hover:shadow-[0_4px_12px_rgba(0,47,167,0.4)] hover:animate-[breathe_2s_infinite] focus:outline-none focus-visible:outline-2 focus-visible:outline-[#002fa7] focus-visible:outline-offset-2"
                    style={{
                      minHeight: '44px',
                      animationTimingFunction: 'ease-in-out'
                    }}
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <div className="sm:hidden bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between p-padding-small">
          {/* Mobile Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FF7A59] focus-visible:ring-opacity-40 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-[10px] p-1 -m-1 transition-all"
            aria-label="Go to homepage"
            onClick={handleLogoClick}
          >
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 group-hover:text-[#002fa7] transition-colors duration-300 ease-out">
              BrevEdu
            </h1>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="icon-button icon-button-gray p-2 rounded-[8px] transition-colors duration-200 ease-out"
            aria-expanded={showMobileMenu}
            aria-controls="mobile-menu"
            aria-label="Toggle mobile menu"
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            {showMobileMenu ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {showMobileMenu && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setShowMobileMenu(false)} />
        )}

        {/* Mobile Menu Drawer */}
        {showMobileMenu && (
          <div 
            ref={mobileMenuRef}
            id="mobile-menu"
            className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)] z-50 transform transition-transform duration-300 ease-out"
          >
          <div className="p-padding-medium">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="icon-button icon-button-gray p-2 rounded-[8px]"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <nav className="space-y-4 mb-8" aria-label="Mobile navigation">
                {navLinks.map((link) => (
                  <Link
                    key={link.id}
                    to={link.path}
                    className={`
                      block text-gray-700 font-medium py-3 px-4 rounded-[10px] transition-all duration-200 ease-out
                      hover:bg-[#002fa7]/10 hover:text-[#002fa7]
                      focus:outline-none focus-visible:outline-2 focus-visible:outline-[#002fa7] focus-visible:outline-offset-2
                      ${isActive(link.path) 
                        ? 'bg-[#002fa7]/15 text-[#002fa7] font-semibold' 
                        : ''
                      }
                    `}
                    onClick={(e) => {
                      handleNavigation(e, link.path);
                      if (!e.defaultPrevented) {
                        setShowMobileMenu(false);
                      }
                    }}
                    style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile User Actions */}
              <div className="border-t border-gray-100 pt-6">
                {currentUser ? (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-[12px] p-4">
                      <p className="text-base font-semibold text-gray-900">{currentUser.name}</p>
                      <p className="text-sm text-gray-600">{currentUser.email}</p>
                      <p className="text-sm text-[#002fa7] capitalize mt-1 font-medium">{currentUser.role} Plan</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left text-gray-700 font-medium py-3 px-4 rounded-[10px] hover:bg-gray-50 hover:text-[#002fa7] transition-colors duration-200 ease-out flex items-center space-x-3 focus:outline-none focus-visible:outline-2 focus-visible:outline-[#002fa7] focus-visible:outline-offset-2"
                      style={{ minHeight: '44px' }}
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button 
                      onClick={() => openAuthModal('login')}
                      className="w-full text-gray-700 hover:text-[#002fa7] transition-colors duration-200 ease-out font-medium underline underline-offset-4 py-3 px-4 rounded-[8px] focus:outline-none focus-visible:outline-2 focus-visible:outline-[#002fa7] focus-visible:outline-offset-2"
                      style={{ minHeight: '44px' }}
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={() => openAuthModal('register')}
                      className="w-full bg-[#002fa7] text-white py-3 px-4 rounded-[10px] font-medium hover:bg-[#0040d1] transition-all duration-200 ease-out shadow-[0_2px_8px_rgba(0,47,167,0.3)] hover:shadow-[0_4px_12px_rgba(0,47,167,0.4)] focus:outline-none focus-visible:outline-2 focus-visible:outline-[#002fa7] focus-visible:outline-offset-2"
                      style={{ minHeight: '44px' }}
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </>
  );
};

export default Header;