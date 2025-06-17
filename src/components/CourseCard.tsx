import React from 'react';
import { Clock, Star } from 'lucide-react';
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

  return (
    <div 
      className="bg-neutral-gray/10 rounded-lg overflow-hidden shadow-card hover:shadow-lg transition-all cursor-pointer group focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:ring-offset-2 focus:ring-offset-primary"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${course.title}`}
    >
      {/* Thumbnail */}
      <div className="relative w-full h-[180px] bg-neutral-gray/20">
        <img 
          src={course.thumbnailUrl} 
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-primary/80 backdrop-blur-sm px-2 py-1 rounded text-x-small text-text-light flex items-center space-x-1">
          <Clock className="h-3 w-3" />
          <span>{course.duration}</span>
        </div>
        {/* Category badge */}
        <div className="absolute top-2 left-2 bg-accent-yellow text-text-dark px-2 py-1 rounded text-x-small font-medium">
          {course.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-body font-semibold text-text-light mb-2 line-clamp-2 group-hover:text-accent-yellow transition-colors">
          {course.title}
        </h3>
        <p className="text-small text-text-secondary mb-3 line-clamp-3">
          {course.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-x-small text-neutral-gray bg-neutral-gray/20 px-2 py-1 rounded">
            {course.difficulty}
          </span>
          {!course.published && (
            <span className="text-x-small text-accent-purple bg-accent-purple/20 px-2 py-1 rounded">
              Draft
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;