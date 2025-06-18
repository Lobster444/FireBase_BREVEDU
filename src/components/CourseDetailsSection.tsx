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

      {/* Course Details */}
      <div className="bg-gray-50 rounded-[12px] p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Course Details</h3>
        <div className="grid grid-cols-2 gap-4 text-base">
          <div>
            <span className="text-gray-600">Duration:</span>
            <span className="text-gray-900 ml-2 font-medium">{course.duration}</span>
          </div>
          <div>
            <span className="text-gray-600">Level:</span>
            <span className="text-gray-900 ml-2 font-medium">{course.difficulty}</span>
          </div>
          <div>
            <span className="text-gray-600">Category:</span>
            <span className="text-gray-900 ml-2 font-medium">{course.category}</span>
          </div>
          <div>
            <span className="text-gray-600">Format:</span>
            <span className="text-gray-900 ml-2 font-medium">Video Lesson</span>
          </div>
        </div>
      </div>

      {/* Course Stats */}
      <div className="bg-gray-50 rounded-[12px] p-4">
        <h4 className="text-base font-semibold text-gray-900 mb-3">Quick Facts</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Bite-sized learning</span>
            <span className="text-emerald-600">✓</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Mobile friendly</span>
            <span className="text-emerald-600">✓</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">AI practice available</span>
            <span className={course.tavusConversationUrl ? "text-emerald-600" : "text-gray-400"}>
              {course.tavusConversationUrl ? "✓" : "—"}
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