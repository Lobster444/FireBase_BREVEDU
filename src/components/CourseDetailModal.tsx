import React, { useState, useEffect, useRef } from 'react';
import { X, Clock, MessageCircle, CheckCircle } from 'lucide-react';
import { Course, hasTavusCompletion, getTavusCompletion } from '../types';
import { useAuth } from '../contexts/AuthContext';
import ProgressBar from './ProgressBar';
import TavusModal from './TavusModal';
import TavusConfirmationModal from './TavusConfirmationModal';
import VideoPlayerSection from './VideoPlayerSection';
import AIPracticeSection from './AIPracticeSection';
import CourseDetailsSection from './CourseDetailsSection';
import QuickFacts from './QuickFacts';
import ActionButtonsSection from './ActionButtonsSection';
import TavusUnavailableModal from './TavusUnavailableModal';
import { useTavusSettings } from '../hooks/useTavusSettings';
import { getUserUsageStatus } from '../services/tavusUsage';
import { 
  createTavusConversation, 
  startTavusSession,
  TavusError,
  TavusNetworkError,
  TavusConfigError,
  TavusAPIError,
  TavusTimeoutError,
  TavusLimitError
} from '../lib/tavusService';
import { canStartConversation } from '../services/tavusUsage';
import { notifyError, notifySuccess, notifyLoading, updateToast, notifyWarning } from '../lib/toast';
import { trackCourseEvent, trackInteraction } from '../lib/analytics';

interface CourseDetailModalProps {
  isOpen: boolean;
  course: Course | null;
  onClose: () => void;
}

