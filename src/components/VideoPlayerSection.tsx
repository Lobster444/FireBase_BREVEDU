import React, { useState } from 'react';
import { WarningCircle, ArrowsClockwise } from '@phosphor-icons/react';
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
      <div className="w-full aspect-video bg-grey rounded-[1.2rem] overflow-hidden border border-black/5 max-w-[640px] mx-auto lg:mx-0 shadow-lg">
        {videoError ? (
          <div className="w-full h-full flex items-center justify-center text-center p-6">
            <div>
              <WarningCircle className="h-12 w-12 text-red mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-black mb-2">Video failed to load</h3>
              <p className="text-base text-gray-700 mb-4">
                There was a problem loading the video. Please check your connection and try again.
              </p>
              <button
                onClick={handleVideoRetry}
                className="bg-cobalt text-white px-4 py-2 rounded-[0.8rem] text-base font-medium hover:bg-[#4a4fd9] transition-all flex items-center space-x-2 mx-auto"
              >
                <ArrowsClockwise className="h-4 w-4" />
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
              aria-label="Course video preview"
            />
            {isVideoLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-grey rounded-[1.2rem]">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cobalt mb-4"></div>
                  <p className="text-base text-gray-700">Loading video...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-center p-6">
            <div>
              <WarningCircle className="h-12 w-12 text-red mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-black mb-2">Invalid video URL</h3>
              <p className="text-base text-gray-700">
                The video URL is not valid or supported. Video ID: {videoId || 'Not found'}
              </p>
              <p className="text-sm text-gray-600 mt-2">
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