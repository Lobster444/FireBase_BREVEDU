import React, { useState } from 'react';
import { Sparkles, ArrowRight, Star, Quote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import CourseCard from '../components/CourseCard';
import CourseDetailModal from '../components/CourseDetailModal';
import AuthModal from '../components/AuthModal';
import HeroSection from '../components/HeroSection';
import { PrimaryButton, AccentButton, SecondaryButton, PillToggleButton } from '../components/UIButtons';
import { categories } from '../data/mockCourses';
import { Course } from '../types';
import { useCourses } from '../hooks/useCourses';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'premium'>('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
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

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  // Navigation handlers
  const handleStartLearningFree = () => {
    if (!currentUser) {
      // Anonymous user - open signup modal
      setAuthMode('register');
      setShowAuthModal(true);
    } else if (currentUser.role === 'free') {
      // Free user - navigate to courses
      navigate('/courses');
    }
    // Premium users don't see this button
  };

  const handleUpgradeClick = () => {
    navigate('/brevedu-plus');
  };

  const handleExploreCourses = () => {
    navigate('/courses');
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

  // Hard-coded testimonials data
  const testimonials = [
    {
      id: 1,
      quote: "BrevEdu transformed how I learn! The 5-minute lessons fit perfectly into my busy schedule, and the AI practice sessions really help reinforce what I've learned.",
      name: "Sarah Chen",
      role: "Software Developer",
      rating: 5
    },
    {
      id: 2,
      quote: "I've tried many learning platforms, but BrevEdu's bite-sized approach is genius. I can learn during my commute and actually retain the information.",
      name: "Marcus Rodriguez",
      role: "Product Manager",
      rating: 5
    },
    {
      id: 3,
      quote: "The AI chat practice is incredible! It's like having a personal tutor available 24/7. I've learned more in 3 months than I did in a year elsewhere.",
      name: "Emily Johnson",
      role: "UX Designer",
      rating: 5
    },
    {
      id: 4,
      quote: "As a busy parent, finding time to learn new skills was impossible. BrevEdu's micro-learning approach changed everything for me.",
      name: "David Park",
      role: "Marketing Specialist",
      rating: 5
    }
  ];

  return (
    <Layout currentPage="home">
      {/* Hero Section */}
      <HeroSection
        currentUser={currentUser}
        userMessage={userMessage}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onStartLearning={handleStartLearningFree}
        onUpgrade={handleUpgradeClick}
        onExploreCourses={handleExploreCourses}
      />

      {/* Featured Courses Section */}
      <section className="px-6 pb-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {activeTab === 'premium' ? 'Premium Courses' : 'Featured Courses'}
              </h2>
              {!currentUser && (
                <p className="text-base text-gray-600">
                  Sign up for free to access more courses and AI practice sessions
                </p>
              )}
              {currentUser?.role === 'free' && activeTab === 'all' && (
                <p className="text-base text-gray-600">
                  Upgrade to BrevEdu+ to unlock premium courses and more AI practice sessions
                </p>
              )}
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
              {categories.map((category) => (
                <PillToggleButton
                  key={category}
                  label={category}
                  active={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                />
              ))}
            </div>
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
                        onClick={handleStartLearningFree}
                        aria-label="Sign up for free account"
                      >
                        Create Free Account
                      </AccentButton>
                    </div>
                  ) : activeTab === 'premium' && currentUser.role !== 'premium' ? (
                    <div>
                      <p className="text-lg text-gray-700 mb-4">
                        Upgrade to BrevEdu+ to access premium courses!
                      </p>
                      <PrimaryButton 
                        onClick={handleUpgradeClick}
                        aria-label="Upgrade to BrevEdu+ premium subscription"
                      >
                        Upgrade Now
                      </PrimaryButton>
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg text-gray-700 mb-4">
                        No courses found for this category.
                      </p>
                      <PillToggleButton
                        label="View all courses"
                        active={false}
                        onClick={() => setSelectedCategory('All')}
                      />
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
                  <SecondaryButton 
                    className="inline-flex items-center space-x-2 bg-gray-100 text-gray-800 hover:bg-gray-200"
                    onClick={handleExploreCourses}
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

      {/* Upgrade Promotional Section - Only for non-premium users */}
      {currentUser?.role !== 'premium' && (
        <section className="px-6 pb-12 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-r from-[#FF7A59]/10 to-[#F5C842]/10 rounded-[16px] p-8 text-center border border-[#FF7A59]/20">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-[#FF7A59] mr-3" />
                  <h2 className="text-3xl font-bold text-gray-900">Upgrade to BrevEdu+</h2>
                </div>
                
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Get full access to all courses, AI-powered practice sessions, and exclusive content. 
                  Accelerate your learning with premium features designed for serious learners.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                  <div className="flex items-center space-x-2 text-emerald-700">
                    <span className="text-base">✓</span>
                    <span className="text-base font-medium">Unlimited course access</span>
                  </div>
                  <div className="flex items-center space-x-2 text-emerald-700">
                    <span className="text-base">✓</span>
                    <span className="text-base font-medium">3 daily AI practice sessions</span>
                  </div>
                  <div className="flex items-center space-x-2 text-emerald-700">
                    <span className="text-base">✓</span>
                    <span className="text-base font-medium">Premium-only content</span>
                  </div>
                </div>
                
                <PrimaryButton 
                  onClick={handleUpgradeClick}
                  className="px-8 py-4 flex items-center justify-center space-x-2 mx-auto"
                  aria-label="Start BrevEdu+ premium subscription"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>Start BrevEdu+ Today</span>
                </PrimaryButton>
                
                <p className="text-sm text-gray-600 mt-4">
                  7-day free trial • Cancel anytime • $3.99/month
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Customer Testimonials Section */}
      <section className="px-6 py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Learners Say</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Join thousands of learners who are transforming their skills with BrevEdu's 
              bite-sized learning approach and AI-powered practice sessions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="bg-white rounded-[12px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] border border-gray-100 hover:border-[#FF7A59]/30 transition-all duration-200"
                role="article"
                aria-labelledby={`testimonial-${testimonial.id}-name`}
              >
                {/* Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <Quote className="h-6 w-6 text-[#FF7A59] opacity-60" aria-hidden="true" />
                  <div className="flex items-center space-x-1" role="img" aria-label={`${testimonial.rating} out of 5 stars`}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-[#F5C842] fill-current" aria-hidden="true" />
                    ))}
                  </div>
                </div>
                
                {/* Quote Text */}
                <blockquote className="text-base italic mb-4 text-gray-700 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                
                {/* Author Info */}
                <div className="border-t border-gray-100 pt-4">
                  <cite className="not-italic">
                    <p id={`testimonial-${testimonial.id}-name`} className="text-base font-semibold text-gray-900 mb-1">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-[#FF7A59] font-medium">
                      {testimonial.role}
                    </p>
                  </cite>
                </div>
              </div>
            ))}
          </div>
          
          {/* Call to Action */}
          <div className="text-center mt-12">
            <p className="text-lg text-gray-700 mb-6">
              Ready to join our community of successful learners?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!currentUser ? (
                <>
                  <AccentButton 
                    className="px-8 py-4"
                    onClick={handleStartLearningFree}
                    aria-label="Sign up for free account to start learning"
                  >
                    Start Learning Free
                  </AccentButton>
                  <PrimaryButton 
                    className="px-8 py-4 flex items-center justify-center space-x-2"
                    onClick={handleUpgradeClick}
                    aria-label="Try BrevEdu+ premium subscription with free trial"
                  >
                    <Sparkles className="h-5 w-5" />
                    <span>Try BrevEdu+ Free</span>
                  </PrimaryButton>
                </>
              ) : currentUser.role === 'free' ? (
                <PrimaryButton 
                  className="px-8 py-4 flex items-center justify-center space-x-2"
                  onClick={handleUpgradeClick}
                  aria-label="Upgrade to BrevEdu+ premium subscription"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>Upgrade to Premium</span>
                </PrimaryButton>
              ) : (
                <AccentButton 
                  className="px-8 py-4"
                  onClick={handleExploreCourses}
                  aria-label="Explore more premium courses"
                >
                  Explore More Courses
                </AccentButton>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Course Detail Modal */}
      <CourseDetailModal
        isOpen={showCourseModal}
        course={selectedCourse}
        onClose={handleCloseCourseModal}
      />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={handleCloseAuthModal}
        initialMode={authMode}
      />
    </Layout>
  );
};

export default HomePage;