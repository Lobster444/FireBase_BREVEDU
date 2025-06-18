import React, { useState, useEffect, useRef } from 'react';
import { X, Clock, Star, MessageCircle, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import Plyr from 'plyr-react';
import 'plyr-react/dist/plyr.css'; // Import Plyr CSS directly in component
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

  // Get YouTube video ID from URL - Enhanced with debugging
  const getYouTubeVideoId = (url: string): string | null => {
    console.log('🎥 Extracting video ID from URL:', url);
    
    // Handle youtube-nocookie.com embed URLs
    const embedMatch = url.match(/\/embed\/([^?&]+)/);
    if (embedMatch) {
      const videoId = embedMatch[1];
      console.log('✅ Extracted video ID:', videoId);
      return videoId;
    }
    
    // Handle regular YouTube URLs as fallback
    const regularMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (regularMatch) {
      const videoId = regularMatch[1];
      console.log('✅ Extracted video ID from regular URL:', videoId);
      return videoId;
    }
    
    console.warn('❌ Could not extract video ID from URL:', url);
    return null;
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
  const videoId = getYouTubeVideoId(course.videoUrl);

  // Enhanced Plyr options for YouTube embeds
  const plyrOptions = {
    ratio: '16:9',
    autoplay: false,
    muted: false,
    hideControls: false,
    resetOnEnd: false,
    keyboard: { focused: true, global: false },
    tooltips: { controls: true, seek: true },
    captions: { active: false, language: 'auto', update: false },
    fullscreen: { enabled: true, fallback: true, iosNative: false },
    storage: { enabled: true, key: 'plyr' },
    speed: { 
      selected: 1, 
      options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] 
    },
    quality: { 
      default: 720, 
      options: [4320, 2160, 1440, 1080, 720, 576, 480, 360, 240] 
    },
    controls: [
      'play-large',
      'play',
      'progress',
      'current-time',
      'duration',
      'mute',
      'volume',
      'settings',
      'fullscreen'
    ],
    settings: ['quality', 'speed'],
    youtube: {
      noCookie: true,
      rel: 0,
      showinfo: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      playsinline: 1,
      enablejsapi: 1,
      origin: window.location.origin
    },
    vimeo: {
      byline: false,
      portrait: false,
      title: false,
      speed: true,
      transparent: false
    }
  };

  // Create proper Plyr source for YouTube - Enhanced with debugging
  const createPlyrSource = () => {
    if (!videoId) {
      console.warn('❌ No video ID available for Plyr source');
      return null;
    }
    
    const source = {
      type: 'video' as const,
      sources: [
        {
          src: videoId,
          provider: 'youtube' as const,
        }
      ],
      poster: course.thumbnailUrl
    };
    
    console.log('🎬 Created Plyr source:', source);
    return source;
  };

  const plyrSource = createPlyrSource();

  return (
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
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div className="flex-1 pr-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm text-[#FF7A59] bg-[#FF7A59]/10 px-3 py-1 rounded-[8px] font-semibold">
                {course.category}
              </span>
              <span className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-[8px] font-medium">
                {course.difficulty}
              </span>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{course.duration}</span>
              </div>
              {!course.published && (
                <span className="text-sm text-purple-800 bg-purple-100 px-3 py-1 rounded-[8px] font-semibold">
                  Draft
                </span>
              )}
            </div>
            <h1 id="course-modal-title" className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
              {course.title}
            </h1>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-[8px] hover:bg-gray-50 flex-shrink-0"
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
                <div className="w-full aspect-video bg-gray-100 rounded-[12px] overflow-hidden border border-gray-200 max-w-[640px] mx-auto lg:mx-0">
                  {videoError ? (
                    <div className="w-full h-full flex items-center justify-center text-center p-6">
                      <div>
                        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Video failed to load</h3>
                        <p className="text-base text-gray-600 mb-4">
                          There was a problem loading the video. Please check your connection and try again.
                        </p>
                        <button
                          onClick={handleVideoRetry}
                          className="bg-[#FF7A59] text-white px-4 py-2 rounded-[8px] text-base font-medium hover:bg-[#FF8A6B] transition-all flex items-center space-x-2 mx-auto"
                        >
                          <RefreshCw className="h-4 w-4" />
                          <span>Retry</span>
                        </button>
                      </div>
                    </div>
                  ) : videoId && plyrSource ? (
                    <div className="plyr__video-embed w-full h-full">
                      <Plyr
                        source={plyrSource}
                        options={plyrOptions}
                        onReady={() => {
                          console.log('🎉 Plyr ready with video ID:', videoId);
                          console.log('📺 Video URL:', course.videoUrl);
                          setIsVideoLoading(false);
                        }}
                        onError={(error) => {
                          console.error('❌ Plyr error:', error);
                          console.log('🔍 Debug info:', {
                            videoId,
                            videoUrl: course.videoUrl,
                            plyrSource
                          });
                          setVideoError(true);
                          setIsVideoLoading(false);
                        }}
                        onLoadStart={() => {
                          console.log('⏳ Video load started');
                          setIsVideoLoading(true);
                        }}
                        onCanPlay={() => {
                          console.log('✅ Video can play');
                          setIsVideoLoading(false);
                        }}
                        onPlay={() => {
                          console.log('▶️ Video started playing');
                        }}
                        onPause={() => {
                          console.log('⏸️ Video paused');
                        }}
                        aria-label="Course video preview"
                      />
                      {isVideoLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-[12px]">
                          <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF7A59] mb-4"></div>
                            <p className="text-base text-gray-600">Loading video...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-center p-6">
                      <div>
                        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Invalid video URL</h3>
                        <p className="text-base text-gray-600">
                          The video URL is not valid or supported. Video ID: {videoId || 'Not found'}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          URL: {course.videoUrl}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Course Description */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">About This Course</h2>
                <p id="course-modal-description" className="text-base text-gray-700 leading-relaxed">
                  {course.description}
                </p>
              </div>

              {/* Course Details */}
              <div className="bg-gray-50 rounded-[12px] p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Course Details</h3>
                <div className="grid grid-cols-2 gap-4 text-base">
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <span className="text-gray-900 ml-2 font-medium">{course.duration}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Level:</span>
                    <span className="text-gray-900 ml-2 font-medium">{course.difficulty}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Category:</span>
                    <span className="text-gray-900 ml-2 font-medium">{course.category}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Format:</span>
                    <span className="text-gray-900 ml-2 font-medium">Video Lesson</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Thumbnail and Actions */}
            <div className="space-y-6">
              {/* Course Thumbnail */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Course Preview</h3>
                <div className="w-full aspect-video bg-gray-100 rounded-[12px] overflow-hidden border border-gray-200">
                  {imageError ? (
                    <div className="w-full h-full flex items-center justify-center text-center p-4">
                      <div>
                        <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
                        <p className="text-base text-gray-600 mb-2">Image failed to load</p>
                        <button
                          onClick={handleImageRetry}
                          className="text-[#FF7A59] hover:text-[#FF8A6B] transition-colors text-base underline"
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
                    className={`w-full px-6 py-4 rounded-[10px] text-lg font-medium transition-all shadow-[0_2px_8px_rgba(0,0,0,0.1)] flex items-center justify-center space-x-3 ${
                      aiPracticeStatus.available
                        ? 'bg-[#FF7A59] text-white hover:bg-[#FF8A6B]'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>Practice with AI</span>
                  </button>
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    {aiPracticeStatus.reason}
                  </p>
                </div>

                {/* More Courses Button */}
                <button
                  onClick={handleMoreCourses}
                  className="w-full bg-[#F5C842] text-gray-900 px-6 py-3 rounded-[10px] text-lg font-medium hover:bg-[#F2C94C] transition-all shadow-[0_2px_8px_rgba(0,0,0,0.1)] flex items-center justify-center space-x-2"
                >
                  <span>More Courses</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                {/* Upgrade Prompt for Free Users */}
                {currentUser?.role === 'free' && (
                  <div className="bg-[#FF7A59]/10 border border-[#FF7A59]/30 rounded-[12px] p-4 text-center">
                    <Star className="h-6 w-6 text-[#FF7A59] mx-auto mb-2" />
                    <h4 className="text-base font-semibold text-gray-900 mb-1">Want More Practice?</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Upgrade to BrevEdu+ for 3 daily AI practice sessions and premium content.
                    </p>
                    <a
                      href="/brevedu-plus"
                      className="inline-block bg-[#FF7A59] text-white px-4 py-2 rounded-[8px] text-base font-medium hover:bg-[#FF8A6B] transition-all"
                      onClick={onClose}
                    >
                      Upgrade Now
                    </a>
                  </div>
                )}

                {/* Sign In Prompt for Anonymous Users */}
                {!currentUser && (
                  <div className="bg-[#F5C842]/10 border border-[#F5C842]/30 rounded-[12px] p-4 text-center">
                    <MessageCircle className="h-6 w-6 text-[#F5C842] mx-auto mb-2" />
                    <h4 className="text-base font-semibold text-gray-900 mb-1">Ready to Practice?</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Sign in to start practicing with AI and track your progress.
                    </p>
                    <button
                      className="inline-block bg-[#F5C842] text-gray-900 px-4 py-2 rounded-[8px] text-base font-medium hover:bg-[#F2C94C] transition-all"
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
              <div className="bg-gray-50 rounded-[12px] p-4">
                <h4 className="text-base font-semibold text-gray-900 mb-3">Quick Facts</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Bite-sized learning</span>
                    <span className="text-emerald-600">✓</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Mobile friendly</span>
                    <span className="text-emerald-600">✓</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">AI practice available</span>
                    <span className="text-emerald-600">✓</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Learn at your pace</span>
                    <span className="text-emerald-600">✓</span>
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