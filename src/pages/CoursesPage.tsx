import React, { useState } from 'react';
import { Search, Filter, Lock, Crown } from 'lucide-react';
import Layout from '../components/Layout';
import CourseCard from '../components/CourseCard';
import CourseDetailModal from '../components/CourseDetailModal';
import { categories } from '../data/mockCourses';
import { Course, getAccessLevelRequirement } from '../types';
import { useCourses } from '../hooks/useCourses';
import { useAuth } from '../contexts/AuthContext';

const CoursesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [restrictedCourse, setRestrictedCourse] = useState<Course | null>(null);
  const { currentUser } = useAuth();

  // Pass user role to filter courses based on access level
  const { courses, loading, error } = useCourses(
    selectedCategory,
    false, // Not filtering for premium only
    currentUser?.role || null
  );

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'All' || course.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesDifficulty;
  });

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setShowCourseModal(true);
  };

  const handleCloseCourseModal = () => {
    setShowCourseModal(false);
    setSelectedCourse(null);
  };

  const handleCloseAccessModal = () => {
    setShowAccessModal(false);
    setRestrictedCourse(null);
  };

  // Get user access level display
  const getUserAccessInfo = () => {
    if (!currentUser) {
      return {
        level: 'Anonymous',
        description: 'Sign up for free to access more courses',
        color: 'text-neutral-gray'
      };
    }
    
    switch (currentUser.role) {
      case 'free':
        return {
          level: 'Free Account',
          description: 'Upgrade to BrevEdu+ for premium courses',
          color: 'text-accent-yellow'
        };
      case 'premium':
        return {
          level: 'BrevEdu+ Member',
          description: 'You have access to all courses',
          color: 'text-accent-purple'
        };
      default:
        return {
          level: 'Anonymous',
          description: 'Sign up for free to access more courses',
          color: 'text-neutral-gray'
        };
    }
  };

  const userAccessInfo = getUserAccessInfo();

  return (
    <Layout currentPage="courses">
      {/* Header */}
      <section className="px-6 py-8 border-b border-neutral-gray/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-h1 text-text-light mb-2">All Courses</h1>
              <p className="text-body text-text-secondary">
                Explore our complete library of bite-sized video lessons
              </p>
            </div>
            
            {/* User Access Level Info */}
            <div className="mt-4 lg:mt-0">
              <div className="bg-neutral-gray/10 rounded-lg p-4 text-center lg:text-right">
                <div className={`text-body font-medium ${userAccessInfo.color}`}>
                  {userAccessInfo.level}
                </div>
                <div className="text-small text-text-secondary">
                  {userAccessInfo.description}
                </div>
                {currentUser?.role === 'free' && (
                  <a
                    href="/brevedu-plus"
                    className="inline-flex items-center space-x-1 text-accent-purple hover:text-accent-deep-purple transition-colors text-small mt-2"
                  >
                    <Crown className="h-4 w-4" />
                    <span>Upgrade Now</span>
                  </a>
                )}
                {!currentUser && (
                  <button className="inline-block text-accent-yellow hover:text-accent-green transition-colors text-small mt-2">
                    Sign Up Free
                  </button>
                )}
              </div>
            </div>
          </div>

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
                  {courses.length === 0 ? (
                    <div>
                      {!currentUser ? (
                        <>
                          <Lock className="h-12 w-12 text-neutral-gray mx-auto mb-4" />
                          <p className="text-body text-text-secondary mb-4">
                            Sign up for free to access our course library!
                          </p>
                          <button className="bg-accent-yellow text-text-dark px-6 py-3 rounded-lg text-body font-medium hover:bg-accent-green transition-all shadow-button">
                            Create Free Account
                          </button>
                        </>
                      ) : currentUser.role === 'free' ? (
                        <>
                          <Crown className="h-12 w-12 text-accent-purple mx-auto mb-4" />
                          <p className="text-body text-text-secondary mb-4">
                            No courses available for your current access level in this category.
                          </p>
                          <div className="space-y-3">
                            <button
                              onClick={() => setSelectedCategory('All')}
                              className="block mx-auto text-accent-yellow hover:text-accent-green transition-colors underline"
                            >
                              View all available courses
                            </button>
                            <a
                              href="/brevedu-plus"
                              className="block bg-accent-purple text-text-dark px-6 py-3 rounded-lg text-body font-medium hover:bg-accent-deep-purple transition-all shadow-button"
                            >
                              Upgrade for Premium Courses
                            </a>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="text-body text-text-secondary mb-4">
                            No courses found for this category.
                          </p>
                          <button
                            onClick={() => setSelectedCategory('All')}
                            className="text-accent-yellow hover:text-accent-green transition-colors underline"
                          >
                            View all courses
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="text-body text-text-secondary mb-4">
                        No courses found matching your search criteria.
                      </p>
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
                  )}
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-body text-text-secondary">
                      Showing {filteredCourses.length} of {courses.length} courses available to you
                    </p>
                    {currentUser?.role !== 'premium' && (
                      <a
                        href="/brevedu-plus"
                        className="text-accent-purple hover:text-accent-deep-purple transition-colors text-small flex items-center space-x-1"
                      >
                        <Crown className="h-4 w-4" />
                        <span>Unlock All Courses</span>
                      </a>
                    )}
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

      {/* Course Detail Modal */}
      <CourseDetailModal
        isOpen={showCourseModal}
        course={selectedCourse}
        onClose={handleCloseCourseModal}
      />

      {/* Access Restricted Modal */}
      {showAccessModal && restrictedCourse && (
        <div className="fixed inset-0 bg-primary/80 backdrop-blur-ios flex items-center justify-center z-50 p-4">
          <div className="bg-primary border border-neutral-gray/30 rounded-2xl w-full max-w-md p-6">
            <div className="text-center">
              <Lock className="h-12 w-12 text-accent-purple mx-auto mb-4" />
              <h3 className="text-h3 text-text-light mb-2">Access Restricted</h3>
              <p className="text-body text-text-secondary mb-4">
                This course requires: {getAccessLevelRequirement(restrictedCourse.accessLevel)}
              </p>
              
              <div className="space-y-3">
                {!currentUser ? (
                  <button className="w-full bg-accent-yellow text-text-dark px-6 py-3 rounded-lg text-body font-medium hover:bg-accent-green transition-all shadow-button">
                    Sign Up Free
                  </button>
                ) : currentUser.role === 'free' && restrictedCourse.accessLevel === 'premium' ? (
                  <a
                    href="/brevedu-plus"
                    className="block w-full bg-accent-purple text-text-dark px-6 py-3 rounded-lg text-body font-medium hover:bg-accent-deep-purple transition-all shadow-button"
                  >
                    Upgrade to BrevEdu+
                  </a>
                ) : null}
                
                <button
                  onClick={handleCloseAccessModal}
                  className="w-full border border-neutral-gray/30 text-text-light px-6 py-3 rounded-lg text-body font-medium hover:bg-neutral-gray/20 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CoursesPage;