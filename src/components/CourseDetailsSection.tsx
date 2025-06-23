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

      {/* Quick Facts - Desktop: normal order, Mobile: moved to bottom */}
      <div className="bg-gray-50 border border-gray-200 rounded-headspace-xl p-4 order-last lg:order-none">
        <h4 className="text-base font-semibold text-gray-900 mb-3">Quick Facts</h4>
        <div className="space-y-2 text-sm divide-y divide-gray-100">
          <div className="flex items-center justify-between pb-2">
            <span className="text-gray-600">Clean Mini-Learnings</span>
            <CheckCircle className="h-4 w-4 text-emerald-600 stroke-2" />
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-600">Mobile friendly</span>
            <CheckCircle className="h-4 w-4 text-emerald-600 stroke-2" />
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-600">AI practice available</span>
            <div className="flex items-center">
              {course.conversationalContext || course.tavusConversationUrl ? (
                <CheckCircle className={`h-4 w-4 stroke-2 ${
                  tavusCompleted ? 'text-emerald-600' : 'text-blue-600'
                }`} />
              ) : (
                <CheckCircle className="h-4 w-4 text-emerald-600 stroke-2" />
              )}
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-gray-600">Learn at your pace</span>
            <CheckCircle className="h-4 w-4 text-emerald-600 stroke-2" />
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetailsSection;