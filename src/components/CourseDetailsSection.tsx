import React from 'react';
import { Clock, MessageCircle, CheckCircle } from 'lucide-react';
import { Course } from '../types';

interface CourseDetailsSectionProps {
  course: Course;
  tavusCompleted: boolean;
}

const CourseDetailsSection: React.FC<CourseDetailsSectionProps> = ({
  course,
  tavusCompleted
}) => {
  return (
    <>
      {/* Course Description */}
      <div className="bg-white rounded-headspace-xl p-6 border border-gray-100 shadow-headspace-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-3">About This Course</h2>
        <p className="text-base text-gray-700 leading-relaxed border-l-4 border-primary/20 pl-4 bg-gray-50/50 py-3 rounded-r-lg">
          {course.description}
        </p>
      </div>


      {/* Course Stats */}
      <div className="bg-white rounded-headspace-xl p-6 border-2 border-gray-100 shadow-headspace-sm hover:border-primary/20 transition-colors duration-300">
        <h4 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Quick Facts</h4>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-transparent hover:border-gray-200">
            <span className="text-gray-600">Clean Mini-Learnings</span>
            <span className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">✓</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-transparent hover:border-gray-200">
            <span className="text-gray-600">Mobile friendly</span>
            <span className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">✓</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-transparent hover:border-gray-200">
            <span className="text-gray-600">AI practice available</span>
            <span className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
              ✓
            </span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-transparent hover:border-gray-200">
            <span className="text-gray-600">Learn at your pace</span>
            <span className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">✓</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetailsSection;