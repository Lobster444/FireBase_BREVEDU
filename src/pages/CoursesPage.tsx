import React, { useState, useEffect } from 'react';
import { Funnel, Lock, Crown } from '@phosphor-icons/react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import Layout from '../components/Layout';
import CourseCard from '../components/CourseCard';
import CourseDetailModal from '../components/CourseDetailModal';
import AuthModal from '../components/AuthModal';
import { AccentButton, PrimaryButton, PillToggleButton, LinkButton } from '../components/UIButtons';
import { categories } from '../data/mockCourses';
import { Course, getAccessLevelRequirement } from '../types';
import { useCourses } from '../hooks/useCourses';
import { useAuth } from '../contexts/AuthContext';

const CoursesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [restrictedCourse, setRestrictedCourse] = useState<Course | null>(null);
  const { currentUser, firebaseUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user needs email verification
  useEffect(() => {
    if (!currentUser) {
      // Anonymous user trying to access courses page - redirect to home and show auth modal
      navigate('/', { replace: true });
    }
  }, [currentUser, navigate]);

  // Pass user role to filter courses based on access level
  const { courses, loading, error } = useCourses(
    selectedCategory,
    false, // Not filtering for premium only
    currentUser?.role || null,
    true // Include restricted courses so free users can see premium courses
  );

  // Handle smooth category transitions
  const handleCategoryChange = (category: string) => {
    if (category === selectedCategory) return;
    
    setIsTransitioning(true);
    setSelectedCategory(category);
    
    // Reset transition state after a brief delay
    setTimeout(() => {
      setIsTransitioning(false);
    }, 150);
  };

  const handleCourseClick = (course: Course) => {
    // Check if free user is trying to access premium course
    if (course.accessLevel === 'premium' && currentUser?.role === 'free') {
      setRestrictedCourse(course);
      setShowAccessModal(true);
      return;
    }
    
    // Normal course access
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

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  const handleAuthPrompt = (mode: 'login' | 'register' = 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const clearAllFilters = () => {
    handleCategoryChange('All');
    // Use navigation state to prevent scroll to top when changing filters
    navigate(location.pathname, { 
      state: { disableScroll: true },
      replace: true 
    });
  };

  // Get user access level display
  const getUserAccessInfo = () => {
    if (!currentUser) {
      return {
        level: 'Anonymous',
        description: 'Sign up for free to access more courses',
        color: 'text-gray-600'
      };
    }
    
    switch (currentUser.role) {
      case 'free':
        return {
          level: 'Free Account',
          description: 'Upgrade to BrevEdu+ for premium courses',
          color: 'text-subscription-free'
        };
      case 'premium':
        return {
          level: 'BrevEdu+ Member',
          description: 'You have access to all courses',
          color: 'text-subscription-premium'
        };
      default:
        return {
          level: 'Anonymous',
          description: 'Sign up for free to access more courses',
          color: 'text-gray-600'
        };
    }
  };

  const userAccessInfo = getUserAccessInfo();

  // Don't render the page content for anonymous users (they'll be redirected)
  if (!currentUser) {
    return (
      <PageTransition type="fade">
        <Layout currentPage="courses">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#002fa7]"></div>
            <p className="text-lg text-gray-700 mt-4">Redirecting...</p>
          </div>
        </Layout>
      </PageTransition>
    );
  }

  return (
    <PageTransition type="fade">
      <Layout currentPage="courses">
        {/* Header */}
        <section className="px-padding-medium py-4 sm:py-6 border-b border-black/5 bg-white">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-3">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-black mb-1 sm:mb-2">All Courses</h1>
                <p className="text-base sm:text-lg text-gray-700">
                  Explore our complete library of bite-sized video lessons
                </p>
              </div>
              
              {/* User Access Level Info - Hide upgrade prompts for premium users */}
              {currentUser?.role !== 'premium' && (
                <div className="mt-2 lg:mt-0">
                  <div className="bg-grey rounded-[1.2rem] p-3 text-center lg:text-right border border-black/5">
                    <div className={`text-base sm:text-lg font-semibold ${userAccessInfo.color}`}>
                      {userAccessInfo.level}
                    </div>
                    <div className="text-sm sm:text-base text-gray-600">
                      {userAccessInfo.description}
                    </div>
                    {currentUser?.role === 'free' && (
                      <a
                        href="/brevedu-plus"
                        className="inline-flex items-center space-x-1 text-cobalt hover:text-[#4a4fd9] transition-colors text-sm sm:text-base mt-1 font-medium"
                      >
                        <Crown className="h-4 w-4" />
                        <span>Upgrade Now</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-col items-center gap-3 mt-4">
              {/* Category Filter */}
              <div className="w-full overflow-x-auto scrollbar-hide">
                <div className="flex gap-2 pb-1 min-w-max px-4 sm:px-0">
                {categories.map((category) => (
                  <PillToggleButton
                    key={category}
                    label={category}
                    active={selectedCategory === category}
                    onClick={() => handleCategoryChange(category)}
                    className="flex-shrink-0"
                  />
                ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Grid */}
        <section className="px-padding-medium py-2 sm:py-3 bg-white">
          <div className="max-w-screen-2xl mx-auto">
            {/* Loading State - Show during initial load or transitions */}
            {(loading || isTransitioning) && (
              <div className="text-center py-8 sm:py-12 bg-grey rounded-[1.2rem] p-4 sm:p-6">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cobalt"></div>
                <p className="text-base sm:text-lg text-gray-700 mt-3 sm:mt-4">
                  {isTransitioning ? 'Switching topics...' : 'Loading courses...'}
                </p>
              </div>
            )}

            {/* Error State */}
            {error && !isTransitioning && (
              <div className="text-center py-8 sm:py-12 bg-light-red rounded-[1.2rem] p-4 sm:p-6">
                <p className="text-base sm:text-lg text-red mb-3 sm:mb-4">{error}</p>
                <AccentButton onClick={() => window.location.reload()}>
                  Try again
                </AccentButton>
              </div>
            )}

            {/* Results */}
            {!loading && !error && !isTransitioning && (
              <>
                {courses.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    {courses.length === 0 ? (
                      <div>
                        {currentUser.role === 'free' ? (
                          <>
                            <Crown className="h-12 w-12 text-[#002fa7] mx-auto mb-4" />
                            <p className="text-base sm:text-lg text-gray-700 mb-3 sm:mb-4">
                              No courses available for your current access level in this category.
                            </p>
                            <div className="space-y-3">
                              <PillToggleButton
                                label="View all available courses"
                                active={false}
                                onClick={() => setSelectedCategory('All')}
                              />
                              <div>
                                <a href="/brevedu-plus">
                                  <PrimaryButton>
                                    Upgrade for Premium Courses
                                  </PrimaryButton>
                                </a>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="text-base sm:text-lg text-gray-700 mb-3 sm:mb-4">
                              No courses found for this category.
                            </p>
                            <PillToggleButton
                              label="View all courses"
                              active={false}
                              onClick={() => handleCategoryChange('All')}
                            />
                          </>
                        )}
                      </div>
                    ) : (
                      <div>
                        <p className="text-base sm:text-lg text-gray-700 mb-3 sm:mb-4">
                          No courses found matching your filter criteria.
                        </p>
                        <PillToggleButton
                          label="Clear all filters"
                          active={false}
                          onClick={clearAllFilters}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <p className="text-base sm:text-lg text-gray-700">
                        Showing {courses.length} courses
                        {currentUser?.role === 'premium' ? ' (full access)' : ' available to you'}
                      </p>
                      {/* Hide "Unlock All Courses" link for premium users */}
                      {currentUser?.role !== 'premium' && (
                        <a
                          href="/brevedu-plus"
                          className="text-cobalt hover:text-[#4a4fd9] transition-colors text-sm sm:text-base flex items-center space-x-1 font-medium"
                        >
                          <Crown className="h-4 w-4" />
                          <span>Unlock All Courses</span>
                        </a>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 transition-opacity duration-200 ease-in-out">
                      {courses.map((course) => (
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white border border-black/5 rounded-[1.6rem] w-full max-w-md p-6 shadow-xl">
              <div className="text-center">
                <Lock className="h-12 w-12 text-cobalt mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-black mb-2">Access Restricted</h3>
                <p className="text-lg text-gray-700 mb-4">
                  This course requires: {getAccessLevelRequirement(restrictedCourse.accessLevel)}
                </p>
                
                <div className="space-y-3">
                  {currentUser.role === 'free' && restrictedCourse.accessLevel === 'premium' ? (
                    <a href="/brevedu-plus" className="block">
                      <PrimaryButton className="w-full shadow-lg">
                        Upgrade to BrevEdu+
                      </PrimaryButton>
                    </a>
                  ) : null}
                  
                  <button
                    onClick={handleCloseAccessModal}
                    className="w-full border border-black/10 text-gray-700 px-6 py-3 rounded-[1.2rem] text-lg font-medium hover:bg-grey transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Auth Modal */}
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={handleCloseAuthModal}
          initialMode={authMode}
        />
      </Layout>
    </PageTransition>
  );
};

export default CoursesPage;