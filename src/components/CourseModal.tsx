import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Eye, AlertCircle, Loader2, Shield } from 'lucide-react';
import Plyr from 'plyr-react';
import { Course, AccessLevel } from '../types';
import { addCourse, updateCourse } from '../lib/courseService';
import { notifyLoading, updateToast } from '../lib/toast';
import { useNetworkStatusWithUtils } from '../hooks/useNetworkStatus';

interface CourseModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  course?: Course;
  onClose: () => void;
  onSave?: (course: Course) => void;
}

interface FormData {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  category: Course['category'];
  difficulty: Course['difficulty'];
  accessLevel: AccessLevel;
  published: boolean;
}

interface FormErrors {
  title?: string;
  description?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: string;
  accessLevel?: string;
}

const CourseModal: React.FC<CourseModalProps> = ({
  isOpen,
  mode,
  course,
  onClose,
  onSave
}) => {
  const { executeIfOnline } = useNetworkStatusWithUtils();
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [previewError, setPreviewError] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    duration: '',
    category: 'Tech',
    difficulty: 'Beginner',
    accessLevel: 'free',
    published: false
  });

  // Initialize form data when modal opens or course changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && course) {
        setFormData({
          title: course.title,
          description: course.description,
          videoUrl: course.videoUrl,
          thumbnailUrl: course.thumbnailUrl,
          duration: course.duration,
          category: course.category,
          difficulty: course.difficulty,
          accessLevel: course.accessLevel || 'free',
          published: course.published
        });
      } else {
        // Reset form for add mode
        setFormData({
          title: '',
          description: '',
          videoUrl: '',
          thumbnailUrl: '',
          duration: '',
          category: 'Tech',
          difficulty: 'Beginner',
          accessLevel: 'free',
          published: false
        });
      }
      setErrors({});
      setPreviewError('');
    }
  }, [isOpen, mode, course]);

  // Focus management
  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      // Small delay to ensure modal is rendered
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

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

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be 100 characters or less';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description must be 500 characters or less';
    }

    // Video URL validation
    if (!formData.videoUrl.trim()) {
      newErrors.videoUrl = 'Video URL is required';
    } else if (!formData.videoUrl.includes('youtube-nocookie.com')) {
      newErrors.videoUrl = 'Must be a valid YouTube nocookie embed URL';
    } else if (!formData.videoUrl.includes('/embed/')) {
      newErrors.videoUrl = 'Must be a YouTube embed URL (contains /embed/)';
    }

    // Thumbnail URL validation
    if (!formData.thumbnailUrl.trim()) {
      newErrors.thumbnailUrl = 'Thumbnail URL is required';
    } else {
      try {
        new URL(formData.thumbnailUrl);
      } catch {
        newErrors.thumbnailUrl = 'Must be a valid URL';
      }
    }

    // Duration validation
    if (!formData.duration.trim()) {
      newErrors.duration = 'Duration is required';
    } else if (!/^\d+m$/.test(formData.duration)) {
      newErrors.duration = 'Duration must be in format "5m", "12m", etc.';
    }

    // Access level validation
    const validAccessLevels = ['anonymous', 'free', 'premium'];
    if (!validAccessLevels.includes(formData.accessLevel)) {
      newErrors.accessLevel = 'Please select a valid access level';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    executeIfOnline(async () => {
      setIsSubmitting(true);
      const toastId = notifyLoading(
        mode === 'add' ? 'Creating course...' : 'Updating course...'
      );

      try {
        const courseData = {
          title: formData.title.trim(),
          description: formData.description.trim(),
          videoUrl: formData.videoUrl.trim(),
          thumbnailUrl: formData.thumbnailUrl.trim(),
          duration: formData.duration.trim(),
          category: formData.category,
          difficulty: formData.difficulty,
          accessLevel: formData.accessLevel,
          published: formData.published
        };

        if (mode === 'add') {
          const newCourseId = await addCourse(courseData);
          updateToast(toastId, '✅ Course created successfully!', 'success');
          onSave?.({ ...courseData, id: newCourseId } as Course);
        } else if (mode === 'edit' && course?.id) {
          await updateCourse(course.id, courseData);
          updateToast(toastId, '✅ Course updated successfully!', 'success');
          onSave?.({ ...courseData, id: course.id } as Course);
        }

        onClose();
      } catch (error: any) {
        console.error('Error saving course:', error);
        const errorMessage = error.message || `Failed to ${mode} course. Please try again.`;
        updateToast(toastId, `❌ ${errorMessage}`, 'error');
      } finally {
        setIsSubmitting(false);
      }
    }, `Cannot ${mode} course while offline. Please check your connection.`);
  };

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Get YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    const match = url.match(/\/embed\/([^?&]+)/);
    return match ? match[1] : null;
  };

  // Get access level display info
  const getAccessLevelInfo = (level: AccessLevel) => {
    switch (level) {
      case 'anonymous':
        return {
          label: 'Anonymous',
          description: 'Available to all visitors (no account required)',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100'
        };
      case 'free':
        return {
          label: 'Free',
          description: 'Available to users with free accounts',
          color: 'text-[#F5C842]',
          bgColor: 'bg-[#F5C842]/10'
        };
      case 'premium':
        return {
          label: 'Premium',
          description: 'Available only to BrevEdu+ subscribers',
          color: 'text-[#FF7A59]',
          bgColor: 'bg-[#FF7A59]/10'
        };
      default:
        return {
          label: 'Free',
          description: 'Available to users with free accounts',
          color: 'text-[#F5C842]',
          bgColor: 'bg-[#F5C842]/10'
        };
    }
  };

  if (!isOpen) return null;

  const accessLevelInfo = getAccessLevelInfo(formData.accessLevel);
  const videoId = getYouTubeVideoId(formData.videoUrl);

  // Plyr video source configuration for preview
  const plyrSource = {
    type: 'video' as const,
    sources: [
      {
        src: videoId || '',
        provider: 'youtube' as const,
      },
    ],
    poster: formData.thumbnailUrl || undefined, // Use thumbnail as poster
  };

  // Enhanced Plyr options for preview
  const plyrOptions = {
    ratio: '16:9',
    autoplay: false, // Disabled for accessibility
    muted: true, // No audio on mount
    quality: { 
      default: 576, 
      options: [1080, 720, 576, 480, 360, 240] 
    },
    controls: [
      'play-large', 
      'play', 
      'progress', 
      'current-time', 
      'mute', 
      'volume', 
      'fullscreen'
    ],
    keyboard: { focused: true, global: false }, // Enable keyboard navigation
    tooltips: { controls: true, seek: true },
    youtube: {
      noCookie: true,
      rel: 0,
      showinfo: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      playsinline: 1,
    },
    // Responsive sizing
    responsive: true,
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-[16px] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 id="modal-title" className="text-2xl font-bold text-gray-900">
              {mode === 'add' ? 'Add New Course' : 'Edit Course'}
            </h2>
            <p id="modal-description" className="text-lg text-gray-600 mt-1">
              {mode === 'add' 
                ? 'Create a new course with video content and access controls'
                : 'Update course information, settings, and access level'
              }
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-[8px] hover:bg-gray-50"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form Fields */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-base font-semibold text-gray-900 mb-2">
                  Course Title *
                </label>
                <input
                  ref={firstInputRef}
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-4 py-3 bg-white border rounded-[10px] text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                    errors.title 
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' 
                      : 'border-gray-300 focus:border-[#FF7A59] focus:ring-[#FF7A59]/20'
                  }`}
                  placeholder="Enter course title"
                  maxLength={100}
                  required
                  aria-describedby={errors.title ? 'title-error' : undefined}
                />
                {errors.title && (
                  <p id="title-error" className="mt-1 text-base text-red-600 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.title}</span>
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-base font-semibold text-gray-900 mb-2">
                  Description * ({formData.description.length}/500)
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 bg-white border rounded-[10px] text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors resize-vertical ${
                    errors.description 
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' 
                      : 'border-gray-300 focus:border-[#FF7A59] focus:ring-[#FF7A59]/20'
                  }`}
                  placeholder="Describe what students will learn in this course"
                  maxLength={500}
                  required
                  aria-describedby={errors.description ? 'description-error' : undefined}
                />
                {errors.description && (
                  <p id="description-error" className="mt-1 text-base text-red-600 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.description}</span>
                  </p>
                )}
              </div>

              {/* Video URL */}
              <div>
                <label htmlFor="videoUrl" className="block text-base font-semibold text-gray-900 mb-2">
                  YouTube Video URL *
                </label>
                <input
                  type="url"
                  id="videoUrl"
                  value={formData.videoUrl}
                  onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                  className={`w-full px-4 py-3 bg-white border rounded-[10px] text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                    errors.videoUrl 
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' 
                      : 'border-gray-300 focus:border-[#FF7A59] focus:ring-[#FF7A59]/20'
                  }`}
                  placeholder="https://www.youtube-nocookie.com/embed/VIDEO_ID"
                  pattern=".*youtube-nocookie\.com.*"
                  required
                  aria-describedby={errors.videoUrl ? 'videoUrl-error' : 'videoUrl-help'}
                />
                {errors.videoUrl ? (
                  <p id="videoUrl-error" className="mt-1 text-base text-red-600 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.videoUrl}</span>
                  </p>
                ) : (
                  <p id="videoUrl-help" className="mt-1 text-sm text-gray-600">
                    Use YouTube nocookie embed URLs for privacy compliance
                  </p>
                )}
              </div>

              {/* Thumbnail URL */}
              <div>
                <label htmlFor="thumbnailUrl" className="block text-base font-semibold text-gray-900 mb-2">
                  Thumbnail Image URL *
                </label>
                <input
                  type="url"
                  id="thumbnailUrl"
                  value={formData.thumbnailUrl}
                  onChange={(e) => handleInputChange('thumbnailUrl', e.target.value)}
                  className={`w-full px-4 py-3 bg-white border rounded-[10px] text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                    errors.thumbnailUrl 
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' 
                      : 'border-gray-300 focus:border-[#FF7A59] focus:ring-[#FF7A59]/20'
                  }`}
                  placeholder="https://images.pexels.com/..."
                  required
                  aria-describedby={errors.thumbnailUrl ? 'thumbnailUrl-error' : undefined}
                />
                {errors.thumbnailUrl && (
                  <p id="thumbnailUrl-error" className="mt-1 text-base text-red-600 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.thumbnailUrl}</span>
                  </p>
                )}
              </div>

              {/* Duration */}
              <div>
                <label htmlFor="duration" className="block text-base font-semibold text-gray-900 mb-2">
                  Duration *
                </label>
                <input
                  type="text"
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className={`w-full px-4 py-3 bg-white border rounded-[10px] text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                    errors.duration 
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' 
                      : 'border-gray-300 focus:border-[#FF7A59] focus:ring-[#FF7A59]/20'
                  }`}
                  placeholder="5m"
                  pattern="\d+m"
                  required
                  aria-describedby={errors.duration ? 'duration-error' : 'duration-help'}
                />
                {errors.duration ? (
                  <p id="duration-error" className="mt-1 text-base text-red-600 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.duration}</span>
                  </p>
                ) : (
                  <p id="duration-help" className="mt-1 text-sm text-gray-600">
                    Format: 5m, 12m, etc.
                  </p>
                )}
              </div>

              {/* Category, Difficulty, and Access Level */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="category" className="block text-base font-semibold text-gray-900 mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value as Course['category'])}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-[10px] text-gray-900 focus:outline-none focus:border-[#FF7A59] focus:ring-2 focus:ring-[#FF7A59]/20"
                  >
                    <option value="Tech">Tech</option>
                    <option value="Business">Business</option>
                    <option value="Health">Health</option>
                    <option value="Personal">Personal</option>
                    <option value="Creative">Creative</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="difficulty" className="block text-base font-semibold text-gray-900 mb-2">
                    Difficulty
                  </label>
                  <select
                    id="difficulty"
                    value={formData.difficulty}
                    onChange={(e) => handleInputChange('difficulty', e.target.value as Course['difficulty'])}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-[10px] text-gray-900 focus:outline-none focus:border-[#FF7A59] focus:ring-2 focus:ring-[#FF7A59]/20"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="accessLevel" className="block text-base font-semibold text-gray-900 mb-2">
                    Access Level *
                  </label>
                  <select
                    id="accessLevel"
                    value={formData.accessLevel}
                    onChange={(e) => handleInputChange('accessLevel', e.target.value as AccessLevel)}
                    className={`w-full px-4 py-3 bg-white border rounded-[10px] text-gray-900 focus:outline-none focus:ring-2 transition-colors ${
                      errors.accessLevel 
                        ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' 
                        : 'border-gray-300 focus:border-[#FF7A59] focus:ring-[#FF7A59]/20'
                    }`}
                    required
                    aria-describedby={errors.accessLevel ? 'accessLevel-error' : 'accessLevel-help'}
                  >
                    <option value="anonymous">Anonymous (No account required)</option>
                    <option value="free">Free (Account required)</option>
                    <option value="premium">Premium (BrevEdu+ subscription)</option>
                  </select>
                  {errors.accessLevel ? (
                    <p id="accessLevel-error" className="mt-1 text-base text-red-600 flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.accessLevel}</span>
                    </p>
                  ) : (
                    <p id="accessLevel-help" className="mt-1 text-sm text-gray-600">
                      {accessLevelInfo.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Published Checkbox */}
              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => handleInputChange('published', e.target.checked)}
                    className="w-5 h-5 text-[#FF7A59] bg-white border-gray-300 rounded focus:ring-[#FF7A59]/20 focus:ring-2"
                  />
                  <div>
                    <span className="text-lg font-semibold text-gray-900">Publish Course</span>
                    <p className="text-base text-gray-600">
                      Published courses are visible to users based on their access level
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Right Column - Live Preview */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Live Preview</span>
                </h3>

                {/* Thumbnail Preview */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Thumbnail</h4>
                  <div className="w-full h-48 bg-gray-100 rounded-[12px] overflow-hidden border border-gray-200">
                    {formData.thumbnailUrl ? (
                      <img
                        src={formData.thumbnailUrl}
                        alt="Course thumbnail preview"
                        className="w-full h-full object-cover"
                        onError={() => setPreviewError('Failed to load thumbnail image')}
                        onLoad={() => setPreviewError('')}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <div className="text-center">
                          <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-base">Thumbnail preview</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {previewError && (
                    <p className="mt-2 text-base text-red-600 flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{previewError}</span>
                    </p>
                  )}
                </div>

                {/* Video Preview */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Video</h4>
                  <div className="w-full aspect-video bg-gray-100 rounded-[12px] overflow-hidden border border-gray-200 max-w-[640px]">
                    {formData.videoUrl && formData.videoUrl.includes('youtube-nocookie.com') && videoId ? (
                      <div className="relative w-full h-auto">
                        <Plyr
                          source={plyrSource}
                          options={plyrOptions}
                          aria-label="Course video preview"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <div className="text-center">
                          <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-base">Video preview</p>
                          <p className="text-sm mt-1">Enter a valid YouTube nocookie URL</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Course Info Preview */}
                <div className="bg-gray-50 rounded-[12px] p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Course Card Preview</h4>
                  <div className="space-y-2">
                    <h5 className="text-lg font-bold text-gray-900 line-clamp-2">
                      {formData.title || 'Course Title'}
                    </h5>
                    <p className="text-base text-gray-700 line-clamp-3">
                      {formData.description || 'Course description will appear here...'}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-700 bg-gray-200 px-2 py-1 rounded-[6px]">
                          {formData.category}
                        </span>
                        <span className="text-sm text-gray-900">
                          {formData.difficulty}
                        </span>
                      </div>
                      <span className="text-sm text-gray-900">
                        {formData.duration || '0m'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center space-x-2">
                        {!formData.published && (
                          <span className="text-sm text-purple-800 bg-purple-100 px-2 py-1 rounded-[6px]">
                            Draft
                          </span>
                        )}
                        <span className={`text-sm px-2 py-1 rounded-[6px] flex items-center space-x-1 ${accessLevelInfo.color} ${accessLevelInfo.bgColor}`}>
                          <Shield className="h-3 w-3" />
                          <span>{accessLevelInfo.label}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Access Level Info */}
                <div className={`rounded-[12px] p-4 border ${accessLevelInfo.bgColor} border-opacity-30`}>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Access Level: {accessLevelInfo.label}</span>
                  </h4>
                  <p className="text-base text-gray-700">
                    {accessLevelInfo.description}
                  </p>
                  {formData.accessLevel === 'premium' && (
                    <p className="text-sm text-[#FF7A59] mt-2">
                      💎 This course will only be visible to BrevEdu+ subscribers
                    </p>
                  )}
                  {formData.accessLevel === 'anonymous' && (
                    <p className="text-sm text-gray-600 mt-2">
                      🌐 This course will be visible to all visitors, even without an account
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-4 pt-6 mt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-[10px] text-lg font-medium hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#FF7A59] text-white px-6 py-3 rounded-[10px] text-lg font-medium hover:bg-[#FF8A6B] transition-all shadow-[0_2px_8px_rgba(0,0,0,0.1)] disabled:opacity-50 flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{mode === 'add' ? 'Creating...' : 'Updating...'}</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{mode === 'add' ? 'Create Course' : 'Update Course'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseModal;