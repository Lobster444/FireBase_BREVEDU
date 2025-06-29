import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, SignOut, List, X, ChatCircle } from '@phosphor-icons/react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
import { Button, IconButton, LinkButton } from './Button';
import { trackInteraction } from '../lib/analytics';

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
  const userMenuRefDesktop = useRef<HTMLDivElement>(null);
  const userMenuRefMobile = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        userMenuRefDesktop.current &&
        !userMenuRefDesktop.current.contains(target) &&
        userMenuRefMobile.current &&
        !userMenuRefMobile.current.contains(target)
      ) {
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
      console.log('🔄 Starting logout process...');
      console.log('🔍 Current user before logout:', currentUser?.email);
      
      await logout();
      console.log('✅ Firebase logout successful');
      
      setShowUserMenu(false);
      console.log('✅ User menu closed');
      
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const openAuthModal = (mode: 'login' | 'register') => {
    trackInteraction('auth_modal', 'open', `header_${mode}`);
    setAuthMode(mode);
    setShowAuthModal(true);
    setShowMobileMenu(false);
  };

  // Handle navigation with access control
  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    trackInteraction('navigation', 'click', path);
    
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
      {/* Desktop Header - Transparent with backdrop blur */}
      <header className="hidden sm:block sticky top-0 bg-white/80 backdrop-blur-md z-50 shadow-sm border-b border-black/5">
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-4 group focus:outline-none focus-visible:ring-4 focus-visible:ring-cobalt focus-visible:ring-opacity-40 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-[12px] p-2 -m-2 transition-all"
              aria-label="Go to homepage"
              onClick={handleLogoClick}
            >
              <div className="w-10 h-10 bg-cobalt rounded-full flex items-center justify-center">
                <ChatCircle className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-black group-hover:text-cobalt transition-colors duration-300 ease-out">
                BreVedu
              </h1>
            </Link>

            {/* Navigation Links */}
            <nav className="flex items-center space-x-4" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link 
                  key={link.id}
                  to={link.path} 
                  className={`
                    text-gray-700 font-medium px-5 py-3 rounded-[10px] transition-all duration-200 ease-out
                    hover:bg-cobalt/10 hover:text-cobalt
                    focus:outline-none focus-visible:outline-2 focus-visible:outline-cobalt focus-visible:outline-offset-2
                    ${isActive(link.path) 
                      ? 'bg-cobalt/15 text-cobalt font-semibold' 
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
            <div className="flex items-center space-x-4">
              {currentUser ? (
                <div className="relative" ref={userMenuRefDesktop}>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3"
                    aria-expanded={showUserMenu}
                    aria-haspopup="true"
                    icon={User}
                  >
                    <span className="max-w-[120px] truncate">{currentUser.name}</span>
                  </Button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-3 bg-white border border-black/5 rounded-[12px] shadow-xl py-4 min-w-[240px] z-50">
                      <div className="px-5 py-4 border-b border-black/5">
                        <p className="text-lg font-semibold text-black">{currentUser.name}</p>
                        <p className="text-base text-gray-600">{currentUser.email}</p>
                        <p className={`text-sm capitalize mt-1 font-medium ${
                          currentUser.role === 'premium' ? 'text-subscription-premium' : 'text-subscription-free'
                        }`}>{currentUser.role} Plan</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="md"
                        fullWidth
                        onClick={handleLogout}
                        className="text-left mx-2 mt-2 justify-start"
                        icon={SignOut}
                      >
                        <span>Sign Out</span>
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="md"
                    onClick={() => openAuthModal('login')}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => openAuthModal('register')}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <div className="sm:hidden bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between px-3 py-2.5 min-h-[60px]">
          {/* Mobile Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-1.5 group focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FF7A59] focus-visible:ring-opacity-40 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-[10px] p-1 -m-1 transition-all flex-shrink-0"
            aria-label="Go to homepage"
            onClick={handleLogoClick}
          >
            <div className="w-5 h-5 bg-[#002fa7] rounded-full flex items-center justify-center">
              <ChatCircle className="h-3 w-3 text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-900 group-hover:text-[#002fa7] transition-colors duration-300 ease-out">
              BreVedu
            </h1>
          </Link>

          {/* Mobile Actions */}
          <div className="flex items-center space-x-1.5 flex-shrink-0">
            {currentUser ? (
              /* Authenticated User - Show User Button + Menu */
              <>
                <Button
                  variant="primary"
                  size="sm" 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-1 px-2 py-1.5 text-xs"
                  aria-expanded={showUserMenu}
                  aria-haspopup="true"
                  aria-label={`User menu for ${currentUser.name}`}
                  icon={User}
                >
                  <span className="max-w-[50px] truncate text-xs font-medium">{currentUser.name}</span>
                </Button>
                <IconButton
                  icon={showMobileMenu ? X : List}
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  variant="gray"
                  size="sm"
                  aria-expanded={showMobileMenu}
                  aria-controls="mobile-menu"
                  aria-label="Toggle navigation menu"
                />
              </>
            ) : (
              /* Anonymous User - Show Auth Buttons + Menu */
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-2 py-1.5 text-xs"
                  onClick={() => openAuthModal('login')}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="px-2 py-1.5 text-xs"
                  onClick={() => openAuthModal('register')}
                  aria-label="Create a new account"
                >
                  Sign Up
                </Button>
                <IconButton
                  icon={showMobileMenu ? X : List}
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  variant="gray"
                  size="sm"
                  aria-expanded={showMobileMenu}
                  aria-controls="mobile-menu"
                  aria-label="Toggle navigation menu"
                />
              </>
            )}
          </div>
        </div>

        {/* Mobile User Menu Dropdown - Only for authenticated users */}
        {currentUser && showUserMenu && (
          <div ref={userMenuRefMobile} className="absolute right-3 top-[60px] bg-white border border-gray-200 rounded-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] py-3 w-[220px] max-w-[calc(100vw-24px)] z-50 animate-slide-up">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-900">{currentUser.name}</p>
              <p className="text-xs text-gray-600">{currentUser.email}</p>
              <p className={`text-xs capitalize mt-1 font-medium ${
                currentUser.role === 'premium' ? 'text-currant' : 'text-kelp'
              }`}>{currentUser.role} Plan</p>
            </div>
            <Button
              variant="ghost"
              size="md"
              fullWidth
              onClick={() => {
                console.log('Mobile Sign Out clicked'); // Debug log
                console.log('🎯 Mobile Sign Out button clicked');
                console.log('📱 Current user state:', currentUser?.email);
                handleLogout();
                console.log('🔄 handleLogout called');
                setShowUserMenu(false);
              }}
              className="text-left px-2 mt-1 justify-start"
              icon={SignOut} 
            >
              <span>Sign Out</span>
            </Button>
          </div>
        )}

        {/* Mobile Menu Overlay */}
        {showMobileMenu && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-40" onClick={() => setShowMobileMenu(false)} />
        )}

        {/* Mobile Menu Drawer */}
        {showMobileMenu && (
          <div 
            ref={mobileMenuRef}
            id="mobile-menu"
            className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white border-l border-gray-200 shadow-[0_8px_32px_rgba(0,0,0,0.25)] z-50 transform transition-transform duration-300 ease-out opacity-100"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="p-6 bg-white border-b border-gray-100" style={{ backgroundColor: '#ffffff' }}>
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                <IconButton
                  icon={X}
                  onClick={() => setShowMobileMenu(false)}
                  variant="gray"
                  size="md"
                  aria-label="Close menu"
                  className="text-left px-2 mt-2 justify-start"
              </div>
            </div>

            <div className="p-6 bg-white" style={{ backgroundColor: '#ffffff' }}>
              {/* Mobile Navigation Links */}
              <nav className="space-y-4 mb-8" aria-label="Mobile navigation">
                {navLinks.map((link) => (
                  <Link
                    key={link.id}
                    to={link.path}
                    className={`
                      block text-gray-700 font-medium py-3 px-4 rounded-[10px] transition-all duration-200 ease-mc
                      hover:bg-cobalt/10 hover:text-cobalt
                      focus:outline-none focus-visible:outline-2 focus-visible:outline-cobalt focus-visible:outline-offset-2
                      ${isActive(link.path) 
                        ? 'bg-cobalt/15 text-cobalt font-semibold' 
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
              <div className="border-t border-gray-200 pt-6">
                {currentUser ? (
                  <div className="text-center">
                    <p className="text-gray-600 text-sm mb-4">
                      Signed in as <span className="font-medium text-gray-900">{currentUser.name}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Use the user menu in the header to sign out
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-gray-600 text-sm text-center mb-4">
                      Use the buttons in the header to sign in or create an account
                    </p>
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