import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Clock, Star, MessageCircle, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { Course } from '../types';
import { useAuth } from '../contexts/AuthContext';

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

  // Reset states when modal opens/closes or course changes
  useEffect(() => {
    if (isOpen && course) {
      setVideoError(false);
      setImageError(false);
      setIsVideoLoading(true);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll when modal is closed
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, course]);

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

  // Handle video retry
  const handleVideoRetry = () => {
    setVideoError(false);
    setIsVideoLoading(true);
  };

  // Handle image retry
  const handleImageRetry = () => {
    setImageError(false);
  };

  // Get AI practice availability based on user type
  const getAIPracticeStatus = () => {
    if (!currentUser) {
      return { available: false, reason: 'Sign in required' };
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

  const handleAIPractice = () => {
    const status = getAIPracticeStatus();
    if (status.available) {
      // TODO: Implement AI practice functionality
      console.log('Starting AI practice for course:', course?.title);
    } else {
      console.log('AI practice not available:', status.reason);
    }
  };

  const handleMoreCourses = () => {
    onClose();
    window.location.href = '/courses';
  };

  if (!isOpen || !course) return null;

  const aiPracticeStatus = getAIPracticeStatus();

  return (
    <div 
      className="fixed inset-0 bg-primary/80 backdrop-blur-ios flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-modal-title"
      aria-describedby="course-modal-description"
    >
      <div 
        ref={modalRef}
        className="bg-primary border border-neutral-gray/30 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto md:max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-neutral-gray/20">
          <div className="flex-1 pr-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-x-small text-accent-yellow bg-accent-yellow/20 px-2 py-1 rounded font-medium">
                {course.category}
              </span>
              <span className="text-x-small text-neutral-gray bg-neutral-gray/20 px-2 py-1 rounded">
                {course.difficulty}
              </span>
              <div className="flex items-center space-x-1 text-x-small text-text-secondary">
                <Clock className="h-3 w-3" />
                <span>{course.duration}</span>
              </div>
              {!course.published && (
                <span className="text-x-small text-accent-purple bg-accent-purple/20 px-2 py-1 rounded">
                  Draft
                </span>
              )}
            </div>
            <h1 id="course-modal-title" className="text-h2 text-text-light mb-2 leading-tight">
              {course.title}
            </h1>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-gray hover:text-text-light transition-colors p-2 rounded-lg hover:bg-neutral-gray/20 flex-shrink-0"
            aria-label="Close course details"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Video and Description */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video Player */}
              <div className="relative">
                <div className="w-full aspect-video bg-neutral-gray/20 rounded-lg overflow-hidden border border-neutral-gray/30">
                  {videoError ? (
                    <div className="w-full h-full flex items-center justify-center text-center p-6">
                      <div>
                        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                        <h3 className="text-body font-medium text-text-light mb-2">Video failed to load</h3>
                        <p className="text-small text-text-secondary mb-4">
                          There was a problem loading the video. Please check your connection and try again.
                        </p>
                        <button
                          onClick={handleVideoRetry}
                          className="bg-accent-yellow text-text-dark px-4 py-2 rounded-lg text-small font-medium hover:bg-accent-green transition-all flex items-center space-x-2 mx-auto"
                        >
                          <RefreshCw className="h-4 w-4" />
                          <span>Retry</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {isVideoLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-neutral-gray/20">
                          <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-yellow mb-4"></div>
                            <p className="text-small text-text-secondary">Loading video...</p>
                          </div>
                        </div>
                      )}
                      <iframe
                        src={course.videoUrl}
                        title={`${course.title} - Course Video`}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onLoad={() => setIsVideoLoading(false)}
                        onError={() => {
                          setVideoError(true);
                          setIsVideoLoading(false);
                        }}
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Course Description */}
              <div>
                <h2 className="text-h3 text-text-light mb-3">About This Course</h2>
                <p id="course-modal-description" className="text-body text-text-secondary leading-relaxed">
                  {course.description}
                </p>
              </div>

              {/* Course Details */}
              <div className="bg-neutral-gray/10 rounded-lg p-4">
                <h3 className="text-body font-medium text-text-light mb-3">Course Details</h3>
                <div className="grid grid-cols-2 gap-4 text-small">
                  <div>
                    <span className="text-neutral-gray">Duration:</span>
                    <span className="text-text-light ml-2 font-medium">{course.duration}</span>
                  </div>
                  <div>
                    <span className="text-neutral-gray">Level:</span>
                    <span className="text-text-light ml-2 font-medium">{course.difficulty}</span>
                  </div>
                  <div>
                    <span className="text-neutral-gray">Category:</span>
                    <span className="text-text-light ml-2 font-medium">{course.category}</span>
                  </div>
                  <div>
                    <span className="text-neutral-gray">Format:</span>
                    <span className="text-text-light ml-2 font-medium">Video Lesson</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Thumbnail and Actions */}
            <div className="space-y-6">
              {/* Course Thumbnail */}
              <div>
                <h3 className="text-body font-medium text-text-light mb-3">Course Preview</h3>
                <div className="w-full aspect-video bg-neutral-gray/20 rounded-lg overflow-hidden border border-neutral-gray/30">
                  {imageError ? (
                    <div className="w-full h-full flex items-center justify-center text-center p-4">
                      <div>
                        <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
                        <p className="text-small text-text-secondary mb-2">Image failed to load</p>
                        <button
                          onClick={handleImageRetry}
                          className="text-accent-yellow hover:text-accent-green transition-colors text-small underline"
                        >
                          Retry
                        </button>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={course.thumbnailUrl}
                      alt={`${course.title} thumbnail`}
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                {/* AI Practice Button */}
                <div>
                  <button
                    onClick={handleAIPractice}
                    disabled={!aiPracticeStatus.available}
                    className={`w-full px-6 py-4 rounded-lg text-body font-medium transition-all shadow-button flex items-center justify-center space-x-3 ${
                      aiPracticeStatus.available
                        ? 'bg-accent-purple text-text-dark hover:bg-accent-deep-purple'
                        : 'bg-neutral-gray/30 text-neutral-gray cursor-not-allowed opacity-60'
                    }`}
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>Practice with AI</span>
                  </button>
                  <p className="text-x-small text-text-secondary mt-2 text-center">
                    {aiPracticeStatus.reason}
                  </p>
                </div>

                {/* More Courses Button */}
                <button
                  onClick={handleMoreCourses}
                  className="w-full bg-accent-yellow text-text-dark px-6 py-3 rounded-lg text-body font-medium hover:bg-accent-green transition-all shadow-button flex items-center justify-center space-x-2"
                >
                  <span>More Courses</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                {/* Upgrade Prompt for Free Users */}
                {currentUser?.role === 'free' && (
                  <div className="bg-accent-purple/10 border border-accent-purple/30 rounded-lg p-4 text-center">
                    <Star className="h-6 w-6 text-accent-purple mx-auto mb-2" />
                    <h4 className="text-small font-medium text-text-light mb-1">Want More Practice?</h4>
                    <p className="text-x-small text-text-secondary mb-3">
                      Upgrade to BrevEdu+ for 3 daily AI practice sessions and premium content.
                    </p>
                    <a
                      href="/brevedu-plus"
                      className="inline-block bg-accent-purple text-text-dark px-4 py-2 rounded-lg text-small font-medium hover:bg-accent-deep-purple transition-all"
                      onClick={onClose}
                    >
                      Upgrade Now
                    </a>
                  </div>
                )}

                {/* Sign In Prompt for Anonymous Users */}
                {!currentUser && (
                  <div className="bg-accent-yellow/10 border border-accent-yellow/30 rounded-lg p-4 text-center">
                    <MessageCircle className="h-6 w-6 text-accent-yellow mx-auto mb-2" />
                    <h4 className="text-small font-medium text-text-light mb-1">Ready to Practice?</h4>
                    <p className="text-x-small text-text-secondary mb-3">
                      Sign in to start practicing with AI and track your progress.
                    </p>
                    <button
                      className="inline-block bg-accent-yellow text-text-dark px-4 py-2 rounded-lg text-small font-medium hover:bg-accent-green transition-all"
                      onClick={() => {
                        onClose();
                        // TODO: Open auth modal
                        console.log('Open auth modal');
                      }}
                    >
                      Sign In
                    </button>
                  </div>
                )}
              </div>

              {/* Course Stats (if available) */}
              <div className="bg-neutral-gray/10 rounded-lg p-4">
                <h4 className="text-small font-medium text-text-light mb-3">Quick Facts</h4>
                <div className="space-y-2 text-x-small">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-gray">Bite-sized learning</span>
                    <span className="text-accent-green">✓</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-gray">Mobile friendly</span>
                    <span className="text-accent-green">✓</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-gray">AI practice available</span>
                    <span className="text-accent-green">✓</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-gray">Learn at your pace</span>
                    <span className="text-accent-green">✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailModal;