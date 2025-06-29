import React, { useState } from 'react';
import { Eye, WarningCircle, ArrowsClockwise, ChatCircle } from '@phosphor-icons/react';
import Plyr from 'plyr-react';
import { Course, AccessLevel } from '../../types';

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
  tavusConversationUrl: string;
}

interface PreviewPaneProps {
  formData: FormData;
  previewError: string;
  onPreviewErrorChange: (error: string) => void;
}

const PreviewPane: React.FC<PreviewPaneProps> = ({
  formData,
  previewError,
  onPreviewErrorChange
}) => {
  const [imageError, setImageError] = useState(false);

  // Get YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    // Only match valid 11-character YouTube video IDs
    const match = url.match(/\/embed\/([\w-]{11})(?:\?|$)/);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(formData.videoUrl);
  const hasValidVideoId = videoId && videoId.length === 11;

  // Plyr video source configuration for preview
  const plyrSource = {
    type: 'video' as const,
    sources: [
      {
        src: hasValidVideoId ? videoId : '',
        provider: 'youtube' as const,
      },
    ],
    poster: formData.thumbnailUrl || undefined,
  };

  // Enhanced Plyr options for preview
  const plyrOptions = {
    ratio: '16:9',
    autoplay: false,
    muted: true,
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
    keyboard: { focused: true, global: false },
    tooltips: { controls: true, seek: true },
    youtube: {
      noCookie: true,
      rel: 0,
      showinfo: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      playsinline: 1,
    },
    responsive: true,
  };

  const handleImageRetry = () => {
    setImageError(false);
  };

  return (
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
              <>
                <img
                  src={formData.thumbnailUrl}
                  alt="Course thumbnail preview"
                  loading="lazy"
                  className="w-full h-full object-cover"
                  onError={() => {
                    setImageError(true);
                    onPreviewErrorChange('Failed to load thumbnail image');
                  }}
                  onLoad={() => {
                    setImageError(false);
                    onPreviewErrorChange('');
                  }}
                />
                {/* Upload indicator for Firebase Storage URLs */}
                {formData.thumbnailUrl.includes('firebasestorage.googleapis.com') && (
                  <div className="absolute top-2 right-2 bg-emerald-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Uploaded
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-base">Thumbnail preview</p>
                </div>
              </div>
            )}
          </div>
          {imageError && (
            <div className="mt-2 flex items-center justify-between">
              <p className="text-base text-red-600 flex items-center space-x-1">
                <WarningCircle className="h-4 w-4" />
                <span>Failed to load thumbnail image</span>
              </p>
              <button
                onClick={handleImageRetry}
                className="text-[#FF7A59] hover:text-[#FF8A6B] transition-colors text-base underline flex items-center space-x-1"
              >
                <ArrowsClockwise className="h-4 w-4" />
                <span>Retry</span>
              </button>
            </div>
          )}
        </div>

        {/* Video Preview */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Video</h4>
          <div className="w-full aspect-video bg-gray-100 rounded-[12px] overflow-hidden border border-gray-200 max-w-[640px]">
            <div className="relative w-full h-auto">
              <Plyr
                source={hasValidVideoId ? plyrSource : undefined}
                options={plyrOptions}
                aria-label="Course video preview"
                onReady={() => onPreviewErrorChange('')}
                onError={() => onPreviewErrorChange('Failed to load video preview. Check URL format.')}
              />
              {!hasValidVideoId && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-100">
                  <div className="text-center">
                    <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-base">Video preview</p>
                    {formData.videoUrl && formData.videoUrl.includes('youtube-nocookie.com') && (
                      <p className="text-sm mt-1 text-red-500">Invalid YouTube video ID</p>
                    )}
                    {!formData.videoUrl && (
                      <p className="text-sm mt-1">Enter a valid YouTube nocookie URL</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tavus AI Practice Preview */}
        {formData.tavusConversationUrl && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center space-x-2">
              <ChatCircle className="h-5 w-5 text-[#FF7A59]" />
              <span>AI Practice Session</span>
            </h4>
            <div className="bg-[#FF7A59]/10 border border-[#FF7A59]/20 rounded-[12px] p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-[#FF7A59] rounded-full flex items-center justify-center">
                  <ChatCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">Tavus AI Practice</p>
                  <p className="text-sm text-gray-600">Interactive conversation enabled</p>
                </div>
              </div>
              <p className="text-sm text-gray-700">
                Students will be able to practice with AI after watching the video lesson.
              </p>
              <div className="mt-3">
                <p className="text-xs text-gray-500 break-all">
                  URL: {formData.tavusConversationUrl}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPane;