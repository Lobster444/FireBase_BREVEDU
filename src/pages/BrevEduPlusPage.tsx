import React from 'react';
import { Sparkle, Check, Lightning, ChatCircle, Star, Crown } from '@phosphor-icons/react';
import PageTransition from '../components/PageTransition';
import Layout from '../components/Layout';
import { PrimaryButton, AccentButton, OutlineButton } from '../components/UIButtons';
import { useAuth } from '../contexts/AuthContext';
import { trackSubscriptionEvent, trackInteraction } from '../lib/analytics';
import ComingSoonModal from '../components/ComingSoonModal';

const BrevEduPlusPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [showComingSoonModal, setShowComingSoonModal] = React.useState(false);

  const features = [
    {
      icon: ChatCircle,
      title: 'AI Chat Practice',
      description: '3 daily AI-powered conversation sessions to practice what you learn'
    },
    {
      icon: Crown,
      title: 'Premium Content',
      description: 'Access to exclusive advanced courses and expert-level content'
    },
    {
      icon: Lightning,
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
    setShowComingSoonModal(true);
  };

  return (
    <PageTransition type="slide">
      <Layout currentPage="brevedu-plus">
        {/* Hero Section */}
        <section className="px-6 sm:px-10 py-16 sm:py-20 lg:py-28 text-center bg-white relative overflow-hidden">
          {/* Background grid pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
          
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-center mb-8 sm:mb-10">
              <Sparkle className="h-12 w-12 sm:h-14 sm:w-14 text-cobalt mr-4" />
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black">BrevEdu+</h1>
            </div>
            
            <p className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-cobalt mb-6 sm:mb-8">
              Supercharge Your Learning
            </p>
            <p className="text-xl sm:text-2xl lg:text-3xl text-gray-700 mb-10 sm:mb-14 max-w-3xl mx-auto leading-relaxed">
              Unlock premium features, AI-powered practice sessions, and exclusive content 
              to accelerate your skill development journey.
            </p>

            {/* Pricing - Hide for premium users */}
            {currentUser?.role !== 'premium' && (
              <div className="bg-grey rounded-[1.6rem] p-8 sm:p-10 mb-10 sm:mb-14 max-w-md mx-auto border border-black/5 shadow-lg">
                <div className="text-center mb-6">
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-cobalt mb-3">$5.99</div>
                  <div className="text-xl sm:text-2xl text-gray-700">/month</div>
                  <div className="text-lg sm:text-xl text-gray-600 mt-3">Cancel anytime</div>
                </div>
                
                <PrimaryButton 
                  className="w-full px-8 sm:px-10 py-5 sm:py-6 mb-5 text-xl sm:text-2xl font-semibold shadow-lg"
                  onClick={handleUpgradeClick}
                >
                  Start Free Trial
                </PrimaryButton>
                
                <p className="text-base sm:text-lg text-gray-600 text-center">
                  7-day free trial, then $5.99/month. Cancel anytime.
                </p>
              </div>
            )}

            {/* Thank you message for premium users */}
            {currentUser?.role === 'premium' && (
              <div className="bg-currant/10 rounded-[1.6rem] p-8 sm:p-10 mb-10 sm:mb-14 max-w-md mx-auto border border-currant/20 text-currant shadow-lg">
                <div className="text-center">
                  <Crown className="h-12 w-12 sm:h-14 sm:w-14 text-currant mx-auto mb-5" />
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-currant mb-3">
                    You're already a BrevEdu+ member!
                  </h3>
                  <p className="text-xl sm:text-2xl text-gray-700 mb-6 sm:mb-8">
                    Thank you for being a premium subscriber. Enjoy unlimited access to all features.
                  </p>
                  <a href="/courses">
                    <AccentButton 
                      className="px-8 sm:px-10 py-4 sm:py-5 text-xl sm:text-2xl font-semibold"
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
        <section className="px-padding-medium py-12 sm:py-16 lg:py-20 bg-grey">
          <div className="max-w-screen-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black text-center mb-8 sm:mb-12 lg:mb-16">
              Premium Features
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="text-center bg-white p-6 rounded-[1.2rem] shadow-md border border-black/5 hover:shadow-lg transition-all">
                    <div className="bg-cobalt/20 w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 rounded-[1.2rem] flex items-center justify-center mx-auto mb-4 sm:mb-6 text-cobalt">
                      <Icon className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 text-cobalt" />
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-black mb-3 sm:mb-4">
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
        <section className="px-padding-medium py-12 sm:py-16 lg:py-20 bg-white border-t border-black/5">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black text-center mb-8 sm:mb-12 lg:mb-16">
              Everything You Get
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3 sm:space-x-4">
                  <Check className="h-5 w-5 sm:h-6 sm:w-6 text-kelp flex-shrink-0" />
                  <span className="text-base sm:text-lg lg:text-xl text-black leading-relaxed">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Hide for premium users */}
        {currentUser?.role !== 'premium' && (
          <section className="px-padding-medium py-12 sm:py-16 lg:py-20 text-center bg-grey border-t border-black/5">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4 sm:mb-6">
                Ready to Level Up?
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 mb-8 sm:mb-12 leading-relaxed">
                Join thousands of learners who are accelerating their skills with BrevEdu+
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                <PrimaryButton 
                  className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 flex items-center justify-center space-x-2 text-lg sm:text-xl font-semibold shadow-lg"
                  onClick={handleUpgradeClick}
                >
                  <Sparkle className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span>Start Free Trial</span>
                </PrimaryButton>
                <OutlineButton
                  variant="purple"
                  className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 text-lg sm:text-xl font-medium shadow-md"
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
        
        {/* Coming Soon Modal */}
        <ComingSoonModal
          isOpen={showComingSoonModal}
          onClose={() => setShowComingSoonModal(false)}
        />
      </Layout>
    </PageTransition>
  );
};

export default BrevEduPlusPage;