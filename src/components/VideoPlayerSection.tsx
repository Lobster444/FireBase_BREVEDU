import React, { useState } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Plyr from 'plyr-react';
import 'plyr-react/plyr.css';

interface VideoPlayerSectionProps {
  videoUrl: string;
  thumbnailUrl: string;
  courseTitle: string;
  userId?: string;
  courseId?: string;
  onVideoError: (error: boolean) => void;
  onVideoLoading: (loading: boolean) => void;
  videoError: boolean;
  isVideoLoading: boolean;
}

const VideoPlayerSection: React.FC<VideoPlayerSectionProps> = ({
  videoUrl,
  thumbnailUrl,
  courseTitle,
  userId,
  courseId,
  onVideoError,
  onVideoLoading,
  videoError,
  isVideoLoading
}) => {
  const [hasTrackedCompletion, setHasTrackedCompletion] = useState(false);

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

  const handleVideoRetry = () => {
    onVideoError(false);
    onVideoLoading(true);
    setHasTrackedCompletion(false);
  };

  // Handle video progress tracking
  const handleVideoProgress = async (currentTime: number, duration: number) => {
    // Only track if we have user and course info, and haven't already tracked completion
    if (!userId || !courseId || hasTrackedCompletion) {
      return;
    }

    // Check if video is within 5 seconds of completion
    const isNearCompletion = currentTime >= (duration - 5);
    
    if (isNearCompletion) {
      try {
        const { updateCourseProgress } = await import('../lib/progressService');
        await updateCourseProgress(userId, courseId, 50, 'video');
        setHasTrackedCompletion(true);
        console.log('📹 Video completion tracked for course:', courseId);
      } catch (error) {
        console.error('❌ Error tracking video completion:', error);
      }
    }
  };

  const videoId = getYouTubeVideoId(videoUrl);

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
      poster: thumbnailUrl
    };
    
    console.log('🎬 Created Plyr source:', source);
    return source;
  };

  const plyrSource = createPlyrSource();

  return (
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
                className="bg-[#FF7A59] text-white px-4 py-2 rounded-headspace-md text-base font-medium hover:bg-[#FF8A6B] transition-all flex items-center space-x-2 mx-auto"
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
                console.log('📺 Video URL:', videoUrl);
                onVideoLoading(false);
              }}
              onError={(error) => {
                console.error('❌ Plyr error:', error);
                console.log('🔍 Debug info:', {
                  videoId,
                  videoUrl,
                  plyrSource
                });
                onVideoError(true);
                onVideoLoading(false);
              }}
              onLoadStart={() => {
                console.log('⏳ Video load started');
                onVideoLoading(true);
              }}
              onCanPlay={() => {
                console.log('✅ Video can play');
                onVideoLoading(false);
              }}
              onPlay={() => {
                console.log('▶️ Video started playing');
              }}
              onPause={() => {
                console.log('⏸️ Video paused');
              }}
              onTimeUpdate={(event) => {
                if (event.detail && event.detail.plyr) {
                  const player = event.detail.plyr;
                  if (player && player.duration) {
                    handleVideoProgress(player.currentTime, player.duration);
                  }
                }
              }}
              onEnded={() => {
                console.log('🎬 Video ended - ensuring progress is tracked');
                if (userId && courseId && !hasTrackedCompletion) {
                  handleVideoProgress(999999, 1000000); // Force completion by simulating near-end time
                }
              }}
              aria-label="Course video preview"
            />
            {isVideoLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-headspace-xl">
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
                URL: {videoUrl}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayerSection;