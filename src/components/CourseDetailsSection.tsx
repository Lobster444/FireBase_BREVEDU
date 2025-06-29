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
      <div className="bg-white rounded-[1.2rem] p-6 border border-black/5 shadow-md">
        <h2 className="text-xl font-bold text-black mb-3">About This Course</h2>
        <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
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