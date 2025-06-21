import React from 'react';
import { Clock, MessageCircle, CheckCircle, Lock } from 'lucide-react';
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

  // Check if this is a premium course that the user can't access
  const isPremiumRestricted = course.accessLevel === 'premium' && currentUser?.role === 'free';
  return (
    <div 
      className={`bg-white rounded-headspace-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] p-padding-small cursor-pointer group focus:outline-none focus:ring-4 focus:ring-[#FF7A59] focus:ring-opacity-40 focus:ring-offset-2 focus:ring-offset-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:-translate-y-1 hover:animate-[card-breathe_3s_infinite] transition-all duration-300 ease-headspace ${
        isPremiumRestricted ? 'relative' : ''
      }`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${course.title}`}
    >
      {/* Premium Lock Overlay */}
      {isPremiumRestricted && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] rounded-headspace-xl flex items-center justify-center z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-lg">
            <Lock className="h-6 w-6 text-[#C967D3]" />
          </div>
        </div>
      )}
      
      {/* Thumbnail */}
      <div className="relative w-full aspect-square bg-neutral-gray/20 rounded-headspace-md overflow-hidden mb-4">
        <img 
          src={course.thumbnailUrl} 
          alt={course.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-headspace"
        />
        
        {/* AI Practice badge - Top Right */}

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
        
        {/* Course Info: Topic, Type, Duration */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-headspace-sm font-medium">
            {course.category}
          </span>
          <span className="text-gray-500">•</span>
          <div className="flex items-center space-x-1 font-medium text-gray-700">
            <Clock className="h-3.5 w-3.5" />
            <span>{course.duration}</span>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-base font-normal text-gray-700 mb-4 line-clamp-3 leading-relaxed">
          {course.description}
        </p>
        
        {/* Bottom badges row */}
        <div className="mt-auto flex items-center justify-between">
          {/* Left side - Access Level badge */}
          <div className="flex items-center">
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