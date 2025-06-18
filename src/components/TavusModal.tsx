import React, { useState, useEffect, useRef } from 'react';
import { X, MessageCircle, AlertCircle, Loader2, CheckCircle, RefreshCw } from 'lucide-react';
import { Course, TavusCompletion } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { updateTavusCompletion } from '../lib/userService';
import { notifySuccess, notifyError, notifyWarning } from '../lib/toast';

interface TavusModalProps {
  isOpen: boolean;
  course: Course | null;
  onClose: () => void;
  onCompletion?: (completion: TavusCompletion) => void;
}

interface TavusMessage {
  type: 'tavus_completion' | 'tavus_error' | 'tavus_ready' | 'tavus_started';
  data?: {
    completed?: boolean;
    accuracyScore?: number;
    conversationId?: string;
    error?: string;
    timestamp?: string;
  };
}

const TavusModal: React.FC<TavusModalProps> = ({
  isOpen,
  course,
  onClose,
  onCompletion
}) => {
  const { currentUser } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [conversationStarted, setConversationStarted] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Reset states when modal opens/closes
  useEffect(() => {
    if (isOpen && course) {
      setLoading(true);
      setError('');
      setConversationStarted(false);
      
      // Set a timeout for iframe loading
      const timeout = setTimeout(() => {
        if (loading) {
          setError('Failed to load Tavus conversation. Please check your connection and try again.');
          setLoading(false);
        }
      }, 15000); // 15 second timeout
      
      setTimeoutId(timeout);
      
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll when modal is closed
      document.body.style.overflow = 'unset';
      
      // Clear timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(null);
      }
    }

    return () => {
      document.body.style.overflow = 'unset';
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isOpen, course]);

  // Message event handler for Tavus callbacks
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (!isOpen || !course || !currentUser) return;

      // Validate message origin for security
      try {
        const messageUrl = new URL(event.origin);
        const validDomains = [
          'tavus.io',
          'app.tavus.io',
          'api.tavus.io',
          'embed.tavus.io',
          'conversation.tavus.io'
        ];
        
        const isValidOrigin = validDomains.some(domain => 
          messageUrl.hostname === domain || messageUrl.hostname.endsWith(`.${domain}`)
        );
        
        if (!isValidOrigin) {
          console.warn('🚫 Received message from invalid origin:', event.origin);
          return;
        }
      } catch (error) {
        console.warn('🚫 Invalid origin URL:', event.origin);
        return;
      }

      // Parse Tavus message
      let tavusMessage: TavusMessage;
      try {
        if (typeof event.data === 'string') {
          tavusMessage = JSON.parse(event.data);
        } else {
          tavusMessage = event.data;
        }
      } catch (error) {
        console.warn('📨 Could not parse Tavus message:', event.data);
        return;
      }

      console.log('📨 Received Tavus message:', tavusMessage);

      // Handle different message types
      switch (tavusMessage.type) {
        case 'tavus_ready':
          console.log('✅ Tavus conversation ready');
          setLoading(false);
          setError('');
          break;

        case 'tavus_started':
          console.log('🎬 Tavus conversation started');
          setConversationStarted(true);
          break;

        case 'tavus_completion':
          if (tavusMessage.data?.completed) {
            console.log('🎉 Tavus conversation completed:', tavusMessage.data);
            await handleTavusCompletion(tavusMessage.data);
          }
          break;

        case 'tavus_error':
          console.error('❌ Tavus error:', tavusMessage.data?.error);
          setError(tavusMessage.data?.error || 'An error occurred during the conversation');
          setLoading(false);
          break;

        default:
          console.log('📨 Unknown Tavus message type:', tavusMessage.type);
      }
    };

    // Add message event listener
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [isOpen, course, currentUser]);

  // Handle Tavus completion
  const handleTavusCompletion = async (completionData: any) => {
    if (!currentUser || !course?.id) {
      console.error('❌ Missing user or course data for completion');
      return;
    }

    try {
      const completion: TavusCompletion = {
        completed: true,
        accuracyScore: completionData.accuracyScore || undefined,
        conversationId: completionData.conversationId || undefined,
        completedAt: new Date().toISOString()
      };

      // Save completion to Firestore
      await updateTavusCompletion(currentUser.uid, course.id, completion);

      // Show success notification
      const accuracyText = completion.accuracyScore 
        ? ` with ${completion.accuracyScore}% accuracy` 
        : '';
      
      notifySuccess(`🎉 You completed the AI practice session${accuracyText} — course complete!`);

      // Call completion callback
      onCompletion?.(completion);

      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      console.error('❌ Error saving Tavus completion:', error);
      notifyError('Failed to save completion status. Please try again.');
    }
  };

  // Handle iframe load
  const handleIframeLoad = () => {
    console.log('📺 Tavus iframe loaded');
    
    // Clear timeout since iframe loaded successfully
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    
    // Send ready message to iframe if needed
    if (iframeRef.current && course?.tavusConversationUrl) {
      try {
        const iframeWindow = iframeRef.current.contentWindow;
        if (iframeWindow) {
          iframeWindow.postMessage(
            { type: 'parent_ready', courseId: course.id },
            new URL(course.tavusConversationUrl).origin
          );
        }
      } catch (error) {
        console.warn('⚠️ Could not send ready message to iframe:', error);
      }
    }
  };

  // Handle iframe error
  const handleIframeError = () => {
    console.error('❌ Tavus iframe failed to load');
    setError('Failed to load Tavus conversation. Please check your connection and try again.');
    setLoading(false);
  };

  // Handle retry
  const handleRetry = () => {
    setError('');
    setLoading(true);
    setConversationStarted(false);
    
    // Reload iframe
    if (iframeRef.current && course?.tavusConversationUrl) {
      iframeRef.current.src = course.tavusConversationUrl;
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      if (conversationStarted) {
        // Show warning if conversation is in progress
        notifyWarning('⚠️ Are you sure you want to exit? Your progress may be lost.');
        return;
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
        if (conversationStarted) {
          notifyWarning('⚠️ Press Escape again to exit and lose progress.');
          return;
        }
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, conversationStarted, onClose]);

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
        {/* Header */}
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
          
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-[8px] hover:bg-gray-50"
            aria-label="Close AI practice session"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="relative">
          {/* Loading State */}
          {loading && (
            <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
              <div className="text-center">
                <Loader2 className="h-8 w-8 text-[#FF7A59] animate-spin mx-auto mb-4" />
                <p className="text-lg text-gray-700 mb-2">Loading AI conversation...</p>
                <p className="text-base text-gray-600">This may take a few moments</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
              <div className="text-center max-w-md mx-auto p-6">
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Connection Error</h3>
                <p className="text-base text-gray-600 mb-6">{error}</p>
                <div className="space-y-3">
                  <button
                    onClick={handleRetry}
                    className="w-full bg-[#FF7A59] text-white px-6 py-3 rounded-[10px] text-base font-medium hover:bg-[#FF8A6B] transition-all flex items-center justify-center space-x-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Try Again</span>
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

          {/* Tavus Iframe */}
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
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className={`w-2 h-2 rounded-full ${conversationStarted ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span>{conversationStarted ? 'Conversation in progress' : 'Waiting to start'}</span>
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
      </div>
    </div>
  );
};

export default TavusModal;