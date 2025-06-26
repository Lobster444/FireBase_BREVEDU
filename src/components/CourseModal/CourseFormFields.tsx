import React from 'react';
import { AlertCircle, User, Mail, Lock, MessageCircle, Shield } from 'lucide-react';
import { Course, AccessLevel } from '../../types';
import ImageUploadField from './ImageUploadField';

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

interface CourseFormFieldsProps {
  formData: FormData;
  errors: FormErrors;
  onChange: (field: keyof FormData, value: string | boolean) => void;
  firstInputRef: React.RefObject<HTMLInputElement>;
}

const CourseFormFields: React.FC<CourseFormFieldsProps> = ({
  formData,
  errors,
  onChange,
  firstInputRef
}) => {
  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    onChange(field, value);
  };

  return (
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
              : 'border-gray-300 focus:border-[#002fa7] focus:ring-[#002fa7]/20'
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
              : 'border-gray-300 focus:border-[#002fa7] focus:ring-[#002fa7]/20'
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
              : 'border-gray-300 focus:border-[#002fa7] focus:ring-[#002fa7]/20'
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

      {/* NEW: AI Conversational Context */}
      <div>
        <label htmlFor="conversationalContext" className="block text-base font-semibold text-gray-900 mb-2 flex items-center space-x-2">
          <MessageCircle className="h-5 w-5 text-[#FF7A59]" />
          <span>AI Conversation Context ({formData.conversationalContext.length}/1000)</span>
        </label>
        <textarea
          id="conversationalContext"
          value={formData.conversationalContext}
          onChange={(e) => handleInputChange('conversationalContext', e.target.value)}
          rows={4}
          className={`w-full px-4 py-3 bg-white border rounded-[10px] text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors resize-vertical ${
            errors.conversationalContext 
              ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' 
              : 'border-gray-300 focus:border-[#FF7A59] focus:ring-[#FF7A59]/20'
          }`}
          placeholder="Define how the AI should behave and what topics to focus on during practice conversations. Example: 'You are a JavaScript tutor. Help students practice variables, functions, and basic concepts. Ask questions to test their understanding and provide helpful explanations.'"
          maxLength={1000}
          aria-describedby={errors.conversationalContext ? 'conversationalContext-error' : 'conversationalContext-help'}
        />
        {errors.conversationalContext ? (
          <p id="conversationalContext-error" className="mt-1 text-base text-red-600 flex items-center space-x-1">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.conversationalContext}</span>
          </p>
        ) : (
          <p id="conversationalContext-help" className="mt-1 text-sm text-gray-600">
            This context guides the AI's behavior during practice sessions. If left empty, the course description will be used as fallback.
          </p>
        )}
      </div>

      {/* Tavus AI Conversation URL - Updated placeholder and help text */}
      <div>
        <label htmlFor="tavusConversationUrl" className="block text-base font-semibold text-gray-900 mb-2 flex items-center space-x-2">
          <MessageCircle className="h-5 w-5 text-[#FF7A59]" />
          <span>Legacy Tavus URL (Optional)</span>
        </label>
        <input
          type="url"
          id="tavusConversationUrl"
          value={formData.tavusConversationUrl}
          onChange={(e) => handleInputChange('tavusConversationUrl', e.target.value)}
          className={`w-full px-4 py-3 bg-white border rounded-[10px] text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
            errors.tavusConversationUrl 
              ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' 
              : 'border-gray-300 focus:border-[#FF7A59] focus:ring-[#FF7A59]/20'
          }`}
          placeholder="https://tavus.daily.co/your_conversation_id (legacy - not recommended)"
          aria-describedby={errors.tavusConversationUrl ? 'tavusUrl-error' : 'tavusUrl-help'}
        />
        {errors.tavusConversationUrl ? (
          <p id="tavusUrl-error" className="mt-1 text-base text-red-600 flex items-center space-x-1">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.tavusConversationUrl}</span>
          </p>
        ) : (
          <p id="tavusUrl-help" className="mt-1 text-sm text-gray-600">
            Legacy static URL support. New courses should use the AI Conversation Context above for dynamic conversations.
          </p>
        )}
      </div>

      {/* Thumbnail URL */}
      <div>
        <ImageUploadField
          value={formData.thumbnailUrl}
          onChange={(url) => handleInputChange('thumbnailUrl', url)}
          error={errors.thumbnailUrl}
          label="Thumbnail Image (Optional)"
          required={false}
        />
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          {errors.accessLevel && (
            <p id="accessLevel-error" className="mt-1 text-base text-red-600 flex items-center space-x-1">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.accessLevel}</span>
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
  );
};

export default CourseFormFields;