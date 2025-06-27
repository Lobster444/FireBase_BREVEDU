import React, { useState, useEffect, useRef } from 'react';
import { Course, AccessLevel } from '../../types';
import { addCourse, updateCourse, isValidTavusUrl } from '../../lib/courseService';
import { notifyLoading, updateToast } from '../../lib/toast';
import { useNetworkStatusWithUtils } from '../../hooks/useNetworkStatus';
import CourseFormFields from './CourseFormFields';
import PreviewPane from './PreviewPane';
import CourseCardPreview from './CourseCardPreview';
import ModalHeader from './ModalHeader';
import ModalFooter from './ModalFooter';

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
  accessLevel: AccessLevel;
  published: boolean;
  tavusConversationUrl: string;
  conversationalContext: string; // NEW: AI conversation context
}

interface FormErrors {
  title?: string;
  description?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: string;
  accessLevel?: string;
  tavusConversationUrl?: string;
  conversationalContext?: string; // NEW: Validation for AI context
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
    category: 'Science & Technology',
    accessLevel: 'free',
    published: false,
    tavusConversationUrl: '',
    conversationalContext: '', // NEW: Initialize AI context
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
          accessLevel: course.accessLevel || 'free',
          published: course.published,
          tavusConversationUrl: course.tavusConversationUrl || '',
          conversationalContext: course.conversationalContext || course.tavusConversationalContext || '' // NEW: Load AI context
        });
      } else {
        // Reset form for add mode
        setFormData({
          title: '',
          description: '',
          videoUrl: '',
          thumbnailUrl: '',
          duration: '',
          category: 'Science & Technology',
          accessLevel: 'free',
          published: false,
          tavusConversationUrl: '',
          conversationalContext: '' // NEW: Reset AI context
        });
      }
      setErrors({});
      setPreviewError('');
    }
  }, [isOpen, mode, course]);

  // Focus management
  useEffect(() => {
    if (isOpen && firstInputRef.current) {
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

    // NEW: Conversational context validation (optional but with length limit)
    if (formData.conversationalContext.trim() && formData.conversationalContext.length > 1000) {
      newErrors.conversationalContext = 'AI conversation context must be 1000 characters or less';
    }

    // Tavus conversation URL validation (optional field)
    if (formData.tavusConversationUrl.trim()) {
      if (!isValidTavusUrl(formData.tavusConversationUrl.trim())) {
        newErrors.tavusConversationUrl = 'Must be a valid Tavus conversation URL (https://tavus.daily.co/... or https://tavus.io/...)';
      }
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
          accessLevel: formData.accessLevel,
          published: formData.published,
          // Include Tavus conversation URL if provided
          tavusConversationUrl: formData.tavusConversationUrl.trim() || null,
          // NEW: Include conversational context for AI practice
          conversationalContext: formData.conversationalContext.trim() || null
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

  // Get access level display info
  const getAccessLevelInfo = (level: AccessLevel) => {
    switch (level) {
      case 'anonymous':
        return {
          label: 'Anonymous',
          description: 'Available to all visitors (no account required)',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          icon: '🌐'
        };
      case 'free':
        return {
          label: 'Free',
          description: 'Available to users with free accounts',
          color: 'text-yellow-700',
          bgColor: 'bg-yellow-100',
          icon: '👤'
        };
      case 'premium':
        return {
          label: 'Premium',
          description: 'Available only to BrevEdu+ subscribers',
          color: 'text-purple-700',
          bgColor: 'bg-purple-100',
          icon: '💎'
        };
      default:
        return {
          label: 'Free',
          description: 'Available to users with free accounts',
          color: 'text-yellow-700',
          bgColor: 'bg-yellow-100',
          icon: '👤'
        };
    }
  };

  if (!isOpen) return null;

  const accessLevelInfo = getAccessLevelInfo(formData.accessLevel);

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
        <ModalHeader mode={mode} onClose={onClose} />

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form Fields */}
            <div className="space-y-6">
              <CourseFormFields
                formData={formData}
                errors={errors}
                onChange={handleInputChange}
                firstInputRef={firstInputRef}
              />
            </div>

            {/* Right Column - Live Preview */}
            <div className="space-y-6">
              <PreviewPane
                formData={formData}
                previewError={previewError}
                onPreviewErrorChange={setPreviewError}
              />

              <CourseCardPreview
                formData={formData}
                accessLevelInfo={accessLevelInfo}
              />
            </div>
          </div>

          {/* Footer */}
          <ModalFooter
            mode={mode}
            isSubmitting={isSubmitting}
            onClose={onClose}
            onSubmit={handleSubmit}
          />
        </form>
      </div>
    </div>
  );
};

export default CourseModal;