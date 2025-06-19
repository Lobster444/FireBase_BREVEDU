import React, { useState, useEffect, useRef } from 'react';
import { X, Clock, MessageCircle, CheckCircle } from 'lucide-react';
import { Course, hasTavusCompletion, getTavusCompletion } from '../types';
import { useAuth } from '../contexts/AuthContext';
import ProgressBar from './ProgressBar';
import TavusModal from './TavusModal';
import TavusConfirmationModal from './TavusConfirmationModal';
import VideoPlayerSection from './VideoPlayerSection';
import ThumbnailSection from './ThumbnailSection';
import AIPracticeSection from './AIPracticeSection';
import CourseDetailsSection from './CourseDetailsSection';
import ActionButtonsSection from './ActionButtonsSection';
import { 
  createTavusConversation, 
  startTavusSession,
  TavusError,
  TavusNetworkError,
  TavusConfigError,
  TavusAPIError,
  TavusTimeoutError
} from '../lib/tavusService';
import { canStartConversation } from '../services/tavusUsage';
import { notifyError, notifySuccess, notifyLoading, updateToast, notifyWarning } from '../lib/toast';
import { subscribeToCourseProgress } from '../lib/progressService';

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
  const [imageError, setImageError] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [showTavusModal, setShowTavusModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [tavusCompleted, setTavusCompleted] = useState(false);
  const [tavusAccuracy, setTavusAccuracy] = useState<number | undefined>(undefined);
  const [tavusConversationUrl, setTavusConversationUrl] = useState<string>('');
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [courseProgress, setCourseProgress] = useState(0);
  
  // Store session and conversation IDs for timeout handling
  const [sessionId, setSessionId] = useState<string>('');
  const [tavusConversationId, setTavusConversationId] = useState<string>('');

  // Reset states when modal opens/closes or course changes
  useEffect(() => {
    if (isOpen && course) {
      setVideoError(false);
      setImageError(false);
      setIsVideoLoading(true);
      setShowTavusModal(false);
      setShowConfirmationModal(false);
      setTavusConversationUrl('');
      setIsCreatingConversation(false);
      setSessionId('');
      setTavusConversationId('');
      setCourseProgress(0);
      
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
      
      // Set up progress subscription for authenticated users
      let unsubscribeProgress: (() => void) | undefined;
      if (currentUser && course.id) {
        console.log('📊 Setting up progress subscription for course:', course.id);
        unsubscribeProgress = subscribeToCourseProgress(
          currentUser.uid,
          course.id,
          (progress) => {
            console.log('📈 Progress updated:', progress);
            setCourseProgress(progress);
          }
        );
      }
      
      // Cleanup function
      return () => {
        if (unsubscribeProgress) {
          console.log('🧹 Cleaning up progress subscription');
          unsubscribeProgress();
        }
      };
    } else {
      // Restore body scroll when modal is closed
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, course, currentUser]);

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

    if (currentUser.role === 'free') {
      const dailyLimit = 1;
      const used = currentUser.aiChatsUsed || 0;
      const today = new Date().toISOString().split('T')[0];
      const lastReset = currentUser.lastChatReset || '';
      
      if (lastReset !== today) {
        return { available: true, reason: `${dailyLimit} practice session available today` };
      }
      
      if (used >= dailyLimit) {
        return { available: false, reason: 'Daily limit reached. Upgrade for more!' };
      }
      
      return { available: true, reason: `${dailyLimit - used} practice session remaining today` };
    }

    if (currentUser.role === 'premium') {
      const dailyLimit = 3;
      const used = currentUser.aiChatsUsed || 0;
      const today = new Date().toISOString().split('T')[0];
      const lastReset = currentUser.lastChatReset || '';
      
      if (lastReset !== today) {
        return { available: true, reason: `${dailyLimit} practice sessions available today` };
      }
      
      if (used >= dailyLimit) {
        return { available: false, reason: 'Daily limit reached. More sessions tomorrow!' };
      }
      
      return { available: true, reason: `${dailyLimit - used} practice sessions remaining today` };
    }

    return { available: false, reason: 'Unknown user type' };
  };

  // Show confirmation modal for AI practice
  const handleAIPractice = () => {
    const status = getAIPracticeStatus();
    if (status.available && course?.id) {
      console.log('🎯 Showing confirmation modal for course:', course.title);
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
      const newSessionId = await startTavusSession(currentUser.uid, course.id, 180); // 3 minutes
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
        } else if (error.message.includes('conversational context')) {
          errorMessage = 'This course is not set up for AI practice yet.';
          shouldShowRetry = false;
        } else {
          errorMessage = 'AI practice configuration issue. Please contact support.';
          shouldShowRetry = false;
        }
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
    setTavusCompleted(true);
    setTavusAccuracy(completion.accuracyScore);
    setShowTavusModal(false);
  };

  const handleRetakePractice = () => {
    console.log('🔄 Retaking Tavus practice for course:', course?.title);
    setShowConfirmationModal(true);
  };

  const handleMoreCourses = () => {
    onClose();
    window.location.href = '/courses';
  };

  if (!isOpen || !course) return null;

  const aiPracticeStatus = getAIPracticeStatus();

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="course-modal-title"
        aria-describedby="course-modal-description"
      >
        <div 
          ref={modalRef}
          className="bg-white rounded-[16px] w-full max-w-4xl max-h-[90vh] overflow-y-auto md:max-h-[85vh] shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
        >
          {/* Header */}
          <div className="flex items-start justify-between p-padding-medium border-b border-gray-100">
            <div className="flex-1 pr-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-[#FF7A59] bg-[#FF7A59]/10 px-3 py-1 rounded-headspace-md font-semibold">
                  {course.category}
                </span>
                <span className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-headspace-md font-medium">
                  {course.difficulty}
                </span>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
                {!course.published && (
                  <span className="text-sm text-purple-800 bg-purple-100 px-3 py-1 rounded-headspace-md font-semibold">
                    Draft
                  </span>
                )}
                {(course.tavusConversationUrl || course.conversationalContext || course.id) && (
                  <span className="text-sm text-[#FF7A59] bg-[#FF7A59]/10 px-3 py-1 rounded-headspace-md font-semibold flex items-center space-x-1">
                    <MessageCircle className="h-3 w-3" />
                    <span>AI Practice</span>
                  </span>
                )}
                {tavusCompleted && (
                  <span className="text-sm text-emerald-700 bg-emerald-100 px-3 py-1 rounded-headspace-md font-semibold flex items-center space-x-1">
                    <CheckCircle className="h-3 w-3" />
                    <span>Completed</span>
                  </span>
                )}
              </div>
              <h1 id="course-modal-title" className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                {course.title}
              </h1>
              
              {/* Progress Bar - Only show for authenticated users */}
              {currentUser && (
                <div className="bg-gray-50 rounded-headspace-xl p-padding-small mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Progress</h3>
                  <ProgressBar 
                    progress={courseProgress} 
                    size="md"
                    showLabel={true}
                  />
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="icon-button icon-button-gray p-2 rounded-headspace-md flex-shrink-0"
              aria-label="Close course details"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-padding-medium">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Video and Description */}
              <div className="lg:col-span-2 space-y-6">
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

              {/* Right Column - Thumbnail and Actions */}
              <div className="space-y-6">
                {/* Course Thumbnail */}
                <ThumbnailSection
                  thumbnailUrl={course.thumbnailUrl}
                  courseTitle={course.title}
                  imageError={imageError}
                  onImageError={setImageError}
                  isModuleCompleted={courseProgress >= 100}
                />

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
    </>
  );
};

export default CourseDetailModal;