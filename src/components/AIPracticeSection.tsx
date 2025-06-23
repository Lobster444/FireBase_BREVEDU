import React from 'react';
import { MessageCircle, CheckCircle, RotateCcw } from 'lucide-react';
import { Course, User } from '../types';

interface AIPracticeStatus {
  available: boolean;
  reason: string;
  isCompleted?: boolean;
  isLimitReached?: boolean;
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
        className={`w-full px-6 py-4 rounded-headspace-lg text-lg font-medium transition-all shadow-[0_2px_8px_rgba(0,0,0,0.1)] flex items-center justify-center space-x-3 text-white ${
          aiPracticeStatus.available
            ? 'bg-primary text-white hover:bg-primary-hover'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-60'
        }`}
      >
        <MessageCircle className="h-5 w-5" />
        <span>Practice with AI</span>
      </button>
      
      {/* Status Messages */}
      <div className="mt-2 text-center">
        {aiPracticeStatus.isLimitReached ? (
          <p className="text-sm text-red-600 font-medium">
            ❌ {aiPracticeStatus.reason}
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            {aiPracticeStatus.reason}
          </p>
        )}
      </div>
    </div>
  );
};

export default AIPracticeSection;