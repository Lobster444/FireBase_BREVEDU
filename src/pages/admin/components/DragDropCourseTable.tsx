import React, { useState } from 'react';
import { Edit, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react';
import { Course } from '../../../types';
import { getAccessLevelInfo, getAIPracticeStatus, formatDate } from '../utils/courseHelpers';

interface DragDropCourseTableProps {
  courses: Course[];
  isOnline: boolean;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
  onReorderCourses: (reorderedCourses: Course[]) => void;
}

const DragDropCourseTable: React.FC<DragDropCourseTableProps> = ({
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

  return (
    <div className="hidden lg:block bg-white rounded-headspace-lg overflow-hidden border border-gray-200">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-4 text-sm font-medium text-gray-900 w-12">Order</th>
            <th className="text-left p-4 text-sm font-medium text-gray-900">Course</th>
            <th className="text-left p-4 text-sm font-medium text-gray-900">Category</th>
            <th className="text-left p-4 text-sm font-medium text-gray-900">Access Level</th>
            <th className="text-left p-4 text-sm font-medium text-gray-900">AI Practice</th>
            <th className="text-left p-4 text-sm font-medium text-gray-900">Status</th>
            <th className="text-left p-4 text-sm font-medium text-gray-900">Created</th>
            <th className="text-right p-4 text-sm font-medium text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course, index) => {
            const accessInfo = getAccessLevelInfo(course.accessLevel);
            const aiPracticeInfo = getAIPracticeStatus(course);
            const isDragging = draggedIndex === index;
            const isDragOver = dragOverIndex === index;
            
            return (
              <tr 
                key={course.id} 
                className={`border-t border-gray-200 transition-all duration-200 ${
                  isDragging ? 'opacity-50 bg-blue-50' : 
                  isDragOver ? 'bg-blue-100 border-blue-300' : 
                  'hover:bg-gray-50'
                }`}
                draggable={isOnline}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
              >
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <GripVertical 
                      className={`h-4 w-4 ${
                        isOnline ? 'text-gray-400 cursor-grab' : 'text-gray-300'
                      }`} 
                    />
                    <span className="text-sm text-gray-600 font-mono">
                      {course.displayOrder || index + 1}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      loading="lazy"
                      className="w-16 h-10 object-cover rounded"
                    />
                    <div>
                      <div className="text-base font-medium text-gray-900 line-clamp-1">
                        {course.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {course.duration}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-gray-800 bg-gray-100 px-2 py-1 rounded">
                    {course.category}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`text-sm px-3 py-1 rounded-full font-medium w-fit ${
                    (course.accessLevel || 'free') === 'premium' 
                      ? 'bg-[#C967D3] text-white' 
                      : 'bg-[#6D9A52] text-white'
                  }`}>
                    <span>{(course.accessLevel || 'free') === 'premium' ? 'Premium' : 'Free'}</span>
                  </span>
                </td>
                <td className="p-4">
                  <span className={`text-sm px-2 py-1 rounded flex items-center space-x-1 w-fit ${aiPracticeInfo.color} ${aiPracticeInfo.bgColor}`}>
                    <span>{aiPracticeInfo.icon}</span>
                    <span>{aiPracticeInfo.label}</span>
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    {course.published ? (
                      <>
                        <Eye className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm text-emerald-600">Published</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-4 w-4 text-purple-600" />
                        <span className="text-sm text-purple-600">Draft</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-gray-600">
                    {formatDate(course.createdAt)}
                  </span>
                </td>
                <td className="p-4">
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {/* Drag Instructions */}
      {isOnline && courses.length > 1 && (
        <div className="bg-blue-50 border-t border-blue-200 p-3">
          <p className="text-sm text-blue-700 flex items-center space-x-2">
            <GripVertical className="h-4 w-4" />
            <span>Drag and drop rows to reorder courses. Changes are saved automatically.</span>
          </p>
        </div>
      )}
      
      {!isOnline && (
        <div className="bg-yellow-50 border-t border-yellow-200 p-3">
          <p className="text-sm text-yellow-700">
            Course reordering is disabled while offline. Please check your connection.
          </p>
        </div>
      )}
    </div>
  );
};

export default DragDropCourseTable;