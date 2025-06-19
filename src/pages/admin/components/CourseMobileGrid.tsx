import React from 'react';
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Course } from '../../../types';
import { getAccessLevelInfo, getAIPracticeStatus } from '../utils/courseHelpers';

interface CourseMobileGridProps {
  courses: Course[];
  isOnline: boolean;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
}

const CourseMobileGrid: React.FC<CourseMobileGridProps> = ({
  courses,
  isOnline,
  onEditCourse,
  onDeleteCourse
}) => {
  return (
    <div className="lg:hidden space-y-4">
      {courses.map((course) => {
        const accessInfo = getAccessLevelInfo(course.accessLevel);
        const aiPracticeInfo = getAIPracticeStatus(course);
        return (
          <div key={course.id} className="bg-white rounded-headspace-lg p-4 border border-gray-200">
            <div className="flex items-start space-x-3 mb-3">
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                loading="lazy"
                className="w-20 h-12 object-cover rounded flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-medium text-gray-900 line-clamp-2 mb-1">
                  {course.title}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <span>{course.duration}</span>
                  <span>•</span>
                  <span>{course.category}</span>
                </div>
                <div className="flex items-center space-x-2 flex-wrap gap-1">
                  <span className={`text-xs px-2 py-1 rounded flex items-center space-x-1 ${accessInfo.color} ${accessInfo.bgColor}`}>
                    <span>{accessInfo.icon}</span>
                    <span>{accessInfo.label}</span>
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    (course.accessLevel || 'free') === 'premium' 
                      ? 'bg-[#C967D3] text-white' 
                      : 'bg-[#6D9A52] text-white'
                  }`}>
                    <span>{(course.accessLevel || 'free') === 'premium' ? 'Premium' : 'Free'}</span>
                  </span>
                  <span className={`text-xs px-2 py-1 rounded flex items-center space-x-1 ${aiPracticeInfo.color} ${aiPracticeInfo.bgColor}`}>
                    <span>{aiPracticeInfo.icon}</span>
                    <span>{aiPracticeInfo.label}</span>
                  </span>
                  {course.published ? (
                    <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>Published</span>
                    </span>
                  ) : (
                    <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded flex items-center space-x-1">
                      <EyeOff className="h-3 w-3" />
                      <span>Draft</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-2">
              <button 
                onClick={() => onEditCourse(course)}
                disabled={!isOnline}
                className={`icon-button p-2 rounded-headspace-lg transition-colors ${
                  isOnline 
                    ? 'icon-button-primary' 
                    : 'text-gray-400 cursor-not-allowed opacity-50'
                }`}
              >
                <Edit className="h-4 w-4" />
              </button>
              <button 
                onClick={() => onDeleteCourse(course.id!)}
                disabled={!isOnline}
                className={`icon-button p-2 rounded-headspace-lg transition-colors ${
                  isOnline 
                    ? 'text-red-500 hover:bg-red-50' 
                    : 'text-gray-400 cursor-not-allowed opacity-50'
                }`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CourseMobileGrid;