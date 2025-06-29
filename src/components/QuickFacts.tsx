import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Course } from '../types';

interface QuickFactsProps {
  course: Course;
  tavusCompleted: boolean;
  className?: string;
}

const QuickFacts: React.FC<QuickFactsProps> = ({
  course,
  tavusCompleted,
  className = ''
}) => {
  return (
    <div className={`bg-grey border border-black/5 rounded-[1.2rem] p-4 ${className}`}>
      <h4 className="text-base font-semibold text-black mb-3">Quick Facts</h4>
      <div className="space-y-2 text-sm divide-y divide-black/5">
        <div className="flex items-center justify-between pb-2">
          <span className="text-gray-700">Clean Mini-Learnings</span>
          <CheckCircle className="h-4 w-4 text-kelp stroke-2" />
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-gray-700">Mobile friendly</span>
          <CheckCircle className="h-4 w-4 text-kelp stroke-2" />
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-gray-700">AI practice available</span>
          <div className="flex items-center">
            {course.conversationalContext || course.tavusConversationUrl ? (
              <CheckCircle className={`h-4 w-4 stroke-2 ${
                tavusCompleted ? 'text-kelp' : 'text-cobalt'
              }`} />
            ) : (
              <CheckCircle className="h-4 w-4 text-kelp stroke-2" />
            )}
          </div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <span className="text-gray-700">Learn at your pace</span>
          <CheckCircle className="h-4 w-4 text-kelp stroke-2" />
        </div>
      </div>
    </div>
  );
};

export default QuickFacts;