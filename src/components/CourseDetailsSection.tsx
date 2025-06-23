import React from 'react';
import QuickFacts from './QuickFacts';
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

      {/* Quick Facts - Desktop only */}
      <QuickFacts 
        course={course} 
        tavusCompleted={tavusCompleted} 
        className="hidden lg:block" 
      />
    </>
  );
};

export default CourseDetailsSection;