const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  isOpen,
  course,
  onClose
}) => {
  const { currentUser } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [showTavusModal, setShowTavusModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [tavusCompleted, setTavusCompleted] = useState(false);
  const [tavusAccuracy, setTavusAccuracy] = useState<number | undefined>(undefined);
  const [tavusConversationUrl, setTavusConversationUrl] = useState<string>('');
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  
  // Store session and conversation IDs for timeout handling
  const [sessionId, setSessionId] = useState<string>('');
  const [tavusConversationId, setTavusConversationId] = useState<string>('');
  
  // Tavus settings and unavailable modal
  const { isEnabled: isTavusEnabled } = useTavusSettings();
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
  
  // Usage tracking state
  const [usageStatus, setUsageStatus] = useState<{
    canStart: boolean;
    used: number;
    limit: number;
    remaining: number;
    tier: string;
    resetTime: string;
  } | null>(null);
  const [loadingUsage, setLoadingUsage] = useState(false);

  // Reset states when modal opens/closes or course changes
  useEffect(() => {
    if (isOpen && course) {
      // Track course view
      trackCourseEvent('course_view', course.id!, course.title);
      
      setVideoError(false);
      setIsVideoLoading(true);
      setShowTavusModal(false);
      setShowConfirmationModal(false);
      setTavusConversationUrl('');
      setIsCreatingConversation(false);
      setSessionId('');
      setTavusConversationId('');
      
      // Check Tavus completion status
      if (currentUser && course.id) {
        const completion = getTavusCompletion(currentUser, course.id);
        setTavusCompleted(completion?.completed || false);
        setTavusAccuracy(completion?.accuracyScore);
      } else {
        setTavusCompleted(false);
        setTavusAccuracy(undefined);
      }
      
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll when modal is closed
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, course, currentUser]);
  
  // Fetch usage status when modal opens and user changes
  useEffect(() => {
    if (isOpen && currentUser) {
      setLoadingUsage(true);
      getUserUsageStatus(currentUser)
        .then(status => {
          setUsageStatus(status);
        })
        .catch(error => {
          console.error('Error fetching usage status:', error);
          setUsageStatus(null);
        })
        .finally(() => {
          setLoadingUsage(false);
        });
    } else {
      setUsageStatus(null);
    }
  }, [isOpen, currentUser]);

  // Keyboard event handling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }

      // Focus trap
      if (event.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements && focusableElements.length > 0) {
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Get AI practice availability based on user type
  const getAIPracticeStatus = () => {
    // Check if Tavus is disabled by admin first
    if (!isTavusEnabled) {
      return { 
        available: false, 
        reason: 'We’re currently working on this issue and will have it resolved shortly',
        isDisabledByAdmin: true
      };
    }
    
    if (!currentUser) {
      return { available: false, reason: 'Sign in required' };
    }

    // Check if course has AI practice capability (either static URL or can create dynamic conversation)
    const hasAIPractice = course?.tavusConversationUrl || course?.id;
    if (!hasAIPractice) {
      return { available: false, reason: 'AI practice not available for this course' };
    }

    if (currentUser.role === 'anonymous') {
      return { available: false, reason: 'Create account to practice' };
    }

    // Use real-time usage status from Firestore
    if (loadingUsage) {
      return { available: false, reason: 'Checking availability...' };
    }
    
    if (!usageStatus) {
      return { available: false, reason: 'Unable to check session availability' };
    }
    
    if (usageStatus.remaining === 0) {
      const upgradeMessage = currentUser.role === 'free' 
        ? 'Daily limit reached. Upgrade for more!'
        : 'Daily limit reached. More sessions tomorrow!';
      return { 
        available: false, 
        reason: upgradeMessage,
        isLimitReached: true
      };
    }
    
    const sessionText = usageStatus.remaining === 1 ? 'session' : 'sessions';
    return { 
      available: true, 
      reason: `${usageStatus.remaining} practice ${sessionText} remaining today` 
    };
  };

  // Show confirmation modal for AI practice
  const handleAIPractice = () => {
    const status = getAIPracticeStatus();
    
    // Check if disabled by admin
    if (status.isDisabledByAdmin) {
      setShowUnavailableModal(true);
      return;
    }
    
    if (status.available && course?.id) {
      console.log('🎯 Showing confirmation modal for course:', course.title);
      trackInteraction('ai_practice_button', 'click', 'course_modal');
      setShowConfirmationModal(true);
    } else {
      console.log('❌ AI practice not available:', status.reason);
    }
  };

  // Enhanced handle confirmed start with comprehensive error handling
  const handleConfirmStart = async () => {
    if (!currentUser || !course?.id) {
      console.error('❌ Missing user or course for Tavus conversation creation');
      notifyError('Unable to start practice session. Please try again.');
      return;
    }

    // Check usage limits before proceeding
    try {
      await canStartConversation(currentUser);
      console.log('✅ Usage check passed - user can start conversation');
    } catch (error: any) {
      console.warn('⚠️ Usage limit reached:', error.message);
      notifyError(error.message);
      setShowConfirmationModal(false);
      return;
    }

    console.log('✅ User confirmed - creating Tavus conversation via API for course:', course.title);
    setShowConfirmationModal(false);
    setIsCreatingConversation(true);

    const toastId = notifyLoading('Creating AI practice session...');

    try {
      // Step 1: Create session in Firestore
      const newSessionId = await startTavusSession(currentUser.uid, course.id, 120); // 2 minutes
      console.log('📝 Created session:', newSessionId);
      setSessionId(newSessionId);

      // Step 2: Create Tavus conversation via API
      const conversationData = await createTavusConversation(course.id, currentUser.uid, newSessionId);
      console.log('🎬 Created Tavus conversation:', conversationData);

      // Step 3: Store conversation details and open modal
      setTavusConversationUrl(conversationData.conversation_url);
      setTavusConversationId(conversationData.conversation_id);
      updateToast(toastId, '✅ AI practice session ready!', 'success');
      
      // Small delay to show success message
      setTimeout(() => {
        setShowTavusModal(true);
      }, 1000);

    } catch (error: any) {
      console.error('❌ Error creating Tavus conversation:', error);
      
      let errorMessage = 'Failed to create AI practice session. Please try again.';
      let shouldShowRetry = true;
      
      // Enhanced error categorization
      if (error instanceof TavusConfigError) {
        if (error.message.includes('settings not configured')) {
          errorMessage = 'AI practice is not configured. Please contact support.';
          shouldShowRetry = false;
        } else if (error.message.includes('temporarily disabled by the administrator')) {
          errorMessage = 'AI conversations are temporarily unavailable. Please try again later.';
          shouldShowRetry = false;
        } else if (error.message.includes('conversational context')) {
          errorMessage = 'This course is not set up for AI practice yet.';
          shouldShowRetry = false;
        } else {
          errorMessage = 'AI practice configuration issue. Please contact support.';
          shouldShowRetry = false;
        }
      } else if (error instanceof TavusLimitError) {
        // Handle usage limits as warnings, not errors
        updateToast(toastId, `⚠️ ${error.message}`, 'warning');
        return; // Exit early to avoid showing error styling
      } else if (error instanceof TavusNetworkError) {
        errorMessage = 'Network connection issue. Please check your internet and try again.';
        notifyWarning('📡 You can try again when your connection is stable.');
      } else if (error instanceof TavusAPIError) {
        if (error.details?.status === 429) {
          errorMessage = 'AI service is busy. Please try again in a few minutes.';
        } else if (error.details?.status >= 500) {
          errorMessage = 'AI service is temporarily unavailable. Please try again later.';
        } else if (error.details?.status === 401) {
          errorMessage = 'AI service authentication issue. Please contact support.';
          shouldShowRetry = false;
        } else {
          errorMessage = 'AI service error. Please try again or contact support.';
        }
      } else if (error instanceof TavusTimeoutError) {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      } else if (error instanceof TavusError) {
        errorMessage = `AI Practice Error: ${error.message}`;
        shouldShowRetry = error.retryable;
      }
      
      updateToast(toastId, `❌ ${errorMessage}`, 'error');
      
      // Show retry guidance if applicable
      if (shouldShowRetry) {
        setTimeout(() => {
          notifyWarning('💡 You can try starting the practice session again.');
        }, 3000);
      }
    } finally {
      setIsCreatingConversation(false);
    }
  };

  const handleTavusCompletion = (completion: any) => {
    console.log('🎉 Tavus practice completed:', completion);
    
    // Track AI practice completion
    if (course?.id) {
      trackCourseEvent('ai_practice_complete', course.id, course.title, {
        accuracy_score: completion.accuracyScore,
        duration: completion.duration
      });
    }
    
    setTavusCompleted(true);
    setTavusAccuracy(completion.accuracyScore);
    setShowTavusModal(false);
  };

  const handleRetakePractice = () => {
    console.log('🔄 Retaking Tavus practice for course:', course?.title);
    setShowConfirmationModal(true);
  };

  const handleMoreCourses = () => {
    trackInteraction('more_courses_button', 'click', 'course_modal');
    // The ActionButtonsSection component now handles navigation internally
    // This function is kept for compatibility but may not be used
  };

  if (!isOpen || !course) return null;

  const aiPracticeStatus = getAIPracticeStatus();

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="course-modal-title"
        aria-describedby="course-modal-description"
      >
        <div 
          ref={modalRef}
          className="bg-white rounded-[1.6rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto md:max-h-[85vh] shadow-xl"
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-black/5">
            <div className="flex-1 pr-4">
              <div className="flex items-center flex-wrap gap-2 mb-3">
                <span className="text-sm text-cobalt bg-cobalt/10 px-3 py-1 rounded-[0.8rem] font-semibold">
                  {course.category}
                </span>
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                  (course.accessLevel || 'free') === 'premium' 
                    ? 'bg-currant text-white' 
                    : 'bg-kelp text-white'
                }`}>
                  {(course.accessLevel || 'free') === 'premium' ? 'Premium' : 'Free'}
                </span>
                <div className="flex items-center space-x-1 text-sm text-gray-600 whitespace-nowrap">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
                {!course.published && (
                  <span className="text-sm text-amethyst bg-thistle/50 px-3 py-1 rounded-[0.8rem] font-semibold">
                    Draft
                  </span>
                )}
                {(course.tavusConversationUrl || course.conversationalContext || course.id) && (
                  <span className="text-sm text-cobalt bg-cobalt/10 px-3 py-1 rounded-[0.8rem] font-semibold flex items-center space-x-1">
                    <MessageCircle className="h-3 w-3" />
                    <span>AI Practice</span>
                  </span>
                )}
              </div>
              <h1 id="course-modal-title" className="text-2xl font-bold text-black mb-2 leading-tight">
                {course.title}
              </h1>
            </div>
            <button
              onClick={onClose}
              className="icon-button icon-button-gray p-2 rounded-[0.8rem] flex-shrink-0"
              aria-label="Close course details"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 relative">
              {/* Left Column - Video and Description */}
              <div className="lg:col-span-2 flex flex-col space-y-8">
                {/* Video Player */}
                <VideoPlayerSection
                  videoUrl={course.videoUrl}
                  thumbnailUrl={course.thumbnailUrl}
                  courseTitle={course.title}
                  userId={currentUser?.uid}
                  courseId={course.id}
                  onVideoError={setVideoError}
                  onVideoLoading={setIsVideoLoading}
                  videoError={videoError}
                  isVideoLoading={isVideoLoading}
                />

                {/* Course Details */}
                <CourseDetailsSection
                  course={course}
                  tavusCompleted={tavusCompleted}
                />
              </div>

              {/* Quick Facts - Mobile only, appears at bottom */}
              <QuickFacts 
                course={course} 
                tavusCompleted={tavusCompleted} 
                className="order-last lg:hidden" 
              />

              {/* Right Column - Thumbnail and Actions */}
              <div className="space-y-6">
                {/* Action Buttons */}
                <div className="space-y-4">
                  {/* AI Practice Button */}
                  <AIPracticeSection
                    course={course}
                    currentUser={currentUser}
                    tavusCompleted={tavusCompleted}
                    tavusAccuracy={tavusAccuracy}
                    aiPracticeStatus={aiPracticeStatus}
                    onAIPractice={handleAIPractice}
                    onRetakePractice={handleRetakePractice}
                  />

                  {/* Other Action Buttons */}
                  <ActionButtonsSection
                    currentUser={currentUser}
                    onMoreCourses={handleMoreCourses}
                    onClose={onClose}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal - Shows first */}
      <TavusConfirmationModal
        isOpen={showConfirmationModal}
        course={course}
        onClose={() => setShowConfirmationModal(false)}
        onConfirmStart={handleConfirmStart}
      />

      {/* Tavus Modal - Only shows after API conversation is created */}
      <TavusModal
        isOpen={showTavusModal}
        course={course}
        onClose={() => setShowTavusModal(false)}
        onCompletion={handleTavusCompletion}
        conversationUrl={tavusConversationUrl} // Pass the dynamically created URL
        sessionId={sessionId} // Pass session ID for timeout handling
        tavusConversationId={tavusConversationId} // Pass Tavus conversation ID for API calls
      />
      
      {/* Tavus Unavailable Modal */}
      <TavusUnavailableModal
        isOpen={showUnavailableModal}
        onClose={() => setShowUnavailableModal(false)}
      />
    </>
  );
};

export default CourseDetailModal;