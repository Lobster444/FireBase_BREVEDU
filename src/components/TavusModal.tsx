import React, { useState, useEffect, useRef } from 'react';
import { X, MessageCircle, AlertCircle, Loader2, CheckCircle, RefreshCw, Wifi, WifiOff, Clock, Timer, Triangle as ExclamationTriangle } from 'lucide-react';
import { Course, TavusCompletion } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { 
  updateTavusSession,
  retryTavusOperation,
  endTavusConversation,
  TavusError,
  TavusNetworkError,
  TavusConfigError,
  TavusAPIError,
  TavusTimeoutError,
  executeWithOfflineFallback
} from '../lib/tavusService';
import { useOfflineSupport } from '../hooks/useOfflineSupport';
import { notifySuccess, notifyError, notifyWarning, notifyInfo } from '../lib/toast';

interface TavusModalProps {
  isOpen: boolean;
  course: Course | null;
  onClose: () => void;
  onCompletion?: (completion: TavusCompletion) => void;
  conversationUrl?: string;
  sessionId?: string;
  tavusConversationId?: string;
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
  onCompletion,
  conversationUrl,
  sessionId: propSessionId,
  tavusConversationId: propTavusConversationId
}) => {
  const { currentUser } = useAuth();
  const { isOnline } = useOfflineSupport();
  const modalRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [errorType, setErrorType] = useState<'network' | 'config' | 'api' | 'timeout' | 'general'>('general');
  const [conversationStarted, setConversationStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sessionId, setSessionId] = useState<string>(propSessionId || '');
  const [conversationId, setConversationId] = useState<string>('');
  const [tavusConversationId, setTavusConversationId] = useState<string>(propTavusConversationId || '');
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  
  // 3-minute countdown timer state
  const [timeRemaining, setTimeRemaining] = useState(180);
  const [countdownTimer, setCountdownTimer] = useState<NodeJS.Timeout | null>(null);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [isEndingConversation, setIsEndingConversation] = useState(false);

  // Enhanced error handling state
  const [canRetry, setCanRetry] = useState(true);
  const [maxRetriesReached, setMaxRetriesReached] = useState(false);

  // Initialize when modal opens with dynamic conversation URL
  useEffect(() => {
    if (isOpen && course && conversationUrl) {
      console.log('🚀 TavusModal opened with dynamic conversation URL');
      initializeTavusSession();
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      cleanupSession();
    }

    return () => {
      cleanupSession();
    };
  }, [isOpen, course, conversationUrl]);

  // Start 3-minute countdown when conversation starts
  useEffect(() => {
    if (conversationStarted && !countdownTimer && !isTimedOut) {
      console.log('⏰ Starting 3-minute countdown timer');
      
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          
          // Show warning at 30 seconds remaining
          if (newTime === 30 && !showTimeoutWarning) {
            setShowTimeoutWarning(true);
            notifyWarning('⏰ 30 seconds remaining in your AI practice session');
          }
          
          // Show final warning at 10 seconds
          if (newTime === 10) {
            notifyWarning('⏰ 10 seconds remaining - conversation will end soon');
          }
          
          // Auto-end conversation when time runs out
          if (newTime <= 0) {
            handleTimeoutEnd();
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
      
      setCountdownTimer(timer);
    }

    return () => {
      if (countdownTimer) {
        clearInterval(countdownTimer);
        setCountdownTimer(null);
      }
    };
  }, [conversationStarted, countdownTimer, showTimeoutWarning, isTimedOut]);

  // Enhanced automatic timeout end with better error handling
  const handleTimeoutEnd = async () => {
    if (isTimedOut || isEndingConversation) return;
    
    console.log('⏰ 3-minute timer expired - ending conversation');
    setIsTimedOut(true);
    setIsEndingConversation(true);
    
    try {
      // Clear the countdown timer
      if (countdownTimer) {
        clearInterval(countdownTimer);
        setCountdownTimer(null);
      }
      
      // End conversation via Tavus API if we have the conversation ID
      if (tavusConversationId) {
        console.log('🛑 Calling Tavus API to end conversation:', tavusConversationId);
        
        await executeWithOfflineFallback(
          () => endTavusConversation(tavusConversationId),
          {
            operation: 'endConversation',
            data: { conversationId: tavusConversationId }
          },
          'End conversation'
        );
        
        console.log('✅ Tavus conversation ended via API');
      }
      
      // Update session status
      if (sessionId) {
        await executeWithOfflineFallback(
          () => updateTavusSession(sessionId, {
            status: 'expired',
            completedAt: new Date().toISOString(),
            duration: 180 // Full 3 minutes
          }),
          {
            operation: 'updateSession',
            data: {
              sessionId,
              updates: {
                status: 'expired',
                completedAt: new Date().toISOString(),
                duration: 180
              }
            }
          },
          'Update session status'
        );
        
        console.log('📝 Session marked as expired in Firestore');
      }
      
      // Show timeout notification
      notifyInfo('⏰ Practice session ended - 3 minute limit reached');
      
      // Update UI to show timeout state
      setError('Session timed out after 3 minutes');
      setErrorType('timeout');
      setLoading(false);
      setConnectionStatus('disconnected');
      
      // Close modal after delay to let user see the message
      setTimeout(() => {
        onClose();
      }, 3000);
      
    } catch (error) {
      console.error('❌ Error ending timed-out conversation:', error);
      
      // Show appropriate error message
      if (error instanceof TavusNetworkError) {
        notifyWarning('📡 Session ended offline - will sync when connection is restored');
      } else {
        notifyError('⚠️ Error ending session, but time limit was reached');
      }
      
      // Still close the modal even if API call fails
      setTimeout(() => {
        onClose();
      }, 2000);
    } finally {
      setIsEndingConversation(false);
    }
  };

  // Enhanced session initialization with better error handling
  const initializeTavusSession = async () => {
    if (!currentUser || !course?.id || !conversationUrl) {
      console.error('❌ Cannot initialize session - missing required data');
      setError('Missing required information for AI practice session');
      setErrorType('config');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      setErrorType('general');
      setConversationStarted(false);
      setProgress(0);
      setRetryCount(0);
      setConnectionStatus('connecting');
      setTimeRemaining(180);
      setShowTimeoutWarning(false);
      setIsTimedOut(false);
      setIsEndingConversation(false);
      setCanRetry(true);
      setMaxRetriesReached(false);
      
      console.log('🚀 Initializing Tavus session with dynamic URL:', conversationUrl);
      
      // Set loading timeout (20 seconds)
      const timeout = setTimeout(() => {
        if (loading && !isTimedOut) {
          setError('Connection timeout. Please check your internet connection and try again.');
          setErrorType('timeout');
          setLoading(false);
          setConnectionStatus('disconnected');
        }
      }, 20000);
      
      setTimeoutId(timeout);
      
    } catch (error) {
      console.error('❌ Error initializing Tavus session:', error);
      handleInitializationError(error);
    }
  };

  // Enhanced error handling for initialization
  const handleInitializationError = (error: any) => {
    console.error('❌ Initialization error:', error);
    
    let errorMessage = 'Failed to start AI practice session. Please try again.';
    let errorCategory: typeof errorType = 'general';
    let retryable = true;
    
    if (error instanceof TavusNetworkError) {
      errorMessage = 'Network connection issue. Please check your internet and try again.';
      errorCategory = 'network';
    } else if (error instanceof TavusConfigError) {
      errorMessage = 'AI practice is not properly configured. Please contact support.';
      errorCategory = 'config';
      retryable = false;
    } else if (error instanceof TavusAPIError) {
      errorMessage = 'AI service is temporarily unavailable. Please try again later.';
      errorCategory = 'api';
    } else if (error instanceof TavusTimeoutError) {
      errorMessage = 'Request timed out. Please check your connection and try again.';
      errorCategory = 'timeout';
    }
    
    setError(errorMessage);
    setErrorType(errorCategory);
    setLoading(false);
    setConnectionStatus('disconnected');
    setCanRetry(retryable);
  };

  // Cleanup session
  const cleanupSession = () => {
    document.body.style.overflow = 'unset';
    
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }

    if (countdownTimer) {
      clearInterval(countdownTimer);
      setCountdownTimer(null);
    }

    // Mark session as abandoned if it was started but not completed and not timed out
    if (sessionId && !conversationStarted && !isTimedOut) {
      executeWithOfflineFallback(
        () => updateTavusSession(sessionId, { status: 'abandoned' }),
        {
          operation: 'updateSession',
          data: { sessionId, updates: { status: 'abandoned' } }
        },
        'Mark session as abandoned'
      ).catch(console.error);
    }
  };

  // Enhanced message event handler with better error handling
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (!isOpen || !course || !currentUser || isTimedOut) return;

      // Enhanced origin validation
      if (!validateMessageOrigin(event.origin)) {
        console.warn('🚫 Received message from invalid origin:', event.origin);
        return;
      }

      // Parse and validate message
      const tavusMessage = parseAndValidateMessage(event.data);
      if (!tavusMessage) return;

      console.log('📨 Received Tavus message:', tavusMessage);

      // Handle message with enhanced retry logic
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
          setErrorType(error instanceof TavusNetworkError ? 'network' : 
                     error instanceof TavusConfigError ? 'config' :
                     error instanceof TavusAPIError ? 'api' : 'general');
        } else {
          setError('Unexpected error during AI practice session');
          setErrorType('general');
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isOpen, course, currentUser, sessionId, isTimedOut]);

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
    if (isTimedOut) return;
    
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
    if (isTimedOut) return;
    
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
      await executeWithOfflineFallback(
        () => updateTavusSession(sessionId, {
          status: 'in_progress',
          conversationId: message.data?.conversationId
        }),
        {
          operation: 'updateSession',
          data: {
            sessionId,
            updates: {
              status: 'in_progress',
              conversationId: message.data?.conversationId
            }
          }
        },
        'Update session to in_progress'
      );
    }
  };

  // Handle Tavus started
  const handleTavusStarted = async (message: TavusMessage): Promise<void> => {
    if (isTimedOut) return;
    
    console.log('🎬 Tavus conversation started');
    setConversationStarted(true);
    setConversationId(message.data?.conversationId || '');
    
    // Update session status
    if (sessionId) {
      await executeWithOfflineFallback(
        () => updateTavusSession(sessionId, {
          status: 'in_progress',
          conversationId: message.data?.conversationId
        }),
        {
          operation: 'updateSession',
          data: {
            sessionId,
            updates: {
              status: 'in_progress',
              conversationId: message.data?.conversationId
            }
          }
        },
        'Update session with conversation ID'
      );
    }

    notifyInfo('🎬 AI conversation started! You have 3 minutes to complete the practice.');
  };

  // Handle Tavus progress
  const handleTavusProgress = (message: TavusMessage): void => {
    if (isTimedOut) return;
    
    if (message.data?.progress !== undefined) {
      setProgress(Math.min(100, Math.max(0, message.data.progress)));
    }
  };

  // Enhanced Tavus completion handling
  const handleTavusCompletion = async (message: TavusMessage): Promise<void> => {
    if (!message.data?.completed || !currentUser || !course?.id || isTimedOut) return;

    console.log('🎉 Tavus conversation completed:', message.data);

    // Clear countdown timer
    if (countdownTimer) {
      clearInterval(countdownTimer);
      setCountdownTimer(null);
    }

    try {
      const completion: TavusCompletion = {
        completed: true,
        accuracyScore: message.data.accuracyScore,
        conversationId: message.data.conversationId || conversationId,
        completedAt: new Date().toISOString()
      };

      // Complete session with offline fallback
      await executeWithOfflineFallback(
        () => updateTavusSession(sessionId, {
          status: 'completed',
          completedAt: completion.completedAt,
          accuracyScore: completion.accuracyScore,
          conversationId: completion.conversationId,
          duration: 180 - timeRemaining
        }),
        {
          operation: 'updateCompletion',
          data: {
            userId: currentUser.uid,
            courseId: course.id,
            completion
          }
        },
        'Complete session'
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
      
      if (error instanceof TavusNetworkError) {
        notifyWarning('📡 Completion saved offline. Will sync when connection is restored.');
      } else {
        notifyError('Failed to save completion status. Please try again.');
      }
    }
  };

  // Enhanced Tavus error handling
  const handleTavusError = (message: TavusMessage): void => {
    const errorMsg = message.data?.error || 'An error occurred during the conversation';
    console.error('❌ Tavus error:', errorMsg);
    
    setError(errorMsg);
    setErrorType('api');
    setLoading(false);
    setConnectionStatus('disconnected');

    // Update session status
    if (sessionId) {
      executeWithOfflineFallback(
        () => updateTavusSession(sessionId, {
          status: 'failed',
          metadata: { lastError: errorMsg }
        }),
        {
          operation: 'updateSession',
          data: {
            sessionId,
            updates: {
              status: 'failed',
              metadata: { lastError: errorMsg }
            }
          }
        },
        'Update session with error'
      ).catch(console.error);
    }
  };

  // Handle iframe events
  const handleIframeLoad = () => {
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
    console.error('❌ Tavus iframe failed to load');
    setError('Failed to load AI conversation. Please check your connection and try again.');
    setErrorType('network');
    setLoading(false);
    setConnectionStatus('disconnected');
    setRetryCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 3) {
        setMaxRetriesReached(true);
        setCanRetry(false);
      }
      return newCount;
    });
  };

  // Send message to iframe
  const sendMessageToIframe = (message: any) => {
    if (iframeRef.current && conversationUrl) {
      try {
        const iframeWindow = iframeRef.current.contentWindow;
        if (iframeWindow) {
          iframeWindow.postMessage(
            message,
            new URL(conversationUrl).origin
          );
        }
      } catch (error) {
        console.warn('⚠️ Could not send message to iframe:', error);
      }
    }
  };

  // Enhanced retry with exponential backoff
  const handleRetry = async () => {
    if (isTimedOut || !canRetry) return;
    
    const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 10000);
    
    setError('');
    setLoading(true);
    setConnectionStatus('connecting');
    
    // Wait for backoff delay
    await new Promise(resolve => setTimeout(resolve, backoffDelay));
    
    // Reload iframe
    if (iframeRef.current && conversationUrl) {
      iframeRef.current.src = conversationUrl;
    }
    
    setRetryCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 3) {
        setMaxRetriesReached(true);
        setCanRetry(false);
      }
      return newCount;
    });
  };

  // Enhanced backdrop click handling
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      if (conversationStarted && progress > 0 && !isTimedOut) {
        const confirmed = window.confirm(
          'Are you sure you want to exit? Your progress in this AI practice session will be lost.'
        );
        if (!confirmed) return;
      }
      onClose();
    }
  };

  // Keyboard event handling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        if (conversationStarted && progress > 0 && !isTimedOut) {
          notifyWarning('⚠️ Press Escape again to exit and lose progress.');
          return;
        }
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, conversationStarted, progress, onClose, isTimedOut]);

  // Format time remaining for display
  const formatTimeRemaining = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Get timer color based on remaining time
  const getTimerColor = (seconds: number): string => {
    if (seconds <= 10) return 'bg-red-100 text-red-700 border-red-200';
    if (seconds <= 30) return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-blue-100 text-blue-700 border-blue-200';
  };

  // Get error icon based on error type
  const getErrorIcon = () => {
    switch (errorType) {
      case 'network':
        return <WifiOff className="h-12 w-12 text-red-400" />;
      case 'config':
        return <ExclamationTriangle className="h-12 w-12 text-yellow-400" />;
      case 'timeout':
        return <Clock className="h-12 w-12 text-orange-400" />;
      case 'api':
        return <MessageCircle className="h-12 w-12 text-red-400" />;
      default:
        return <AlertCircle className="h-12 w-12 text-red-400" />;
    }
  };

  // Get error title based on error type
  const getErrorTitle = () => {
    switch (errorType) {
      case 'network':
        return 'Connection Problem';
      case 'config':
        return 'Configuration Issue';
      case 'timeout':
        return isTimedOut ? 'Session Timed Out' : 'Connection Timeout';
      case 'api':
        return 'AI Service Error';
      default:
        return 'AI Practice Error';
    }
  };

  if (!isOpen || !course || !conversationUrl) return null;

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
        {/* Enhanced Header with Connection Status and Timer */}
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
          
          <div className="flex items-center space-x-4">
            {/* Enhanced Timer Display */}
            {conversationStarted && !isTimedOut && (
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${getTimerColor(timeRemaining)}`}>
                <Timer className="h-4 w-4" />
                <span className="text-sm font-bold">
                  {formatTimeRemaining(timeRemaining)}
                </span>
                {timeRemaining <= 30 && (
                  <span className="text-xs font-medium">
                    remaining
                  </span>
                )}
              </div>
            )}

            {/* Timeout indicator */}
            {isTimedOut && (
              <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-100 text-red-700 border border-red-200">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-bold">
                  Time's Up!
                </span>
              </div>
            )}
            
            {/* Enhanced Connection Status Indicator */}
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
          {/* Loading State */}
          {loading && !isTimedOut && (
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

          {/* Enhanced Error State */}
          {error && (
            <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
              <div className="text-center max-w-md mx-auto p-6">
                {getErrorIcon()}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {getErrorTitle()}
                </h3>
                <p className="text-base text-gray-600 mb-6">{error}</p>
                
                {/* Enhanced error-specific guidance */}
                {errorType === 'timeout' && isTimedOut && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-2 text-blue-800 mb-2">
                      <Clock className="h-5 w-5" />
                      <span className="text-sm font-medium">3-minute session completed</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Your practice session has ended. You can start a new session anytime!
                    </p>
                  </div>
                )}
                
                {errorType === 'network' && !isOnline && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-2 text-yellow-800 mb-2">
                      <WifiOff className="h-5 w-5" />
                      <span className="text-sm font-medium">No internet connection</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      Your progress will be saved when connection is restored.
                    </p>
                  </div>
                )}

                {errorType === 'config' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-2 text-yellow-800 mb-2">
                      <ExclamationTriangle className="h-5 w-5" />
                      <span className="text-sm font-medium">Setup required</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      AI practice needs to be configured by an administrator.
                    </p>
                  </div>
                )}

                {maxRetriesReached && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-red-800">
                      Maximum retry attempts reached. Please try again later or contact support.
                    </p>
                  </div>
                )}
                
                <div className="space-y-3">
                  {!isTimedOut && canRetry && (
                    <button
                      onClick={handleRetry}
                      disabled={!isOnline || isEndingConversation || maxRetriesReached}
                      className={`w-full px-6 py-3 rounded-[10px] text-base font-medium transition-all flex items-center justify-center space-x-2 ${
                        isOnline && !isEndingConversation && !maxRetriesReached
                          ? 'bg-[#FF7A59] text-white hover:bg-[#FF8A6B]'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span>
                        {!isOnline ? 'Waiting for Connection' : 
                         maxRetriesReached ? 'Max Retries Reached' : 'Try Again'}
                      </span>
                    </button>
                  )}
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

          {/* Timeout Warning Overlay */}
          {showTimeoutWarning && !isTimedOut && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
              <div className="bg-orange-100 border border-orange-300 rounded-lg px-4 py-2 shadow-lg">
                <div className="flex items-center space-x-2 text-orange-800">
                  <Timer className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {timeRemaining}s remaining - conversation will end soon!
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tavus Iframe */}
          <div className="w-full h-[70vh] min-h-[500px]">
            <iframe
              ref={iframeRef}
              src={conversationUrl}
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
        </div>

        {/* Enhanced Footer with Progress and Timer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Enhanced Status Indicator */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className={`w-2 h-2 rounded-full ${
                  isTimedOut ? 'bg-red-500' :
                  conversationStarted ? 'bg-green-500' : 
                  connectionStatus === 'connected' ? 'bg-yellow-500' : 'bg-gray-400'
                }`}></div>
                <span>
                  {isTimedOut ? 'Session timed out' :
                   conversationStarted ? 'Conversation in progress' : 
                   connectionStatus === 'connected' ? 'Ready to start' : 'Connecting...'}
                </span>
              </div>
              
              {/* Progress Bar */}
              {conversationStarted && progress > 0 && !isTimedOut && (
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

              {/* Retry count indicator */}
              {retryCount > 0 && (
                <div className="text-sm text-gray-500">
                  Retry {retryCount}/3
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <p className="text-sm text-gray-600">
                {isTimedOut ? 'Session ended after 3 minutes' :
                 conversationStarted ? `${formatTimeRemaining(timeRemaining)} remaining` :
                 'Complete the conversation to mark this course as finished'}
              </p>
              <button
                onClick={onClose}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-[8px] text-sm font-medium hover:bg-gray-100 transition-all"
              >
                {isTimedOut ? 'Close' : 'Exit Practice'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TavusModal;