import React from 'react';
import { ChatCircle, CheckCircle, ArrowsClockwise, Warning, WarningCircle } from '@phosphor-icons/react';
import { Course, User } from '../types';

interface AIPracticeStatus {
  available: boolean;
  reason: string;
  isCompleted?: boolean;
  isLimitReached?: boolean;
  isDisabledByAdmin?: boolean;
}

interface AIPracticeSectionProps {
  course: Course;
  currentUser: User | null;
  tavusCompleted: boolean;
  tavusAccuracy?: number;
  aiPracticeStatus: AIPracticeStatus;
  onAIPractice: () => void;
  onRetakePractice: () => void;
  isModuleCompleted?: boolean;
}

const AIPracticeSection: React.FC<AIPracticeSectionProps> = ({
  course,
  currentUser,
  tavusCompleted,
  tavusAccuracy,
  aiPracticeStatus,
  onAIPractice,
  onRetakePractice,
  isModuleCompleted = false
}) => {
  return (
    <div>
      <button
        onClick={onAIPractice}
        disabled={!aiPracticeStatus.available} 
        className={`w-full px-6 py-5 rounded-[1.2rem] text-lg font-medium transition-all shadow-lg flex items-center justify-center space-x-3 text-white ${
          aiPracticeStatus.available 
            ? 'bg-cobalt hover:bg-[#4a4fd9]'
            : 'bg-grey text-gray-700 cursor-not-allowed opacity-70'
        }`}
      >
        <ChatCircle className="h-6 w-6" />
        <span>Practice with AI</span>
      </button>
      
      {/* Status Messages */}
      <div className="mt-3 text-center">
        {aiPracticeStatus.isDisabledByAdmin ? (
          <div className="flex items-center justify-center space-x-2 text-gold font-medium">
            <Warning className="h-5 w-5 flex-shrink-0" />
            <p className="text-base">
              {aiPracticeStatus.reason}
            </p>
          </div>
        ) : aiPracticeStatus.isLimitReached ? (
          <div className="flex items-center justify-center space-x-2">
            <WarningCircle className="h-5 w-5 flex-shrink-0 text-red" />
            <p className="text-base text-red font-medium flex items-center">
              <span className="mr-1">❌</span> {aiPracticeStatus.reason}
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2 text-gray-700">
            <Warning className="h-5 w-5 flex-shrink-0 text-gray-600" />
            <p className="text-base font-medium">
              {aiPracticeStatus.reason}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPracticeSection;