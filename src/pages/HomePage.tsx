import React, { useState } from 'react';
import { Sparkles, ArrowRight, Star, Quote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
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
    currentUser?.role || null
  );

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
    <Layout currentPage="home">
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
      <section className="px-padding-medium pb-12 bg-white">
        <div className="max-w-screen-2xl mx-auto">
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
        </div>
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