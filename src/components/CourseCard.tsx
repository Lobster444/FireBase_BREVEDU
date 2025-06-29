import React from 'react';
import { Clock, ChatCircle, CheckCircle } from '@phosphor-icons/react';
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
          label: 'Public',
          bgColor: 'bg-kelp',
          textColor: 'text-white'
        };
      case 'free':
        return {
          label: 'Free',
          bgColor: 'bg-kelp',
          textColor: 'text-white'
        };
      case 'premium':
        return {
          label: 'Premium',
          bgColor: 'bg-currant',
          textColor: 'text-white'
        };
      default:
        return {
          label: 'Free',
          bgColor: 'bg-kelp',
          textColor: 'text-white'
        };
    }
  };

  const accessBadge = getAccessBadge();
  
  // Check if user has completed Tavus practice for this course
  const tavusCompleted = currentUser && course.id ? hasTavusCompletion(currentUser, course.id) : false;
  return (
    <div 
      className="bg-white rounded-[1.2rem] shadow-md p-6 cursor-pointer group focus:outline-none focus:ring-4 focus:ring-cobalt focus:ring-opacity-40 focus:ring-offset-2 focus:ring-offset-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-mc"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${course.title}`}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-square bg-grey rounded-[0.8rem] overflow-hidden mb-5">
        <img 
          src={course.thumbnailUrl} 
          alt={course.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-mc"
        />
        
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-cobalt transition-colors duration-300 ease-mc leading-tight">
          {course.title}
        </h3>
        
        {/* Course Info: Topic, Type, Duration */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
          <span className="bg-grey text-gray-800 px-2 py-1 rounded-[0.4rem] font-medium">
            {course.category}
          </span>
          <span className="text-gray-500">•</span>
          <div className="flex items-center space-x-1 font-medium text-gray-700">
            <Clock className="h-3.5 w-3.5" />
            <span>{course.duration}</span>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-base font-normal text-gray-700 mb-5 line-clamp-3 leading-relaxed">
          {course.description}
        </p>
        
        {/* Bottom badges row */}
        <div className="mt-auto flex items-center justify-between">
          {/* Left side - Access Level badge */}
          <div className="flex items-center">
            <span className={`${accessBadge.bgColor} ${accessBadge.textColor} px-3 py-1.5 rounded-full text-sm font-medium`}>
              {accessBadge.label}
            </span>
          </div>
          
          {/* Right side - Draft status */}
          <div className="flex items-center space-x-2">
            {!course.published && (
              <span className="text-sm text-amethyst bg-thistle px-3 py-1.5 rounded-[0.8rem] font-semibold">
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