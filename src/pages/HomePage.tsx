import React, { useState } from 'react';
import { Sparkles, ArrowRight, Star, Quote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '../components/Layout';
import Header from '../components/Header';
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
    <div className="min-h-screen bg-gray-50">
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

      {/* Main Content Container */}
      <main className="relative">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Features & Benefits Overview */}
          <FeaturesBenefits />

          {/* AI Video Tutor Demo */}
          <AIVideoTutor
            currentUser={currentUser}
            onStartPracticing={handleStartLearningFree}
          />

          {/* Featured Courses Section */}
          <section className="pb-12">
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
          </section>

          {/* Upgrade Promotional Section - Only for non-premium users */}
          {currentUser?.role !== 'premium' && (
            <UpgradePromoSection onUpgradeClick={handleUpgradeClick} />
          )}

          {/* Customer Testimonials Section */}
          <TestimonialsSection
            currentUser={currentUser}
            onStartLearning={handleStartLearningFree}
            onUpgrade={handleUpgradeClick}
            onExploreCourses={handleExploreCourses}
          />
        </div>
      </main>

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
      
      {/* Toast Container */}
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="bg-primary border border-neutral-gray/30 text-text-light font-inter"
        progressClassName="bg-accent-yellow"
      />
    </div>
  );
};

export default HomePage;