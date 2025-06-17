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

  // Get access level badge info
  const getAccessBadge = () => {
    const accessLevel = course.accessLevel || 'free';
    
    switch (accessLevel) {
      case 'anonymous':
        return {
          label: 'Free',
          bgColor: 'bg-accent-green',
          textColor: 'text-text-dark'
        };
      case 'free':
        return {
          label: 'Free',
          bgColor: 'bg-accent-green',
          textColor: 'text-text-dark'
        };
      case 'premium':
        return {
          label: 'Pro',
          bgColor: 'bg-blue-600',
          textColor: 'text-white'
        };
      default:
        return {
          label: 'Free',
          bgColor: 'bg-accent-green',
          textColor: 'text-text-dark'
        };
    }
  };

  const accessBadge = getAccessBadge();

  return (
    <div 
      className="bg-white rounded-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.1)] p-6 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#FF7A59] focus:ring-offset-2 focus:ring-offset-primary hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-200 ease-out"
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
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Duration badge - Bottom Right */}
        <div className="absolute bottom-2 right-2 bg-primary/80 backdrop-blur-sm px-2 py-1 rounded-[6px] text-x-small text-text-light flex items-center space-x-1">
          <Clock className="h-3 w-3" />
          <span>{course.duration}</span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-[#FF7A59] transition-colors duration-200">
          {course.title}
        </h3>
        
        {/* Description */}
        <p className="text-base font-normal text-gray-800 mb-4 line-clamp-3 leading-relaxed">
          {course.description}
        </p>
        
        {/* Bottom badges row */}
        <div className="mt-auto flex items-center justify-between">
          {/* Left side - Topic and Access Level badges */}
          <div className="flex items-center space-x-2">
            {/* Topic badge */}
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-[8px] text-sm font-medium">
              {course.category}
            </span>
            
            {/* Access level badge */}
            <span className={`${accessBadge.bgColor} ${accessBadge.textColor} px-3 py-1 rounded-[8px] text-sm font-bold`}>
              {accessBadge.label}
            </span>
          </div>
          
          {/* Right side - Difficulty and Draft status */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-[8px] font-medium">
              {course.difficulty}
            </span>
            {!course.published && (
              <span className="text-sm text-accent-purple bg-accent-purple/20 px-3 py-1 rounded-[8px] font-medium">
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