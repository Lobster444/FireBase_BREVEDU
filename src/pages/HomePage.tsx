import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import Layout from '../components/Layout';
import CourseCard from '../components/CourseCard';
import CourseDetailModal from '../components/CourseDetailModal';
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
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-6 py-3 rounded-lg text-body font-medium transition-all ${
                    activeTab === 'all'
                      ? 'bg-accent-yellow text-text-dark shadow-button'
                      : 'text-text-light hover:text-accent-yellow'
                  }`}
                >
                  All Courses
                </button>
                <button
                  onClick={() => setActiveTab('premium')}
                  className={`px-6 py-3 rounded-lg text-body font-medium transition-all flex items-center space-x-2 ${
                    activeTab === 'premium'
                      ? 'bg-accent-purple text-text-dark shadow-button'
                      : 'text-text-light hover:text-accent-purple'
                  }`}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Premium Only</span>
                </button>
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {!currentUser ? (
              <>
                <button className="bg-accent-yellow text-text-dark px-8 py-4 rounded-lg text-link font-medium hover:bg-accent-green transition-all shadow-button">
                  {userMessage.ctaText}
                </button>
                <button className="bg-accent-purple text-text-dark px-8 py-4 rounded-lg text-link font-medium hover:bg-accent-deep-purple transition-all shadow-button flex items-center justify-center space-x-2">
                  <Sparkles className="h-5 w-5" />
                  <span>Upgrade to Premium</span>
                </button>
              </>
            ) : currentUser.role === 'free' ? (
              <>
                <a
                  href="/courses"
                  className="bg-accent-yellow text-text-dark px-8 py-4 rounded-lg text-link font-medium hover:bg-accent-green transition-all shadow-button inline-block"
                >
                  {userMessage.ctaText}
                </a>
                <a
                  href="/brevedu-plus"
                  className="bg-accent-purple text-text-dark px-8 py-4 rounded-lg text-link font-medium hover:bg-accent-deep-purple transition-all shadow-button flex items-center justify-center space-x-2"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>Upgrade to Premium</span>
                </a>
              </>
            ) : (
              <a
                href="/courses"
                className="bg-accent-purple text-text-dark px-8 py-4 rounded-lg text-link font-medium hover:bg-accent-deep-purple transition-all shadow-button inline-block"
              >
                {userMessage.ctaText}
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
              <button 
                onClick={() => window.location.reload()}
                className="text-accent-yellow hover:text-accent-green transition-colors underline"
              >
                Try again
              </button>
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
                      <button className="bg-accent-yellow text-text-dark px-6 py-3 rounded-lg text-body font-medium hover:bg-accent-green transition-all shadow-button">
                        Create Free Account
                      </button>
                    </div>
                  ) : activeTab === 'premium' && currentUser.role !== 'premium' ? (
                    <div>
                      <p className="text-body text-text-secondary mb-4">
                        Upgrade to BrevEdu+ to access premium courses!
                      </p>
                      <a
                        href="/brevedu-plus"
                        className="bg-accent-purple text-text-dark px-6 py-3 rounded-lg text-body font-medium hover:bg-accent-deep-purple transition-all shadow-button inline-block"
                      >
                        Upgrade Now
                      </a>
                    </div>
                  ) : (
                    <div>
                      <p className="text-body text-text-secondary mb-4">
                        No courses found for this category.
                      </p>
                      <button
                        onClick={() => setSelectedCategory('All')}
                        className="text-accent-yellow hover:text-accent-green transition-colors underline"
                      >
                        View all courses
                      </button>
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
                  <a
                    href="/courses"
                    className="inline-flex items-center space-x-2 bg-neutral-gray/20 text-text-light px-6 py-3 rounded-lg text-link font-medium hover:bg-neutral-gray/30 transition-all"
                  >
                    <span>More Courses</span>
                    <ArrowRight className="h-5 w-5" />
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