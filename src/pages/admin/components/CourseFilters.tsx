import React from 'react';
import { Search, Filter, Shield } from 'lucide-react';

interface CourseFiltersProps {
  searchQuery: string;
  selectedCategory: string;
  selectedAccessLevel: string;
  showPublishedOnly: boolean;
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onAccessLevelChange: (level: string) => void;
  onPublishedOnlyChange: (published: boolean) => void;
}

const CourseFilters: React.FC<CourseFiltersProps> = ({
  searchQuery,
  selectedCategory,
  selectedAccessLevel,
  showPublishedOnly,
  onSearchChange,
  onCategoryChange,
  onAccessLevelChange,
  onPublishedOnlyChange
}) => {
  const categories = ['All', 'Society & Culture', 'Personal Development', 'Science & Technology'];

  return (
    <div className="bg-white rounded-[1.2rem] p-6 mb-6 border border-gray-200">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search courses by title or description..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-[1.2rem] text-gray-900 placeholder-gray-500 focus:outline-none focus:border-cobalt focus:ring-2 focus:ring-cobalt/20"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col gap-4">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2 rounded-[1.2rem] text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-cobalt text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Additional Filters */}
        <div className="flex flex-wrap items-center gap-4">

          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-gray-500" />
            <select
              value={selectedAccessLevel}
              onChange={(e) => onAccessLevelChange(e.target.value)}
              className="bg-white border border-gray-300 rounded-[1.2rem] px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-cobalt"
            >
              <option value="All">All Access Levels</option>
              <option value="anonymous">Anonymous</option>
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>
          </div>

          <label className="flex items-center space-x-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={showPublishedOnly}
              onChange={(e) => onPublishedOnlyChange(e.target.checked)}
              className="rounded border-gray-300 text-cobalt focus:ring-cobalt/20"
            />
            <span>Published only</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default CourseFilters;