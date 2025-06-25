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
        className="w-full border-2 border-gray-400 bg-gray-100 text-gray-800 px-6 py-3 rounded-headspace-lg text-lg font-medium hover:bg-gray-200 hover:border-gray-500 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.1)] flex items-center justify-center"
      >
        More Courses
      </button>

      {/* Upgrade Prompt for Free Users */}
      {currentUser?.role === 'free' && (
        <div className="bg-subscription-free border border-subscription-free/30 rounded-headspace-xl p-4 text-center">
          <Star className="h-6 w-6 text-white mx-auto mb-2" />
          <h4 className="text-base font-semibold text-white mb-1">Want More Practice?</h4>
          <p className="text-sm text-white/90 mb-3">
            Upgrade to BrevEdu+ for 3 daily AI practice sessions and premium content.
          </p>
          <a
            href="/brevedu-plus"
            className="inline-block bg-white text-subscription-free px-4 py-2 rounded-headspace-md text-base font-semibold hover:bg-gray-100 transition-all"
            onClick={onClose}
          >
            Upgrade Now
          </a>
        </div>
      )}

      {/* Sign In Prompt for Anonymous Users */}
      {!currentUser && (
        <div className="bg-subscription-free border border-subscription-free/30 rounded-headspace-xl p-4 text-center">
          <MessageCircle className="h-6 w-6 text-white mx-auto mb-2" />
          <h4 className="text-base font-semibold text-white mb-1">Ready to Practice?</h4>
          <p className="text-sm text-white/90 mb-3">
            Sign in to start practicing with AI and track your progress.
          </p>
          <button
            className="inline-block bg-white text-subscription-free px-4 py-2 rounded-headspace-md text-base font-semibold hover:bg-gray-100 transition-all"
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