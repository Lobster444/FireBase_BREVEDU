import React from 'react';
import { ArrowRight, ChatCircle } from '@phosphor-icons/react';
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
    <section className="px-4 sm:px-8 md:px-12 py-8 sm:py-12 lg:py-16 bg-white border-t border-black/5">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col items-center text-center mb-6 sm:mb-10 lg:mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-cobalt rounded-[1.2rem] mb-8">
            <ChatCircle className="h-10 w-10 text-white" />
          </div>
          <div className="mb-4 sm:mb-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4 sm:mb-6">
              Featured Boost Courses
            </h2>
            {!currentUser && (
              <p className="text-xl sm:text-2xl lg:text-3xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Sign up for free to access more courses and AI practice sessions
              </p>
            )}
            {currentUser?.role === 'free' && (
              <p className="text-xl sm:text-2xl lg:text-3xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
                Upgrade to BrevEdu+ to unlock premium courses and more AI practice sessions
              </p>
            )}
          </div>
          
          {/* Category Filter - Only show when showCategoryFilter is true */}
          {showCategoryFilter && (
            <div className="w-full overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 sm:gap-3 pb-1 min-w-max px-4 sm:px-0">
              {categories.map((category) => (
                <PillToggleButton
                  key={category}
                  label={category}
                  active={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                  className="flex-shrink-0"
                />
              ))}
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8 sm:py-12 bg-grey rounded-[1.2rem] p-6">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-cobalt"></div>
            <p className="text-lg sm:text-xl text-gray-700 mt-4">Loading courses...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8 sm:py-12 bg-light-red rounded-[1.2rem] p-6">
            <p className="text-lg sm:text-xl text-red mb-4">{error}</p>
            <AccentButton onClick={() => window.location.reload()}>
              Try again
            </AccentButton>
          </div>
        )}

        {/* Course Grid */}
        {!loading && !error && (
          <>
            {featuredCourses.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                {!currentUser ? (
                  <div>
                    <p className="text-lg sm:text-xl text-gray-700 mb-4 sm:mb-6">
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
                    <p className="text-lg sm:text-xl text-gray-700 mb-4 sm:mb-6">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mb-6 sm:mb-8 lg:mb-10">
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
              <div className="text-center mt-6">
                <SecondaryButton 
                  className="inline-flex items-center space-x-3 bg-grey text-gray-800 hover:bg-[#e0e5e0] px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 text-lg sm:text-xl font-medium shadow-md hover:shadow-lg transition-all duration-300"
                  onClick={handleMoreCoursesClick}
                  aria-label="View all courses"
                >
                  <span>More Courses</span>
                  <ArrowRight className="h-6 w-6" />
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