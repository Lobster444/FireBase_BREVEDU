import React from 'react';
import { Sparkles, Check, Zap, MessageCircle, Star, Crown } from 'lucide-react';
import Layout from '../components/Layout';
import { PrimaryButton, AccentButton, OutlineButton } from '../components/UIButtons';
import { useAuth } from '../contexts/AuthContext';
import { trackSubscriptionEvent, trackInteraction } from '../lib/analytics';

const BrevEduPlusPage: React.FC = () => {
  const { currentUser } = useAuth();

  const features = [
    {
      icon: MessageCircle,
      title: 'AI Chat Practice',
      description: '3 daily AI-powered conversation sessions to practice what you learn'
    },
    {
      icon: Crown,
      title: 'Premium Content',
      description: 'Access to exclusive advanced courses and expert-level content'
    },
    {
      icon: Zap,
      title: 'Priority Support',
      description: 'Get help faster with priority customer support and feedback'
    },
    {
      icon: Star,
      title: 'Progress Tracking',
      description: 'Detailed analytics and progress reports to track your learning journey'
    }
  ];

  const benefits = [
    'Unlimited access to all premium courses',
    '3 AI chat practice sessions daily',
    'Priority customer support',
    'Advanced progress tracking',
    'Exclusive expert-level content',
    'Early access to new features',
    'Downloadable resources',
    'Certificate of completion'
  ];

  const handleUpgradeClick = () => {
    trackSubscriptionEvent('upgrade_click', 'premium');
    trackInteraction('upgrade_button', 'click', 'brevedu_plus_page');
    // Add your subscription logic here
  };

  return (
    <Layout currentPage="brevedu-plus">
      {/* Hero Section */}
      <section className="px-padding-medium py-12 sm:py-16 lg:py-20 text-center bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6 sm:mb-8">
            <Sparkles className="h-10 w-10 sm:h-12 sm:w-12 text-primary mr-3" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">BrevEdu+</h1>
          </div>
          
          <p className="text-xl sm:text-2xl lg:text-3xl font-semibold text-primary mb-4 sm:mb-6">
            Supercharge Your Learning
          </p>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
            Unlock premium features, AI-powered practice sessions, and exclusive content 
            to accelerate your skill development journey.
          </p>

          {/* Pricing - Hide for premium users */}
          {currentUser?.role !== 'premium' && (
            <div className="bg-gray-50 rounded-headspace-2xl p-6 sm:p-8 mb-8 sm:mb-12 max-w-md mx-auto border border-gray-200">
              <div className="text-center mb-6">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-2">$5.99</div>
                <div className="text-lg sm:text-xl text-gray-700">/month</div>
                <div className="text-base sm:text-lg text-gray-600 mt-2">Cancel anytime</div>
              </div>
              
              <PrimaryButton 
                className="w-full px-6 sm:px-8 py-4 sm:py-5 mb-4 text-lg sm:text-xl font-semibold"
                onClick={handleUpgradeClick}
              >
                Start Free Trial
              </PrimaryButton>
              
              <p className="text-sm sm:text-base text-gray-600 text-center">
                7-day free trial, then $5.99/month. Cancel anytime.
              </p>
            </div>
          )}

          {/* Thank you message for premium users */}
          {currentUser?.role === 'premium' && (
            <div className="bg-primary/10 rounded-headspace-2xl p-6 sm:p-8 mb-8 sm:mb-12 max-w-md mx-auto border border-primary/20 text-primary">
              <div className="text-center">
                <Crown className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-2">
                  You're already a BrevEdu+ member!
                </h3>
                <p className="text-lg sm:text-xl text-gray-700 mb-4 sm:mb-6">
                  Thank you for being a premium subscriber. Enjoy unlimited access to all features.
                </p>
                <a href="/courses">
                  <AccentButton 
                    className="px-6 sm:px-8 py-3 sm:py-4 text-lg sm:text-xl font-semibold"
                    onClick={() => trackInteraction('explore_premium_courses', 'click', 'brevedu_plus_page')}
                  >
                    Explore Premium Courses
                  </AccentButton>
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="px-padding-medium py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-screen-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-8 sm:mb-12 lg:mb-16">
            Premium Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-primary/20 w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-primary">
                    <Icon className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-padding-medium py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-8 sm:mb-12 lg:mb-16">
            Everything You Get
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3 sm:space-x-4">
                <Check className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 flex-shrink-0" />
                <span className="text-base sm:text-lg lg:text-xl text-gray-900 leading-relaxed">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Hide for premium users */}
      {currentUser?.role !== 'premium' && (
        <section className="px-padding-medium py-12 sm:py-16 lg:py-20 text-center bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              Ready to Level Up?
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 mb-8 sm:mb-12 leading-relaxed">
              Join thousands of learners who are accelerating their skills with BrevEdu+
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <PrimaryButton 
                className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 flex items-center justify-center space-x-2 text-lg sm:text-xl font-semibold"
                onClick={handleUpgradeClick}
              >
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
                <span>Start Free Trial</span>
              </PrimaryButton>
              <OutlineButton
                variant="purple"
                className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 text-lg sm:text-xl font-medium"
                onClick={() => {
                  trackInteraction('view_free_courses', 'click', 'brevedu_plus_page');
                  window.location.href = '/courses';
                }}
              >
                View Free Courses
              </OutlineButton>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default BrevEduPlusPage;