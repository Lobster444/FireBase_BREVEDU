import React from 'react';
import { Clock, MessageCircle, CheckCircle } from 'lucide-react';
import { Course, hasTavusCompletion } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface CourseCardProps {
  course: Course;
  onClick: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
  const { currentUser } = useAuth();
  
  const handleClick = () => {
    onClick(course);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick(course);
    }
  };

  // Get access level badge info with improved contrast
  const getAccessBadge = () => {
    const accessLevel = course.accessLevel || 'free';
    
    switch (accessLevel) {
      case 'anonymous':
        return {
          label: 'Free',
          bgColor: 'bg-[#6D9A52]',
          textColor: 'text-white'
        };
      case 'free':
        return {
          label: 'Free',
          bgColor: 'bg-[#6D9A52]',
          textColor: 'text-white'
        };
      case 'premium':
        return {
          label: 'Premium',
          bgColor: 'bg-[#C967D3]',
          textColor: 'text-white'
        };
      default:
        return {
          label: 'Free',
          bgColor: 'bg-[#6D9A52]',
          textColor: 'text-white'
        };
    }
  };

  const accessBadge = getAccessBadge();
  
  // Check if user has completed Tavus practice for this course
  const tavusCompleted = currentUser && course.id ? hasTavusCompletion(currentUser, course.id) : false;

  return (
    <div 
      className="bg-white rounded-headspace-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] p-padding-small cursor-pointer group focus:outline-none focus:ring-4 focus:ring-[#FF7A59] focus:ring-opacity-40 focus:ring-offset-2 focus:ring-offset-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:-translate-y-1 hover:animate-[card-breathe_3s_infinite] transition-all duration-300 ease-headspace"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${course.title}`}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-square bg-neutral-gray/20 rounded-headspace-md overflow-hidden mb-4">
        <img 
          src={course.thumbnailUrl} 
          alt={course.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-headspace"
        />
        
        {/* Duration badge - Bottom Right with improved legibility */}
        <div className="absolute bottom-2 right-2 bg-gray-900/85 backdrop-blur-sm px-3 py-1.5 rounded-headspace-sm text-sm font-semibold text-white flex items-center space-x-1.5">
          <Clock className="h-3.5 w-3.5" />
          <span>{course.duration}</span>
        </div>

        {/* AI Practice badge - Top Right */}
        {course.tavusConversationUrl && (
          <div className="absolute top-2 right-2 bg-[#002fa7]/90 backdrop-blur-sm px-2 py-1 rounded-headspace-sm text-xs font-semibold text-white flex items-center space-x-1">
            <MessageCircle className="h-3 w-3" />
            <span>AI</span>
          </div>
        )}

        {/* Completion badge - Top Left */}
        {tavusCompleted && (
          <div className="absolute top-2 left-2 bg-emerald-500/90 backdrop-blur-sm px-2 py-1 rounded-headspace-sm text-xs font-semibold text-white flex items-center space-x-1">
            <CheckCircle className="h-3 w-3" />
            <span>Done</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#002fa7] transition-colors duration-300 ease-headspace leading-tight">
          {course.title}
        </h3>
        
        {/* Description */}
        <p className="text-base font-normal text-gray-700 mb-4 line-clamp-3 leading-relaxed">
          {course.description}
        </p>
        
        {/* Bottom badges row */}
        <div className="mt-auto flex items-center justify-between">
          {/* Left side - Topic and Access Level badges */}
          <div className="flex items-center space-x-2">
            {/* Topic badge */}
            <span className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-headspace-md text-sm font-semibold">
              {course.category}
            </span>
            
            {/* Access level badge */}
            <span className={`${accessBadge.bgColor} ${accessBadge.textColor} px-3 py-1.5 rounded-full text-sm font-medium`}>
              {accessBadge.label}
            </span>
          </div>
          
          {/* Right side - Draft status */}
          <div className="flex items-center space-x-2">
            {!course.published && (
              <span className="text-sm text-purple-800 bg-purple-100 px-3 py-1.5 rounded-headspace-md font-semibold">
                Draft
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;