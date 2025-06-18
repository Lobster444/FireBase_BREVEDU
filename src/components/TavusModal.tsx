import React, { useState, useEffect, useRef } from 'react';
import { X, MessageCircle, AlertCircle, Loader2, CheckCircle, RefreshCw, Wifi, WifiOff, Play } from 'lucide-react';
import { Course, TavusCompletion } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { 
  startTavusSession, 
  completeTavusSession, 
  updateTavusSession,
  retryTavusOperation,
  TavusError
} from '../lib/tavusService';
import { useOfflineSupport } from '../hooks/useOfflineSupport';
import { notifySuccess, notifyError, notifyWarning, notifyInfo } from '../lib/toast';

interface TavusModalProps {
  isOpen: boolean;
  course: Course | null;
  onClose: () => void;
  onCompletion?: (completion: TavusCompletion) => void;
}

interface TavusMessage {
  type: 'tavus_completion' | 'tavus_error' | 'tavus_ready' | 'tavus_started' | 'tavus_progress';
  data?: {
    completed?: boolean;
    accuracyScore?: number;
    conversationId?: string;
    error?: string;
    timestamp?: string;
    progress?: number;
    sessionId?: string;
  };
}

const TavusModal: React.FC<TavusModalProps> = ({
  isOpen,
  course,
  onClose,
  onCompletion
}) => {
  const { currentUser } = useAuth();
  const { isOnline, executeWithOfflineFallback } = useOfflineSupport();
  const modalRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // State management
  const [hasConfirmedStart, setHasConfirmedStart] = useState(false); // NEW: Confirmation state
  const [loading, setLoading] = useState(false); // Changed: Only true when actually loading
  const [error, setError] = useState<string>('');
  const [conversationStarted, setConversationStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sessionId, setSessionId] = useState<string>('');
  const [conversationId, setConversationId] = useState<string>('');
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  // Reset states when modal opens/closes - UPDATED: No automatic session initialization
  useEffect(() => {
    if (isOpen && course) {
      // Reset all states but DON'T initialize session yet
      setHasConfirmedStart(false);
      setLoading(false);
      setError('');
      setConversationStarted(false);
      setProgress(0);
      setRetryCount(0);
      setConnectionStatus('connecting');
      setSessionId('');
      setConversationId('');
      
      // Clear any existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(null);
      }
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      cleanupSession();
    }

    return () => {
      cleanupSession();
    };
  }, [isOpen, course]);

  // NEW: Handle user confirmation to start practice
  const handleStartPracticeClick = async () => {
    if (!currentUser || !course?.id) return;

    setHasConfirmedStart(true);
    await initializeTavusSession();
  };

  // Initialize Tavus session - UPDATED: Only called after user confirmation
  const initializeTavusSession = async () => {
    if (!currentUser || !course?.id) return;

    try {
      setLoading(true);
      setError('');
      setConversationStarted(false);
      setProgress(0);
      setRetryCount(0);
      setConnectionStatus('connecting');
      
      // Start session tracking with conversation URL
      const newSessionId = await executeWithOfflineFallback(
        () => startTavusSession(currentUser.uid, course.id!, course.tavusConversationUrl),
        {
          operation: 'startSession',
          data: { 
            userId: currentUser.uid, 
            courseId: course.id,
            conversationUrl: course.tavusConversationUrl
          }
        }
      );
      
      if (newSessionId) {
        setSessionId(newSessionId);
        console.log('🚀 Tavus session started:', newSessionId);
      }

      // Set loading timeout
      const timeout = setTimeout(() => {
        if (loading) {
          setError('Connection timeout. Please check your internet connection and try again.');
          setLoading(false);
          setConnectionStatus('disconnected');
        }
      }, 20000); // 20 second timeout
      
      setTimeoutId(timeout);
      
    } catch (error) {
      console.error('❌ Error initializing Tavus session:', error);
      setError('Failed to start AI practice session. Please try again.');
      setLoading(false);
      setConnectionStatus('disconnected');
    }
  };

  // Cleanup session - UPDATED: Only cleanup if session was actually started
  const cleanupSession = () => {
    document.body.style.overflow = 'unset';
    
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }

    // Mark session as abandoned only if it was started but not completed
    if (sessionId && hasConfirmedStart && !conversationStarted) {
      updateTavusSession(sessionId, {
        status: 'abandoned'
      }).catch(console.error);
    }
  };

  // Enhanced message event handler - UPDATED: Only active after confirmation
  useEffect(() => {
    if (!hasConfirmedStart) return; // Don't listen for messages until confirmed

    const handleMessage = async (event: MessageEvent) => {
      if (!isOpen || !course || !currentUser) return;

      // Enhanced origin validation
      if (!validateMessageOrigin(event.origin)) {
        console.warn('🚫 Received message from invalid origin:', event.origin);
        return;
      }

      // Parse and validate message
      const tavusMessage = parseAndValidateMessage(event.data);
      if (!tavusMessage) return;

      console.log('📨 Received Tavus message:', tavusMessage);

      // Handle message with retry logic
      try {
        await retryTavusOperation(
          () => handleTavusMessage(tavusMessage),
          3,
          1000
        );
      } catch (error) {
        console.error('❌ Failed to handle Tavus message after retries:', error);
        if (error instanceof TavusError) {
          setError(`AI Practice Error: ${error.message}`);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isOpen, course, currentUser, sessionId, hasConfirmedStart]); // Added hasConfirmedStart dependency

  // Validate message origin
  const validateMessageOrigin = (origin: string): boolean => {
    try {
      const messageUrl = new URL(origin);
      const validDomains = [
        'tavus.daily.co',
        'daily.co',
        'tavus.io',
        'app.tavus.io',
        'api.tavus.io',
        'embed.tavus.io',
        'conversation.tavus.io',
        'localhost' // For development
      ];
      
      return validDomains.some(domain => 
        messageUrl.hostname === domain || 
        messageUrl.hostname.endsWith(`.${domain}`) ||
        (messageUrl.hostname === 'localhost' && process.env.NODE_ENV === 'development')
      );
    } catch (error) {
      return false;
    }
  };

  // Parse and validate Tavus message
  const parseAndValidateMessage = (data: any): TavusMessage | null => {
    try {
      let message: TavusMessage;
      
      if (typeof data === 'string') {
        message = JSON.parse(data);
      } else if (typeof data === 'object' && data.type) {
        message = data;
      } else {
        return null;
      }

      // Validate message structure
      if (!message.type || typeof message.type !== 'string') {
        return null;
      }

      return message;
    } catch (error) {
      console.warn('📨 Could not parse Tavus message:', data);
      return null;
    }
  };

  // Handle different Tavus message types
  const handleTavusMessage = async (message: TavusMessage): Promise<void> => {
    switch (message.type) {
      case 'tavus_ready':
        await handleTavusReady(message);
        break;

      case 'tavus_started':
        await handleTavusStarted(message);
        break;

      case 'tavus_progress':
        handleTavusProgress(message);
        break;

      case 'tavus_completion':
        await handleTavusCompletion(message);
        break;

      case 'tavus_error':
        handleTavusError(message);
        break;

      default:
        console.log('📨 Unknown Tavus message type:', message.type);
    }
  };

  // Handle Tavus ready
  const handleTavusReady = async (message: TavusMessage): Promise<void> => {
    console.log('✅ Tavus conversation ready');
    setLoading(false);
    setError('');
    setConnectionStatus('connected');
    
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }

    // Update session status
    if (sessionId) {
      await updateTavusSession(sessionId, {
        status: 'in_progress',
        conversationId: message.data?.conversationId
      });
    }
  };

  // Handle Tavus started
  const handleTavusStarted = async (message: TavusMessage): Promise<void> => {
    console.log('🎬 Tavus conversation started');
    setConversationStarted(true);
    setConversationId(message.data?.conversationId || '');
    
    // Update session status
    if (sessionId) {
      await updateTavusSession(sessionId, {
        status: 'in_progress',
        conversationId: message.data?.conversationId
      });
    }

    notifyInfo('🎬 AI conversation started! Complete it to mark the course as finished.');
  };

  // Handle Tavus progress
  const handleTavusProgress = (message: TavusMessage): void => {
    if (message.data?.progress !== undefined) {
      setProgress(Math.min(100, Math.max(0, message.data.progress)));
    }
  };

  // Handle Tavus completion
  const handleTavusCompletion = async (message: TavusMessage): Promise<void> => {
    if (!message.data?.completed || !currentUser || !course?.id) return;

    console.log('🎉 Tavus conversation completed:', message.data);

    try {
      const completion: TavusCompletion = {
        completed: true,
        accuracyScore: message.data.accuracyScore,
        conversationId: message.data.conversationId || conversationId,
        completedAt: new Date().toISOString()
      };

      // Complete session with offline fallback
      await executeWithOfflineFallback(
        () => completeTavusSession(sessionId, {
          accuracyScore: completion.accuracyScore,
          conversationId: completion.conversationId
        }),
        {
          operation: 'updateCompletion',
          data: {
            userId: currentUser.uid,
            courseId: course.id,
            completion
          }
        }
      );

      // Show success notification
      const accuracyText = completion.accuracyScore 
        ? ` with ${completion.accuracyScore}% accuracy` 
        : '';
      
      notifySuccess(`🎉 You completed the AI practice session${accuracyText} — course complete!`);

      // Call completion callback
      onCompletion?.(completion);

      // Close modal after delay
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      console.error('❌ Error handling Tavus completion:', error);
      
      if (!isOnline) {
        notifyWarning('📡 Completion saved offline. Will sync when connection is restored.');
      } else {
        notifyError('Failed to save completion status. Please try again.');
      }
    }
  };

  // Handle Tavus error
  const handleTavusError = (message: TavusMessage): void => {
    const errorMsg = message.data?.error || 'An error occurred during the conversation';
    console.error('❌ Tavus error:', errorMsg);
    setError(errorMsg);
    setLoading(false);
    setConnectionStatus('disconnected');

    // Update session status
    if (sessionId) {
      updateTavusSession(sessionId, {
        status: 'failed'
      }).catch(console.error);
    }
  };

  // Handle iframe events - UPDATED: Only active after confirmation
  const handleIframeLoad = () => {
    if (!hasConfirmedStart) return;
    
    console.log('📺 Tavus iframe loaded');
    
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    
    // Send initialization message
    sendMessageToIframe({
      type: 'parent_ready',
      data: {
        courseId: course?.id,
        sessionId,
        userId: currentUser?.uid
      }
    });
  };

  const handleIframeError = () => {
    if (!hasConfirmedStart) return;
    
    console.error('❌ Tavus iframe failed to load');
    setError('Failed to load AI conversation. Please check your connection and try again.');
    setLoading(false);
    setConnectionStatus('disconnected');
    setRetryCount(prev => prev + 1);
  };

  // Send message to iframe
  const sendMessageToIframe = (message: any) => {
    if (iframeRef.current && course?.tavusConversationUrl && hasConfirmedStart) {
      try {
        const iframeWindow = iframeRef.current.contentWindow;
        if (iframeWindow) {
          iframeWindow.postMessage(
            message,
            new URL(course.tavusConversationUrl).origin
          );
        }
      } catch (error) {
        console.warn('⚠️ Could not send message to iframe:', error);
      }
    }
  };

  // Handle retry with exponential backoff
  const handleRetry = async () => {
    const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 10000);
    
    setError('');
    setLoading(true);
    setConnectionStatus('connecting');
    
    // Wait for backoff delay
    await new Promise(resolve => setTimeout(resolve, backoffDelay));
    
    // Reload iframe
    if (iframeRef.current && course?.tavusConversationUrl && hasConfirmedStart) {
      iframeRef.current.src = course.tavusConversationUrl;
    }
    
    setRetryCount(prev => prev + 1);
  };

  // Handle backdrop click with confirmation - UPDATED: Consider confirmation state
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      if (conversationStarted && progress > 0) {
        const confirmed = window.confirm(
          'Are you sure you want to exit? Your progress in this AI practice session will be lost.'
        );
        if (!confirmed) return;
      }
      onClose();
    }
  };

  // Keyboard event handling - UPDATED: Consider confirmation state
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        if (conversationStarted && progress > 0) {
          notifyWarning('⚠️ Press Escape again to exit and lose progress.');
          return;
        }
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, conversationStarted, progress, onClose]);

  if (!isOpen || !course || !course.tavusConversationUrl) return null;

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
        className="bg-white rounded-[16px] w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.12)] relative"
      >
        {/* Enhanced Header with Connection Status */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#FF7A59] rounded-full flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 id="tavus-modal-title" className="text-xl font-bold text-gray-900">
                AI Practice Session
              </h2>
              <p id="tavus-modal-description" className="text-base text-gray-600">
                {course.title}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Connection Status Indicator - Only show after confirmation */}
            {hasConfirmedStart && (
              <div className="flex items-center space-x-2">
                {isOnline ? (
                  <Wifi className={`h-4 w-4 ${connectionStatus === 'connected' ? 'text-green-500' : 'text-yellow-500'}`} />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  connectionStatus === 'connected' ? 'text-green-600' : 
                  connectionStatus === 'connecting' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {!isOnline ? 'Offline' : connectionStatus}
                </span>
              </div>
            )}
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-[8px] hover:bg-gray-50"
              aria-label="Close AI practice session"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content with Enhanced States */}
        <div className="relative">
          {/* NEW: Confirmation Screen - Show before starting session */}
          {!hasConfirmedStart && (
            <div className="flex items-center justify-center min-h-[500px] p-8">
              <div className="text-center max-w-md mx-auto">
                <div className="w-20 h-20 bg-[#FF7A59]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Play className="h-10 w-10 text-[#FF7A59]" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Start AI Practice?
                </h3>
                
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  You're about to begin an interactive AI conversation to practice what you learned in this course. 
                  The session will help reinforce your knowledge through personalized questions and feedback.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Tip:</strong> Make sure you have a stable internet connection and about 5-10 minutes to complete the practice session.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={handleStartPracticeClick}
                    disabled={!isOnline}
                    className={`w-full px-8 py-4 rounded-[10px] text-lg font-medium transition-all flex items-center justify-center space-x-3 ${
                      isOnline 
                        ? 'bg-[#FF7A59] text-white hover:bg-[#FF8A6B] shadow-[0_2px_8px_rgba(255,122,89,0.3)]'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Play className="h-5 w-5" />
                    <span>{isOnline ? 'Start Practice Session' : 'Waiting for Connection'}</span>
                  </button>
                  
                  <button
                    onClick={onClose}
                    className="w-full border border-gray-300 text-gray-700 px-8 py-3 rounded-[10px] text-lg font-medium hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
                
                {!isOnline && (
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      📡 You're currently offline. Please check your internet connection to start the AI practice session.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Loading State - Only show after confirmation */}
          {hasConfirmedStart && loading && (
            <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
              <div className="text-center">
                <Loader2 className="h-8 w-8 text-[#FF7A59] animate-spin mx-auto mb-4" />
                <p className="text-lg text-gray-700 mb-2">
                  {connectionStatus === 'connecting' ? 'Connecting to AI...' : 'Loading conversation...'}
                </p>
                <p className="text-base text-gray-600">This may take a few moments</p>
                {retryCount > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Retry attempt {retryCount}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Enhanced Error State - Only show after confirmation */}
          {hasConfirmedStart && error && (
            <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
              <div className="text-center max-w-md mx-auto p-6">
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {!isOnline ? 'Connection Lost' : 'AI Practice Error'}
                </h3>
                <p className="text-base text-gray-600 mb-6">{error}</p>
                
                {!isOnline && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-yellow-800">
                      Your progress will be saved when connection is restored.
                    </p>
                  </div>
                )}
                
                <div className="space-y-3">
                  <button
                    onClick={handleRetry}
                    disabled={!isOnline}
                    className={`w-full px-6 py-3 rounded-[10px] text-base font-medium transition-all flex items-center justify-center space-x-2 ${
                      isOnline 
                        ? 'bg-[#FF7A59] text-white hover:bg-[#FF8A6B]'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>{isOnline ? 'Try Again' : 'Waiting for Connection'}</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-[10px] text-base font-medium hover:bg-gray-50 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tavus Iframe - Only show after confirmation */}
          {hasConfirmedStart && (
            <div className="w-full h-[70vh] min-h-[500px]">
              <iframe
                ref={iframeRef}
                src={course.tavusConversationUrl}
                className="w-full h-full border-0"
                title="Tavus AI Practice Session"
                allow="camera; microphone; autoplay; encrypted-media; fullscreen"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                style={{
                  colorScheme: 'light',
                  backgroundColor: '#f9fafb'
                }}
              />
            </div>
          )}
        </div>

        {/* Enhanced Footer with Progress - Only show after confirmation */}
        {hasConfirmedStart && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Status Indicator */}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className={`w-2 h-2 rounded-full ${
                    conversationStarted ? 'bg-green-500' : 
                    connectionStatus === 'connected' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`}></div>
                  <span>
                    {conversationStarted ? 'Conversation in progress' : 
                     connectionStatus === 'connected' ? 'Ready to start' : 'Connecting...'}
                  </span>
                </div>
                
                {/* Progress Bar */}
                {conversationStarted && progress > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#FF7A59] transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <p className="text-sm text-gray-600">
                  Complete the conversation to mark this course as finished
                </p>
                <button
                  onClick={onClose}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-[8px] text-sm font-medium hover:bg-gray-100 transition-all"
                >
                  Exit Practice
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TavusModal;