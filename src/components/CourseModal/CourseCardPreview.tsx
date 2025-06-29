import React from 'react';
import { Shield, ChatCircle } from '@phosphor-icons/react';
import { Course, AccessLevel } from '../../types';

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
}

interface AccessLevelInfo {
  label: string;
  description: string;
  color: string;
  bgColor: string;
  icon: string;
}

interface CourseCardPreviewProps {
  formData: FormData;
  accessLevelInfo: AccessLevelInfo;
}

const CourseCardPreview: React.FC<CourseCardPreviewProps> = ({
  formData,
  accessLevelInfo
}) => {
  return (
    <div className="space-y-6">
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
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                  formData.accessLevel === 'premium' 
                    ? 'bg-[#C967D3] text-white' 
                    : 'bg-[#6D9A52] text-white'
                }`}>
                  <span>{formData.accessLevel === 'premium' ? 'Premium' : 'Free'}</span>
                </span>
              </span>
              {formData.tavusConversationUrl && (
                <span className="text-sm text-[#002fa7] bg-[#002fa7]/10 px-2 py-1 rounded-[6px] flex items-center space-x-1">
                  <ChatCircle className="h-3 w-3" />
                  <span>AI Practice</span>
                </span>
              )}
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
          <p className="text-sm text-[#002fa7] mt-2">
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
  );
};

export default CourseCardPreview;