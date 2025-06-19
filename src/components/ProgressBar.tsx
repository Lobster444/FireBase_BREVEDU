import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';

interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  className = '',
  showLabel = true,
  size = 'md'
}) => {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progress));
  
  // Size configurations
  const sizeConfig = {
    sm: {
      height: 'h-2',
      textSize: 'text-sm',
      iconSize: 'h-4 w-4'
    },
    md: {
      height: 'h-3',
      textSize: 'text-base',
      iconSize: 'h-5 w-5'
    },
    lg: {
      height: 'h-4',
      textSize: 'text-lg',
      iconSize: 'h-6 w-6'
    }
  };

  const config = sizeConfig[size];

  // Progress status
  const getProgressStatus = () => {
    if (clampedProgress === 0) {
      return {
        label: 'Not Started',
        color: 'text-gray-600',
        bgColor: 'bg-gray-200',
        fillColor: 'bg-gray-400',
        icon: Clock
      };
    } else if (clampedProgress === 50) {
      return {
        label: 'Video Watched',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        fillColor: 'bg-blue-500',
        icon: Clock
      };
    } else if (clampedProgress === 100) {
      return {
        label: 'Completed',
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-100',
        fillColor: 'bg-emerald-500',
        icon: CheckCircle
      };
    } else {
      return {
        label: 'In Progress',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        fillColor: 'bg-blue-500',
        icon: Clock
      };
    }
  };

  const status = getProgressStatus();
  const Icon = status.icon;

  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon className={`${config.iconSize} ${status.color}`} />
            <span className={`${config.textSize} font-medium ${status.color}`}>
              {status.label}
            </span>
          </div>
          <span className={`${config.textSize} font-semibold ${status.color}`}>
            {clampedProgress}%
          </span>
        </div>
      )}
      
      {/* Progress Bar */}
      <div className={`w-full ${status.bgColor} rounded-full ${config.height} overflow-hidden`}>
        <div 
          className={`${config.height} ${status.fillColor} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clampedProgress}%` }}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Course progress: ${clampedProgress}%`}
        />
      </div>
      
      {/* Progress milestones */}
      {clampedProgress > 0 && (
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span className={clampedProgress >= 50 ? 'text-blue-600 font-medium' : ''}>
            Video {clampedProgress >= 50 ? '✓' : '○'}
          </span>
          <span className={clampedProgress >= 100 ? 'text-emerald-600 font-medium' : ''}>
            AI Practice {clampedProgress >= 100 ? '✓' : '○'}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;