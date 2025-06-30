import React, { useState } from 'react';
import { Sparkle, ArrowRight, Star, Quotes } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import Layout from '../components/Layout';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CourseCard from '../components/CourseCard';
import CourseDetailModal from '../components/CourseDetailModal';
import AuthModal from '../components/AuthModal';
import HeroSection from '../components/HeroSection';
import FeaturedCoursesSection from '../components/FeaturedCoursesSection';
import FeaturesBenefits from '../components/FeaturesBenefits';
import AIVideoTutor from '../components/AIVideoTutor';
import UpgradePromoSection from '../components/UpgradePromoSection';
import TestimonialsSection from '../components/TestimonialsSection';
import { PrimaryButton, AccentButton, SecondaryButton, PillToggleButton } from '../components/UIButtons';
import { Course } from '../types';
import { useCourses } from '../hooks/useCourses';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [badgeAnimated, setBadgeAnimated] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Pass user role to filter courses based on access level
  const { courses, loading, error } = useCourses(
    selectedCategory, 
    false, // Always show all courses, not just premium
    currentUser?.role || null,
    true // Include restricted courses so free users can see premium courses
  );

  const handleCourseClick = (course: Course) => {
    // Check if free user is trying to access premium course
    if (course.accessLevel === 'premium' && currentUser?.role === 'free') {
      // For homepage, redirect to upgrade page instead of showing modal
      navigate('/brevedu-plus');
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

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  // Handle auth prompt for anonymous users
  const handleAuthPrompt = () => {
    setAuthMode('register');
    setShowAuthModal(true);
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
    if (!currentUser) {
      // Anonymous user trying to explore courses - show auth prompt
      handleAuthPrompt();
      return;
    }
    // Authenticated user - navigate to courses
    navigate('/courses');
  };

  // Get user-specific messaging
  const getUserMessage = () => {
    if (!currentUser) {
      return {
        title: "Master New Skills in Just 5 Minutes",
        subtitle: "Discover fresh Skill Boosts with short AI-powered videos and chat feedback—learn faster, apply smarter, and master what matters",
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
        subtitle: "Discover fresh Skill Boosts anytime—unlimited content and AI tutor sessions",
        ctaText: "Explore Premium Content"
      };
    }
    
    return {
      title: "Master New Skills in Just 5 Minutes",
      subtitle: "Discover fresh Skill Boosts with short AI-powered videos and chat feedback—learn faster, apply smarter, and master what matters",
      ctaText: "Start Learning"
    };
  };

  const userMessage = getUserMessage();

  return (
    <PageTransition type="slide">
      <div className="min-h-screen bg-white">
        {/* Bolt.new Badge */}
        <div className="fixed bottom-4 right-4 z-[9999]">
          <a 
            href="https://bolt.new/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block transition-all duration-300 hover:shadow-2xl"
          >
            <img 
              src="https://storage.bolt.army/black_circle_360x360.png" 
              alt="Built with Bolt.new badge" 
              className={`w-20 h-20 md:w-28 md:h-28 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:rotate-[22deg] ${
                !badgeAnimated ? 'animate-[badgeIntro_0.8s_ease-out_1s_both]' : ''
              }`}
              onAnimationEnd={() => setBadgeAnimated(true)}
            />
          </a>
        </div>
        
        {/* Header - Full Width */}
        <Header currentPage="home" />
        
        {/* Hero Section */}
        <HeroSection
          currentUser={currentUser}
          userMessage={userMessage}
          onStartLearning={handleStartLearningFree}
          onUpgrade={handleUpgradeClick}
          onExploreCourses={handleExploreCourses}
        />

        {/* Features & Benefits Overview */}
        <FeaturesBenefits />

        {/* AI Video Tutor Demo */}
        <AIVideoTutor
          currentUser={currentUser}
          onStartPracticing={handleStartLearningFree}
        />

        {/* Featured Courses Section */}
        <FeaturedCoursesSection
          courses={courses}
          loading={loading}
          error={error}
          currentUser={currentUser}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onCourseClick={handleCourseClick}
          onExploreCourses={handleExploreCourses}
          onAuthPrompt={handleAuthPrompt}
          showCategoryFilter={false}
        />

        {/* Upgrade Promotional Section - Only for non-premium users */}
        {currentUser?.role !== 'premium' && (
          <UpgradePromoSection onUpgradeClick={handleUpgradeClick} />
        )}

        {/* Customer Testimonials Section */}
        <TestimonialsSection
          currentUser={currentUser}
        />

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
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default HomePage;