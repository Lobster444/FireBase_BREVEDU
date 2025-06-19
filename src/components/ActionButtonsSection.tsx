import React from 'react';
import { ArrowRight, Star, MessageCircle } from 'lucide-react';
import { User } from '../types';

interface ActionButtonsSectionProps {
  currentUser: User | null;
  onMoreCourses: () => void;
  onClose: () => void;
}

const ActionButtonsSection: React.FC<ActionButtonsSectionProps> = ({
  currentUser,
  onMoreCourses,
  onClose
}) => {
  return (
    <div className="space-y-4">
      {/* More Courses Button */}
      <button
        onClick={onMoreCourses}
        className="w-full bg-[#F8DE7E] text-gray-900 px-6 py-3 rounded-headspace-lg text-lg font-medium hover:bg-[#F5D65A] transition-all shadow-[0_2px_8px_rgba(0,0,0,0.1)] flex items-center justify-center space-x-2"
      >
        <span>More Courses</span>
        <ArrowRight className="h-4 w-4" />
      </button>

      {/* Upgrade Prompt for Free Users */}
      {currentUser?.role === 'free' && (
        <div className="bg-[#002fa7]/10 border border-[#002fa7]/30 rounded-headspace-xl p-4 text-center">
          <Star className="h-6 w-6 text-[#002fa7] mx-auto mb-2" />
          <h4 className="text-base font-semibold text-gray-900 mb-1">Want More Practice?</h4>
          <p className="text-sm text-gray-600 mb-3">
            Upgrade to BrevEdu+ for 3 daily AI practice sessions and premium content.
          </p>
          <a
            href="/brevedu-plus"
            className="inline-block bg-[#002fa7] text-white px-4 py-2 rounded-headspace-md text-base font-medium hover:bg-[#0040d1] transition-all"
            onClick={onClose}
          >
            Upgrade Now
          </a>
        </div>
      )}

      {/* Sign In Prompt for Anonymous Users */}
      {!currentUser && (
        <div className="bg-[#F8DE7E]/10 border border-[#F8DE7E]/30 rounded-headspace-xl p-4 text-center">
          <MessageCircle className="h-6 w-6 text-[#F8DE7E] mx-auto mb-2" />
          <h4 className="text-base font-semibold text-gray-900 mb-1">Ready to Practice?</h4>
          <p className="text-sm text-gray-600 mb-3">
            Sign in to start practicing with AI and track your progress.
          </p>
          <button
            className="inline-block bg-[#F8DE7E] text-gray-900 px-4 py-2 rounded-headspace-md text-base font-medium hover:bg-[#F5D65A] transition-all"
            onClick={() => {
              onClose();
              // TODO: Open auth modal
              console.log('Open auth modal');
            }}
          >
            Sign In
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionButtonsSection;