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
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-3">About This Course</h2>
        <p className="text-base text-gray-700 leading-relaxed">
          {course.description}
        </p>
      </div>


      {/* Course Stats */}
      <div className="bg-gray-50 rounded-headspace-xl p-4">
        <h4 className="text-base font-semibold text-gray-900 mb-3">Quick Facts</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Clean Mini-Learnings</span>
            <span className="text-emerald-600">✓</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Mobile friendly</span>
            <span className="text-emerald-600">✓</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">AI practice available</span>
            <span className="text-emerald-600">
              ✓
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Learn at your pace</span>
            <span className="text-emerald-600">✓</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetailsSection;