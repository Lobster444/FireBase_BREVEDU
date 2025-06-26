import React, { useState, useRef, useEffect } from 'react';
import { X, Play, MessageCircle, Clock, WifiOff, AlertTriangle } from 'lucide-react';
import { Course } from '../../../types';
import { useAuth } from '../../../contexts/AuthContext';
import { useNetworkStatusWithUtils } from '../../../hooks/useNetworkStatus';
import { useViewport } from '../../../hooks/useViewport';
import { DAILY_LIMITS } from '../../../services/tavusUsage';
import { trackAIPracticeEvent } from '../../../lib/analytics';

interface TavusConfirmationModalProps {
  isOpen: boolean;
  course: Course | null;
  onClose: () => void;
  onConfirmStart: () => void;
}

const TavusConfirmationModal: React.FC<TavusConfirmationModalProps> = ({
  isOpen,
  course,
  onClose,
  onConfirmStart
}) => {
  const { currentUser } = useAuth();
  const { isOnline } = useNetworkStatusWithUtils();
  const { isMobile } = useViewport();
  const modalRef = useRef<HTMLDivElement>(null);
  const [isStarting, setIsStarting] = useState(false);

  // Keyboard event handling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }

      if (event.key === 'Enter' && isOnline && !isStarting) {
        event.preventDefault();
        handleConfirmStart();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isOnline, isStarting, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // UPDATED: Handle confirm start with loading state
  const handleConfirmStart = async () => {
    if (!isOnline || isStarting) return;
    
    // Track AI practice start
    if (course?.id) {
      trackAIPracticeEvent('ai_practice_start', course.id, {
        userRole: currentUser?.role
      });
    }
    
    setIsStarting(true);
    try {
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Call the parent handler which will now create Tavus conversation via API
      onConfirmStart();
    } finally {
      setIsStarting(false);
    }
  };

  // Get AI practice session info
  const getSessionInfo = () => {
    if (!currentUser) {
      return {
        sessionsAvailable: 0,
        sessionType: 'Sign in required',
        dailyLimit: 0
      };
    }

    if (currentUser.role === 'free') {
      const dailyLimit = DAILY_LIMITS.free;
      const used = currentUser.aiChatsUsed || 0;
      const today = new Date().toISOString().split('T')[0];
      const lastReset = currentUser.lastChatReset || '';
      
      const sessionsAvailable = lastReset !== today ? dailyLimit : Math.max(0, dailyLimit - used);
      
      return {
        sessionsAvailable,
        sessionType: 'Free Account',
        dailyLimit
      };
    }

    if (currentUser.role === 'premium') {
      const dailyLimit = DAILY_LIMITS.premium;
      const used = currentUser.aiChatsUsed || 0;
      const today = new Date().toISOString().split('T')[0];
      const lastReset = currentUser.lastChatReset || '';
      
      const sessionsAvailable = lastReset !== today ? dailyLimit : Math.max(0, dailyLimit - used);
      
      return {
        sessionsAvailable,
        sessionType: 'BrevEdu+ Member',
        dailyLimit
      };
    }

    return {
      sessionsAvailable: 0,
      sessionType: 'Unknown',
      dailyLimit: 0
    };
  };

  if (!isOpen || !course) return null;

  const sessionInfo = getSessionInfo();
  const canStart = isOnline && sessionInfo.sessionsAvailable > 0 && !isStarting;

  // Use full-screen on mobile, modal on desktop
  const wrapperClasses = isMobile
    ? "fixed inset-0 bg-white z-50 overflow-y-auto"
    : "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4";

  const modalClasses = isMobile
    ? ""
    : "bg-white rounded-headspace-2xl w-full max-w-sm sm:max-w-md lg:max-w-lg shadow-[0_8px_32px_rgba(0,0,0,0.15)] overflow-hidden mx-4";


  return (
    <div 
      className={wrapperClasses}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={modalClasses}
        onClick={(e) => e.stopPropagation()} // Prevent backdrop click when clicking inside modal
      >
        {/* Header */}
        <div className={`flex items-center justify-between border-b border-gray-100 ${
          isMobile ? 'p-4 bg-white sticky top-0 z-10' : 'p-4 sm:p-padding-medium'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#002fa7] rounded-full flex items-center justify-center text-white">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 id="confirm-modal-title" className="text-xl font-bold text-gray-900">
                Start AI Practice?
              </h2>
              <p className="text-sm text-gray-600 hidden sm:block">
                {course.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="icon-button icon-button-gray p-2 rounded-headspace-md"
            aria-label="Close confirmation dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className={isMobile ? "p-4 pb-20" : "p-4 sm:p-padding-medium"}>
          <div id="confirm-modal-description" className="space-y-4">
            {/* Course Title - Mobile Only */}
            <div className="sm:hidden">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {course.title}
              </h3>
            </div>
            
            {/* Main Message */}
            <div className={`text-center ${isMobile ? 'py-6' : ''}`}>
              <div className="w-16 h-16 bg-[#002fa7]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#002fa7]">
                <Play className="h-8 w-8 text-[#002fa7]" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Ready to Practice with AI?
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                You're about to start an interactive AI conversation to practice what you learned.{' '}
                This session will last up to 2 minutes and count as one of your daily practice sessions.
              </p>
            </div>

            {/* Session Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-headspace-lg p-3 sm:p-4 text-blue-900">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-medium text-blue-900">Account Type:</span>
                <span className="text-xs sm:text-sm text-blue-800">{sessionInfo.sessionType}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-medium text-blue-900">Sessions Available:</span>
                <span className="text-xs sm:text-sm text-blue-800">
                  {sessionInfo.sessionsAvailable} of {sessionInfo.dailyLimit} today
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium text-blue-900">Session Duration:</span>
                <span className="text-xs sm:text-sm text-blue-800 flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>2 minutes max</span>
                </span>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gray-50 rounded-headspace-lg p-3 sm:p-4">
              <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2">💡 Practice Tips:</h4>
              <ul className="text-xs sm:text-sm text-gray-700 space-y-1">
                <li>• Make sure you have a stable internet connection</li>
                <li>• Find a quiet place to focus</li>
                <li>• Session will automatically end after 2 minutes</li>
                <li>• Speak clearly and engage with the AI</li>
              </ul>
            </div>

            {/* Offline Warning */}
            {!isOnline && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-headspace-lg p-3 sm:p-4">
                <div className="flex items-center space-x-2 text-yellow-800">
                  <WifiOff className="h-5 w-5" />
                  <span className="text-xs sm:text-sm font-medium">You're currently offline</span>
                </div>
                <p className="text-xs sm:text-sm text-yellow-700 mt-1">
                  Please check your internet connection to start the AI practice session.
                </p>
              </div>
            )}

            {/* No Sessions Warning */}
            {isOnline && sessionInfo.sessionsAvailable === 0 && (
              <div className="bg-red-50 border border-red-200 rounded-headspace-lg p-3 sm:p-4">
                <div className="flex items-center space-x-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="text-xs sm:text-sm font-medium">No sessions available</span>
                </div>
                <p className="text-xs sm:text-sm text-red-700 mt-1">
                  {currentUser?.role === 'free' 
                    ? 'You\'ve used your daily practice session. Upgrade to BrevEdu+ for more sessions!'
                    : 'You\'ve used all your daily practice sessions. More sessions available tomorrow!'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className={`flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-6 ${
            isMobile ? 'fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200' : ''
          }`}>
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 px-4 py-3 rounded-headspace-lg text-sm sm:text-base font-medium hover:bg-gray-50 transition-all min-h-[44px]"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmStart}
              disabled={!canStart}
              className={`flex-1 px-4 py-3 rounded-headspace-lg text-sm sm:text-base font-medium transition-all flex items-center justify-center space-x-2 text-white min-h-[44px] ${
                canStart
                  ? 'bg-[#002fa7] text-white hover:bg-[#0040d1] shadow-[0_2px_8px_rgba(0,47,167,0.3)]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isStarting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating Session...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>Start Practice</span>
                </>
              )}
            </button>
          </div>

          {/* Upgrade Prompt for Free Users */}
          {currentUser?.role === 'free' && (
            <div className={`mt-3 sm:mt-4 text-center ${isMobile ? 'pb-4' : ''}`}>
              <p className="text-xs sm:text-sm text-gray-600 mb-2">
                Want more practice sessions?
              </p>
              <a
                href="/brevedu-plus"
                className="text-[#002fa7] hover:text-[#0040d1] transition-colors text-xs sm:text-sm font-medium underline"
                onClick={onClose}
              >
                Upgrade to BrevEdu+ for 3 daily sessions
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TavusConfirmationModal;