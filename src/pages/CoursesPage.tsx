import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import Layout from '../components/Layout';
import CourseCard from '../components/CourseCard';
import { categories } from '../data/mockCourses';
import { Course } from '../types';
import { useCourses } from '../hooks/useCourses';
import { useAuth } from '../contexts/AuthContext';

const CoursesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const { currentUser } = useAuth();

  const { courses, loading, error } = useCourses(selectedCategory);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'All' || course.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesDifficulty;
  });

  const handleCourseClick = (course: Course) => {
    // TODO: Open Course Detail Modal
    console.log('Open course:', course.title);
  };

  return (
    <Layout currentPage="courses">
      {/* Header */}
      <section className="px-6 py-8 border-b border-neutral-gray/20">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-h1 text-text-light mb-2">All Courses</h1>
          <p className="text-body text-text-secondary mb-6">
            Explore our complete library of bite-sized video lessons
          </p>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-gray" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-neutral-gray/20 border border-neutral-gray/30 rounded-lg text-text-light placeholder-neutral-gray focus:outline-none focus:border-accent-yellow focus:ring-2 focus:ring-accent-yellow/20"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-small font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-accent-yellow text-text-dark'
                      : 'bg-neutral-gray/20 text-text-light hover:bg-neutral-gray/30'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-neutral-gray" />
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-neutral-gray/20 border border-neutral-gray/30 rounded-lg px-3 py-2 text-small text-text-light focus:outline-none focus:border-accent-yellow"
              >
                <option value="All">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <section className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-yellow"></div>
              <p className="text-body text-text-secondary mt-4">Loading courses...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-body text-red-400 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="text-accent-yellow hover:text-accent-green transition-colors underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Results */}
          {!loading && !error && (
            <>
              {filteredCourses.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-body text-text-secondary mb-4">No courses found matching your criteria.</p>
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setSearchQuery('');
                      setSelectedDifficulty('All');
                    }}
                    className="text-accent-yellow hover:text-accent-green transition-colors underline"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-body text-text-secondary">
                      Showing {filteredCourses.length} of {courses.length} courses
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCourses.map((course) => (
                      <CourseCard key={course.id} course={course} onClick={handleCourseClick} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default CoursesPage;