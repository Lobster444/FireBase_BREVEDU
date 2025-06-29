import React from 'react';
import { ArrowRight, Star, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleMoreCoursesClick = () => {
    onClose(); // Close the modal first
    navigate('/courses'); // Use React Router navigation
  };

  return (
    <div className="space-y-6">
      {/* More Courses Button */}
      <button
        onClick={handleMoreCoursesClick}
        className="w-full border border-black/10 bg-grey text-gray-800 px-6 py-4 rounded-[1.2rem] text-lg font-medium hover:bg-[#e0e5e0] hover:border-black/20 transition-all shadow-md flex items-center justify-center"
      >
        More Courses
      </button>

      {/* Upgrade Prompt for Free Users */}
      {currentUser?.role === 'free' && (
        <div className="bg-currant border border-currant/30 rounded-[1.2rem] p-6 text-center">
          <Star className="h-8 w-8 text-white mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-white mb-2">Want More Practice?</h4>
          <p className="text-base text-white/90 mb-4">
            Upgrade to BrevEdu+ for 3 daily AI practice sessions and premium content.
          </p>
          <a
            href="/brevedu-plus"
            className="inline-block bg-white text-currant px-5 py-3 rounded-[0.8rem] text-base font-semibold hover:bg-grey transition-all"
            onClick={onClose}
          >
            Upgrade Now
          </a>
        </div>
      )}

      {/* Sign In Prompt for Anonymous Users */}
      {!currentUser && (
        <div className="bg-cobalt border border-cobalt/30 rounded-[1.2rem] p-6 text-center">
          <MessageCircle className="h-8 w-8 text-white mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-white mb-2">Ready to Practice?</h4>
          <p className="text-base text-white/90 mb-4">
            Sign in to start practicing with AI and track your progress.
          </p>
          <button
            className="inline-block bg-white text-cobalt px-5 py-3 rounded-[0.8rem] text-base font-semibold hover:bg-grey transition-all"
            onClick={() => {
              onClose();
              navigate('/');
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