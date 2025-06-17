import React from 'react';
import { WifiOff, AlertTriangle } from 'lucide-react';

interface OfflineBannerProps {
  isVisible: boolean;
  message?: string;
  className?: string;
}

const OfflineBanner: React.FC<OfflineBannerProps> = ({ 
  isVisible, 
  message = "You're offline – unable to save changes until connection is restored.",
  className = ""
}) => {
  if (!isVisible) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${className}`}>
      <div className="bg-neutral-gray/90 backdrop-blur-ios border-b border-neutral-gray/30 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-3">
          <div className="flex items-center space-x-2 text-accent-yellow">
            <WifiOff className="h-5 w-5 animate-pulse" />
            <AlertTriangle className="h-4 w-4" />
          </div>
          <span className="text-body text-text-light font-medium">
            {message}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OfflineBanner;