import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import Layout from '../components/Layout';
import CourseCard from '../components/CourseCard';
import CourseDetailModal from '../components/CourseDetailModal';
import { PrimaryButton, AccentButton, OutlineButton, SecondaryButton } from '../components/UIButtons';
import { categories } from '../data/mockCourses';
import { Course } from '../types';
import { useCourses } from '../hooks/useCourses';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'premium'>('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const { currentUser } = useAuth();
  
  // Pass user role to filter courses based on access level
  const { courses, loading, error } = useCourses(
    selectedCategory, 
    activeTab === 'premium',
    currentUser?.role || null
  );

  // Show only first 3 courses for featured section
  const featuredCourses = courses.slice(0, 3);

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setShowCourseModal(true);
  };

  const handleCloseCourseModal = () => {
    setShowCourseModal(false);
    setSelectedCourse(null);
  };

  // Get user-specific messaging
  const getUserMessage = () => {
    if (!currentUser) {
      return {
        title: "Master New Skills in Just 5 Minutes",
        subtitle: "BrevEdu delivers focused learning through bite-sized video lessons with AI-powered chat practice. Learn faster, practice smarter, and build skills that matter.",
        ctaText: "Start Learning Free"
      };
    }
    
    if (currentUser.role === 'free') {
      return {
        title: `Welcome back, ${currentUser.name}!`,
        subtitle: "Continue your learning journey with new courses and AI practice sessions.",
        ctaText: "Continue Learning"
      };
    }
    
    if (currentUser.role === 'premium') {
      return {
        title: `Welcome back, ${currentUser.name}!`,
        subtitle: "Enjoy unlimited access to all premium courses and AI practice sessions.",
        ctaText: "Explore Premium Content"
      };
    }
    
    return {
      title: "Master New Skills in Just 5 Minutes",
      subtitle: "BrevEdu delivers focused learning through bite-sized video lessons with AI-powered chat practice.",
      ctaText: "Start Learning"
    };
  };

  const userMessage = getUserMessage();

  return (
    <Layout currentPage="home">
      {/* Hero Section */}
      <section className="px-6 py-12 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-h1 text-text-light mb-6">
            {userMessage.title.includes('Just 5 Minutes') ? (
              <>
                Master New Skills in
                <span className="block text-accent-yellow">Just 5 Minutes</span>
              </>
            ) : (
              userMessage.title
            )}
          </h1>
          <p className="text-body text-text-secondary mb-8 max-w-2xl mx-auto">
            {userMessage.subtitle}
          </p>
          
          {/* Course Type Toggle - Only show if user can access premium */}
          {currentUser?.role === 'premium' && (
            <div className="flex justify-center mb-8">
              <div className="bg-neutral-gray/20 rounded-lg p-1 flex">
                <OutlineButton
                  variant="yellow"
                  active={activeTab === 'all'}
                  onClick={() => setActiveTab('all')}
                  className="px-6 py-3 rounded-lg"
                >
                  All Courses
                </OutlineButton>
                <OutlineButton
                  variant="purple"
                  active={activeTab === 'premium'}
                  onClick={() => setActiveTab('premium')}
                  className="px-6 py-3 rounded-lg flex items-center space-x-2"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Premium Only</span>
                </OutlineButton>
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {!currentUser ? (
              <>
                <AccentButton className="px-8 py-4">
                  {userMessage.ctaText}
                </AccentButton>
                <PrimaryButton className="px-8 py-4 flex items-center justify-center space-x-2">
                  <Sparkles className="h-5 w-5" />
                  <span>Upgrade to Premium</span>
                </PrimaryButton>
              </>
            ) : currentUser.role === 'free' ? (
              <>
                <a href="/courses">
                  <AccentButton className="px-8 py-4">
                    {userMessage.ctaText}
                  </AccentButton>
                </a>
                <a href="/brevedu-plus">
                  <PrimaryButton className="px-8 py-4 flex items-center justify-center space-x-2">
                    <Sparkles className="h-5 w-5" />
                    <span>Upgrade to Premium</span>
                  </PrimaryButton>
                </a>
              </>
            ) : (
              <a href="/courses">
                <PrimaryButton className="px-8 py-4">
                  {userMessage.ctaText}
                </PrimaryButton>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h2 className="text-h2 text-text-light mb-2">
                {activeTab === 'premium' ? 'Premium Courses' : 'Featured Courses'}
              </h2>
              {!currentUser && (
                <p className="text-small text-text-secondary">
                  Sign up for free to access more courses and AI practice sessions
                </p>
              )}
              {currentUser?.role === 'free' && activeTab === 'all' && (
                <p className="text-small text-text-secondary">
                  Upgrade to BrevEdu+ to unlock premium courses and more AI practice sessions
                </p>
              )}
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <OutlineButton
                  key={category}
                  variant="yellow"
                  active={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </OutlineButton>
              ))}
            </div>
          </div>

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
                      <p className="text-body text-text-secondary mb-4">
                        Sign up for free to access our course library!
                      </p>
                      <AccentButton>
                        Create Free Account
                      </AccentButton>
                    </div>
                  ) : activeTab === 'premium' && currentUser.role !== 'premium' ? (
                    <div>
                      <p className="text-body text-text-secondary mb-4">
                        Upgrade to BrevEdu+ to access premium courses!
                      </p>
                      <a href="/brevedu-plus">
                        <PrimaryButton>
                          Upgrade Now
                        </PrimaryButton>
                      </a>
                    </div>
                  ) : (
                    <div>
                      <p className="text-body text-text-secondary mb-4">
                        No courses found for this category.
                      </p>
                      <OutlineButton
                        variant="yellow"
                        onClick={() => setSelectedCategory('All')}
                      >
                        View all courses
                      </OutlineButton>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {featuredCourses.map((course) => (
                    <CourseCard key={course.id} course={course} onClick={handleCourseClick} />
                  ))}
                </div>
              )}

              {/* More Courses Button */}
              {featuredCourses.length > 0 && (
                <div className="text-center">
                  <a href="/courses">
                    <SecondaryButton className="inline-flex items-center space-x-2">
                      <span>More Courses</span>
                      <ArrowRight className="h-5 w-5" />
                    </SecondaryButton>
                  </a>
                </div>
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
    </Layout>
  );
};

export default HomePage;