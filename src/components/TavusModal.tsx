import React, { useState, useRef, useEffect } from 'react';
import { X, Clock, AlertTriangle, CheckCircle, WifiOff } from 'lucide-react';
import { Course } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useNetworkStatusWithUtils } from '../hooks/useNetworkStatus';
import { endTavusConversation, completeTavusSession, updateTavusSession } from '../lib/tavusService';
import { notifySuccess, notifyError, notifyWarning, notifyInfo } from '../lib/toast';

interface TavusModalProps {
  isOpen: boolean;
  course: Course | null;
  onClose: () => void;
  onCompletion: (completion: any) => void;
  conversationUrl: string;
  sessionId: string;
  tavusConversationId: string;
}

const TavusModal: React.FC<TavusModalProps> = ({
  isOpen,
  course,
  onClose,
  onCompletion,
  conversationUrl,
  sessionId,
  tavusConversationId
}) => {
  const { currentUser } = useAuth();
  const { isOnline } = useNetworkStatusWithUtils();
  const modalRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes in seconds
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  // Timer ref for cleanup
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const warningShownRef = useRef(false);
  const finalWarningShownRef = useRef(false);
  const hasStartedRef = useRef(false);

  console.log('🎬 TavusModal render:', {
    isOpen,
    hasCourse: !!course,
    hasCurrentUser: !!currentUser,
    conversationUrl,
    sessionId,
    tavusConversationId,
    timeRemaining,
    isTimedOut,
    hasStarted
  });

  // Start timer when modal opens and conversation URL is available
  useEffect(() => {
    if (isOpen && conversationUrl && !isTimedOut && !hasStartedRef.current) {
      console.log('⏰ Starting 2-minute timer for Tavus session');
      hasStartedRef.current = true;
      setHasStarted(true);
      setTimeRemaining(180);
      
      // Update session status to started
      if (sessionId) {
        updateTavusSession(sessionId, { status: 'started' }).catch(console.error);
      }
      
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          
          // Show warning at 30 seconds remaining
          if (newTime === 30 && !warningShownRef.current) {
            warningShownRef.current = true;
            setShowWarning(true);
            notifyWarning('⏰ 30 seconds remaining in your AI practice session');
          }
          
          // Show final warning at 10 seconds remaining
          if (newTime === 10 && !finalWarningShownRef.current) {
            finalWarningShownRef.current = true;
            notifyWarning('⏰ 10 seconds remaining - conversation will end soon');
          }
          
          // Time's up
          if (newTime <= 0) {
            console.log('⏰ Timer expired - ending Tavus session');
            setIsTimedOut(true);
            handleTimeout();
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    }

    // Reset hasStartedRef when modal closes
    if (!isOpen) {
      hasStartedRef.current = false;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isOpen, conversationUrl, isTimedOut, sessionId]);

  // Handle session timeout
  const handleTimeout = async () => {
    console.log('⏰ Handling session timeout');
    setIsCompleting(true);
    
    try {
      // End the Tavus conversation
      if (tavusConversationId) {
        await endTavusConversation(tavusConversationId);
      }
      
      // Update session as expired
      if (sessionId) {
        await updateTavusSession(sessionId, { 
          status: 'expired',
          completedAt: new Date().toISOString()
        });
      }
      
      notifyError('⏰ Practice session timed out after 3 minutes');
      
      // Close modal after a brief delay
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('❌ Error handling timeout:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  // Handle manual completion
  const handleComplete = async () => {
    if (isCompleting || isTimedOut) return;
    
    console.log('✅ Manually completing Tavus session');
    setIsCompleting(true);
    
    try {
      // End the Tavus conversation
      if (tavusConversationId) {
        await endTavusConversation(tavusConversationId);
      }
      
      // Calculate completion data
      const duration = 120 - timeRemaining;
      const accuracyScore = Math.floor(Math.random() * 30) + 70; // Mock score 70-100%
      
      // Complete the session
      if (sessionId) {
        await completeTavusSession(sessionId, {
          accuracyScore,
          duration,
          conversationId: conversationUrl
        });
      }
      
      // Notify parent component
      onCompletion({
        completed: true,
        accuracyScore,
        duration,
        conversationId: conversationUrl
      });
      
      notifySuccess(`🎉 AI practice session completed!`);
      
    } catch (error) {
      console.error('❌ Error completing session:', error);
      notifyError('❌ Error completing practice session');
    } finally {
      setIsCompleting(false);
    }
  };

  // Handle modal close
  const handleClose = async () => {
    if (isCompleting) return;
    
    console.log('🚪 Closing Tavus modal');
    
    // Clean up timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // End conversation if still active
    if (tavusConversationId && !isTimedOut) {
      try {
        await endTavusConversation(tavusConversationId);
        
        // Update session as abandoned
        if (sessionId) {
          await updateTavusSession(sessionId, { 
            status: 'abandoned',
            completedAt: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('❌ Error ending conversation on close:', error);
      }
    }
    
    onClose();
  };

  // Keyboard event handling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === 'Escape' && !isCompleting) {
        event.preventDefault();
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isCompleting]);

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && !isCompleting) {
      handleClose();
    }
  };

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle iframe load
  const handleIframeLoad = () => {
    console.log('📺 Tavus iframe loaded successfully');
  };

  // Handle iframe error
  const handleIframeError = () => {
    console.error('❌ Tavus iframe failed to load');
    notifyError('❌ Failed to load AI conversation. Please try again.');
  };

  // Listen for messages from Tavus iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only process messages if modal is open and ready
      if (!isOpen || !course || !currentUser || isTimedOut) {
        console.log('🚫 Ignoring message - modal not ready:', {
          isOpen,
          hasCourse: !!course,
          hasCurrentUser: !!currentUser,
          isTimedOut
        });
        return;
      }

      console.log('📨 Received message from Tavus iframe:', event);
      
      // Handle Tavus-specific messages
      if (event.origin.includes('tavus') || event.origin.includes('daily.co')) {
        if (event.data?.type === 'conversation_ended') {
          console.log('🎬 Tavus conversation ended via message');
          handleComplete();
        } else if (event.data?.type === 'conversation_started') {
          console.log('🎬 Tavus conversation started via message');
          notifyInfo('🎙️ AI conversation started - speak clearly!');
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isOpen, course, currentUser, isTimedOut]);

  if (!isOpen || !course) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tavus-modal-title"
      aria-describedby="tavus-modal-description"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-headspace-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.15)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-padding-small border-b border-gray-100 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 id="tavus-modal-title" className="text-lg font-bold text-gray-900">
                AI Practice Session
              </h2>
              <p className="text-sm text-gray-600">{course.title}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Timer Display */}
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-headspace-lg ${
              timeRemaining <= 30 ? 'bg-red-100 text-red-800' : 
              timeRemaining <= 60 ? 'bg-yellow-100 text-yellow-800' : 
              'bg-blue-100 text-blue-800'
            }`}>
              <Clock className="h-4 w-4" />
              <span className="font-mono font-semibold">
                {formatTime(timeRemaining)}
              </span>
            </div>
            
            {/* Network Status */}
            {!isOnline && (
              <div className="flex items-center space-x-1 text-yellow-600">
                <WifiOff className="h-4 w-4" />
                <span className="text-sm">Offline</span>
              </div>
            )}
            
            {/* Close Button */}
            <button
              onClick={handleClose}
              disabled={isCompleting}
              className="icon-button icon-button-gray p-2 rounded-headspace-md disabled:opacity-50"
              aria-label="Close AI practice session"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative">
          {/* Tavus Iframe */}
          {conversationUrl && !isTimedOut ? (
            <div className="w-full h-[500px] bg-gray-100">
              <iframe
                ref={iframeRef}
                src={conversationUrl}
                className="w-full h-full border-0"
                allow="camera; microphone; autoplay; encrypted-media; fullscreen"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                title="Tavus AI Practice Conversation"
              />
            </div>
          ) : isTimedOut ? (
            <div className="w-full h-[500px] flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Session Timed Out</h3>
                <p className="text-gray-600 mb-4">
                  Your 3-minute practice session has ended.
                </p>
                {isCompleting && (
                  <div className="flex items-center justify-center space-x-2 text-gray-600">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                    <span>Saving session...</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full h-[500px] flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-[#FF7A59] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Connecting to AI...</h3>
                <p className="text-gray-600">
                  Please wait while we set up your practice session.
                </p>
              </div>
            </div>
          )}

          {/* Warning Overlay */}
          {showWarning && timeRemaining <= 30 && timeRemaining > 0 && (
            <div className="absolute top-4 left-4 right-4 bg-yellow-100 border border-yellow-300 rounded-headspace-lg p-3 flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span className="text-yellow-800 font-medium">
                {timeRemaining} seconds remaining
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-padding-small border-t border-gray-100 bg-gray-50">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>{isOnline ? 'Connected' : 'Offline'}</span>
            </div>
            
            {hasStarted && !isTimedOut && (
              <div className="text-sm text-gray-600">
                Session in progress...
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            {!isTimedOut && (
              <button
                onClick={handleComplete}
                disabled={isCompleting || !hasStarted}
                className={`px-4 py-2 rounded-headspace-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                  isCompleting || !hasStarted
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {isCompleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Completing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Complete Practice</span>
                  </>
                )}
              </button>
            )}
            
            <button
              onClick={handleClose}
              disabled={isCompleting}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-headspace-lg text-sm font-medium hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              {isTimedOut ? 'Close' : 'Exit Practice'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TavusModal;