import React, { useState } from 'react';
import { Edit, Trash2, Eye, EyeOff, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { Course } from '../../../types';
import { getAccessLevelInfo, getAIPracticeStatus } from '../utils/courseHelpers';

interface DragDropCourseMobileGridProps {
  courses: Course[];
  isOnline: boolean;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
  onReorderCourses: (reorderedCourses: Course[]) => void;
}

const DragDropCourseMobileGrid: React.FC<DragDropCourseMobileGridProps> = ({
  courses,
  isOnline,
  onEditCourse,
  onDeleteCourse,
  onReorderCourses
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', '');
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reorderedCourses = [...courses];
    const draggedCourse = reorderedCourses[draggedIndex];
    
    // Remove the dragged course from its original position
    reorderedCourses.splice(draggedIndex, 1);
    
    // Insert it at the new position
    reorderedCourses.splice(dropIndex, 0, draggedCourse);
    
    // Update display order for all affected courses
    const updatedCourses = reorderedCourses.map((course, index) => ({
      ...course,
      displayOrder: index + 1
    }));
    
    onReorderCourses(updatedCourses);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    
    const reorderedCourses = [...courses];
    const temp = reorderedCourses[index];
    reorderedCourses[index] = reorderedCourses[index - 1];
    reorderedCourses[index - 1] = temp;
    
    // Update display order
    const updatedCourses = reorderedCourses.map((course, idx) => ({
      ...course,
      displayOrder: idx + 1
    }));
    
    onReorderCourses(updatedCourses);
  };

  const moveDown = (index: number) => {
    if (index === courses.length - 1) return;
    
    const reorderedCourses = [...courses];
    const temp = reorderedCourses[index];
    reorderedCourses[index] = reorderedCourses[index + 1];
    reorderedCourses[index + 1] = temp;
    
    // Update display order
    const updatedCourses = reorderedCourses.map((course, idx) => ({
      ...course,
      displayOrder: idx + 1
    }));
    
    onReorderCourses(updatedCourses);
  };

  return (
    <div className="lg:hidden space-y-4">
      {courses.map((course, index) => {
        const accessInfo = getAccessLevelInfo(course.accessLevel);
        const aiPracticeInfo = getAIPracticeStatus(course);
        const isDragging = draggedIndex === index;
        const isDragOver = dragOverIndex === index;
        
        return (
          <div 
            key={course.id} 
            className={`bg-white rounded-headspace-lg p-4 border transition-all duration-200 ${
              isDragging ? 'opacity-50 border-blue-300 bg-blue-50' : 
              isDragOver ? 'border-blue-400 bg-blue-100' : 
              'border-gray-200'
            }`}
            draggable={isOnline}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
          >
            {/* Order Controls */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <GripVertical 
                  className={`h-4 w-4 ${
                    isOnline ? 'text-gray-400' : 'text-gray-300'
                  }`} 
                />
                <span className="text-sm text-gray-600 font-mono">
                  #{course.displayOrder || index + 1}
                </span>
              </div>
              
              {isOnline && (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className={`p-1 rounded ${
                      index === 0 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === courses.length - 1}
                    className={`p-1 rounded ${
                      index === courses.length - 1 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            
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
      
      {/* Instructions */}
      {isOnline && courses.length > 1 && (
        <div className="bg-blue-50 border border-blue-200 rounded-headspace-lg p-3">
          <p className="text-sm text-blue-700">
            Drag cards to reorder or use the up/down arrows. Changes are saved automatically.
          </p>
        </div>
      )}
      
      {!isOnline && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-headspace-lg p-3">
          <p className="text-sm text-yellow-700">
            Course reordering is disabled while offline. Please check your connection.
          </p>
        </div>
      )}
    </div>
  );
};

export default DragDropCourseMobileGrid;