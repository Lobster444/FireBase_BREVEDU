import React from 'react';
import { Clock } from 'lucide-react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  onClick: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
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
          bgColor: 'bg-emerald-100',
          textColor: 'text-emerald-800'
        };
      case 'free':
        return {
          label: 'Free',
          bgColor: 'bg-emerald-100',
          textColor: 'text-emerald-800'
        };
      case 'premium':
        return {
          label: 'Pro',
          bgColor: 'bg-indigo-100',
          textColor: 'text-indigo-800'
        };
      default:
        return {
          label: 'Free',
          bgColor: 'bg-emerald-100',
          textColor: 'text-emerald-800'
        };
    }
  };

  const accessBadge = getAccessBadge();

  return (
    <div 
      className="bg-white rounded-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.1)] p-6 cursor-pointer group focus:outline-none focus:ring-4 focus:ring-[#FF7A59] focus:ring-opacity-40 focus:ring-offset-2 focus:ring-offset-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:-translate-y-1 hover:animate-[card-breathe_3s_infinite] transition-all duration-300 ease-headspace"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${course.title}`}
    >
      {/* Thumbnail */}
      <div className="relative w-full h-32 bg-neutral-gray/20 rounded-[8px] overflow-hidden mb-4">
        <img 
          src={course.thumbnailUrl} 
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-headspace"
        />
        
        {/* Duration badge - Bottom Right with improved legibility */}
        <div className="absolute bottom-2 right-2 bg-gray-900/85 backdrop-blur-sm px-3 py-1.5 rounded-[6px] text-sm font-semibold text-white flex items-center space-x-1.5">
          <Clock className="h-3.5 w-3.5" />
          <span>{course.duration}</span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#FF7A59] transition-colors duration-300 ease-headspace leading-tight">
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
            <span className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-[8px] text-sm font-semibold">
              {course.category}
            </span>
            
            {/* Access level badge */}
            <span className={`${accessBadge.bgColor} ${accessBadge.textColor} px-3 py-1.5 rounded-[8px] text-sm font-bold`}>
              {accessBadge.label}
            </span>
          </div>
          
          {/* Right side - Difficulty and Draft status */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-gray-700 bg-gray-50 px-3 py-1.5 rounded-[8px]">
              {course.difficulty}
            </span>
            {!course.published && (
              <span className="text-sm text-purple-800 bg-purple-100 px-3 py-1.5 rounded-[8px] font-semibold">
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