import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ThumbnailSectionProps {
  thumbnailUrl: string;
  courseTitle: string;
  imageError: boolean;
  onImageError: (error: boolean) => void;
  isModuleCompleted?: boolean;
}

const ThumbnailSection: React.FC<ThumbnailSectionProps> = ({
  thumbnailUrl,
  courseTitle,
  imageError,
  onImageError,
  isModuleCompleted = false
}) => {
  const handleImageRetry = () => {
    onImageError(false);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Course Thumbnail</h3>
      <div className="w-full aspect-video bg-gray-100 rounded-headspace-xl overflow-hidden border border-gray-200">
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center text-center p-4">
            <div>
              <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
              <p className="text-base text-gray-600 mb-2">Image failed to load</p>
              <button
                onClick={handleImageRetry}
                className="text-[#FF7A59] hover:text-[#FF8A6B] transition-colors text-base underline rounded-headspace-sm"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <img
            src={thumbnailUrl}
            alt={`${courseTitle} thumbnail`}
            loading="lazy"
            className="w-full h-full object-cover"
            onError={() => onImageError(true)}
          />
        )}
      </div>
      
      {/* Module completion indicator */}
      {isModuleCompleted && (
        <div className="mt-3 text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
            ✅ Module Completed
          </span>
        </div>
      )}
    </div>
  );
};

export default ThumbnailSection;