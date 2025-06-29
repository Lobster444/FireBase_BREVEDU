import React from 'react';
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Course } from '../../../types';
import { getAccessLevelInfo, getAIPracticeStatus, formatDate } from '../utils/courseHelpers';

interface CourseTableProps {
  courses: Course[];
  isOnline: boolean;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
}

const CourseTable: React.FC<CourseTableProps> = ({
  courses,
  isOnline,
  onEditCourse,
  onDeleteCourse
}) => {
  return (
    <div className="hidden lg:block bg-white rounded-[1.2rem] overflow-hidden border border-gray-200">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
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
          {courses.map((course) => {
            const accessInfo = getAccessLevelInfo(course.accessLevel);
            const aiPracticeInfo = getAIPracticeStatus(course);
            return (
              <tr key={course.id} className="border-t border-gray-200 hover:bg-gray-50">
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
                      className={`icon-button p-2 rounded-[1.2rem] transition-colors ${
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
                      className={`icon-button p-2 rounded-[1.2rem] transition-colors ${
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
    </div>
  );
};

export default CourseTable;