import React from 'react';
import { ArrowRight } from 'lucide-react';
import CourseCard from './CourseCard';
import { AccentButton, SecondaryButton, PillToggleButton } from './UIButtons';
import { categories } from '../data/mockCourses';
import { Course, User } from '../types';

interface FeaturedCoursesSectionProps {
  courses: Course[];
  loading: boolean;
  error: string | null;
  currentUser: User | null;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  onCourseClick: (course: Course) => void;
  onExploreCourses: () => void;
  onAuthPrompt?: () => void; // New prop for auth prompt
  showCategoryFilter?: boolean; // New prop to control filter visibility
}

const FeaturedCoursesSection: React.FC<FeaturedCoursesSectionProps> = ({
  courses,
  loading,
  error,
  currentUser,
  selectedCategory,
  setSelectedCategory,
  onCourseClick,
  onExploreCourses,
  onAuthPrompt,
  showCategoryFilter = true // Default to true to maintain existing behavior
}) => {
  // Show only first 3 courses for featured section
  const featuredCourses = courses.slice(0, 3);

  // Handle course card click with access control
  const handleCourseCardClick = (course: Course) => {
    if (!currentUser && onAuthPrompt) {
      // Anonymous user clicking on course card - show auth prompt
      onAuthPrompt();
      return;
    }
    // Authenticated user - proceed with normal course click
    onCourseClick(course);
  };

  // Handle "More Courses" button with access control
  const handleMoreCoursesClick = () => {
    if (!currentUser && onAuthPrompt) {
      // Anonymous user clicking "More Courses" - show auth prompt
      onAuthPrompt();
      return;
    }
    // Authenticated user - proceed to courses page
    onExploreCourses();
  };

  return (
    <section className="px-padding-medium pb-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Featured Courses
            </h2>
            {!currentUser && (
              <p className="text-base text-gray-600">
                Sign up for free to access more courses and AI practice sessions
              </p>
            )}
            {currentUser?.role === 'free' && activeTab === 'all' && (
            {currentUser?.role === 'free' && (
              <p className="text-base text-gray-600">
                Upgrade to BrevEdu+ to unlock premium courses and more AI practice sessions
              </p>
            )}
          </div>
          
          {/* Category Filter - Only show when showCategoryFilter is true */}
          {showCategoryFilter && (
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <PillToggleButton
                  key={category}
                  label={category}
                  active={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF7A59]"></div>
            <p className="text-lg text-gray-700 mt-4">Loading courses...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-lg text-red-600 mb-4">{error}</p>
            <AccentButton onClick={() => window.location.reload()}>
              Try again
            </AccentButton>
          </div>
        )}

        {/* Course Grid */}
        {!loading && !error && (
          <>
            {featuredCourses.length === 0 ? (
              <div className="text-center py-12">
                {!currentUser ? (
                  <div>
                    <p className="text-lg text-gray-700 mb-4">
                      Sign up for free to access our course library!
                    </p>
                    <AccentButton 
                      onClick={onAuthPrompt || onExploreCourses}
                      aria-label="Sign up for free account"
                    >
                      Create Free Account
                    </AccentButton>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg text-gray-700 mb-4">
                      No courses found for this category.
                    </p>
                    {showCategoryFilter && (
                      <PillToggleButton
                        label="View all courses"
                        active={false}
                        onClick={() => setSelectedCategory('All')}
                      />
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {featuredCourses.map((course) => (
                  <CourseCard 
                    key={course.id} 
                    course={course} 
                    onClick={handleCourseCardClick}
                  />
                ))}
              </div>
            )}

            {/* More Courses Button */}
            {featuredCourses.length > 0 && (
              <div className="text-center">
                <SecondaryButton 
                  className="inline-flex items-center space-x-2 bg-gray-100 text-gray-800 hover:bg-gray-200"
                  onClick={handleMoreCoursesClick}
                  aria-label="View all courses"
                >
                  <span>More Courses</span>
                  <ArrowRight className="h-5 w-5" />
                </SecondaryButton>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedCoursesSection;