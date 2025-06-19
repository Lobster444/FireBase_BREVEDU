import React from 'react';

interface CourseStatsProps {
  stats: {
    total: number;
    published: number;
    drafts: number;
    premium: number;
    aiPractice: number;
  };
}

const CourseStats: React.FC<CourseStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-6">
      <div className="bg-white rounded-headspace-lg p-4 border border-gray-200">
        <div className="text-2xl font-bold text-[#FF7A59]">{stats.total}</div>
        <div className="text-sm text-gray-600">Total Courses</div>
      </div>
      <div className="bg-white rounded-headspace-lg p-4 border border-gray-200">
        <div className="text-2xl font-bold text-emerald-600">{stats.published}</div>
        <div className="text-sm text-gray-600">Published</div>
      </div>
      <div className="bg-white rounded-headspace-lg p-4 border border-gray-200">
        <div className="text-2xl font-bold text-purple-600">{stats.drafts}</div>
        <div className="text-sm text-gray-600">Drafts</div>
      </div>
      <div className="bg-white rounded-headspace-lg p-4 border border-gray-200">
        <div className="text-2xl font-bold text-gray-600">{stats.premium}</div>
        <div className="text-sm text-gray-600">Premium Only</div>
      </div>
      <div className="bg-white rounded-headspace-lg p-4 border border-gray-200">
        <div className="text-2xl font-bold text-blue-600">{stats.aiPractice}</div>
        <div className="text-sm text-gray-600">AI Practice</div>
      </div>
    </div>
  );
};

export default CourseStats;