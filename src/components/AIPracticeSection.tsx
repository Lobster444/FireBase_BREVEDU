import React from 'react';
import { MessageCircle, CheckCircle, RotateCcw } from 'lucide-react';
import { Course, User } from '../types';

interface AIPracticeStatus {
  available: boolean;
  reason: string;
}

interface AIPracticeSectionProps {
  course: Course;
  currentUser: User | null;
  tavusCompleted: boolean;
  tavusAccuracy?: number;
  aiPracticeStatus: AIPracticeStatus;
  onAIPractice: () => void;
  onRetakePractice: () => void;
}

const AIPracticeSection: React.FC<AIPracticeSectionProps> = ({
  course,
  currentUser,
  tavusCompleted,
  tavusAccuracy,
  aiPracticeStatus,
  onAIPractice,
  onRetakePractice
}) => {
  return (
    <div>
      {tavusCompleted ? (
        <div className="space-y-3">
          <div className="bg-emerald-50 border border-emerald-200 rounded-[12px] p-4 text-center">
            <CheckCircle className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
            <h4 className="text-base font-semibold text-emerald-900 mb-1">Practice Completed!</h4>
            {tavusAccuracy && (
              <p className="text-sm text-emerald-700 mb-2">
                Accuracy Score: {tavusAccuracy}%
              </p>
            )}
            <p className="text-sm text-emerald-600">
              You've successfully completed the AI practice session for this course.
            </p>
          </div>
          <button
            onClick={onRetakePractice}
            disabled={!aiPracticeStatus.available}
            className={`w-full px-6 py-3 rounded-[10px] text-base font-medium transition-all shadow-[0_2px_8px_rgba(0,0,0,0.1)] flex items-center justify-center space-x-2 ${
              aiPracticeStatus.available
                ? 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-60'
            }`}
          >
            <RotateCcw className="h-4 w-4" />
            <span>Practice Again</span>
          </button>
        </div>
      ) : (
        <button
          onClick={onAIPractice}
          disabled={!aiPracticeStatus.available}
          className={`w-full px-6 py-4 rounded-[10px] text-lg font-medium transition-all shadow-[0_2px_8px_rgba(0,0,0,0.1)] flex items-center justify-center space-x-3 ${
            aiPracticeStatus.available
              ? 'bg-[#FF7A59] text-white hover:bg-[#FF8A6B]'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-60'
          }`}
        >
          <MessageCircle className="h-5 w-5" />
          <span>Practice with AI</span>
        </button>
      )}
      <p className="text-sm text-gray-600 mt-2 text-center">
        {aiPracticeStatus.reason}
      </p>
    </div>
  );
};

export default AIPracticeSection;