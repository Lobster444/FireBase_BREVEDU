import React from 'react';
import { Sparkles, Check, Zap, MessageCircle, Star, Crown } from 'lucide-react';
import Layout from '../components/Layout';
import { PrimaryButton, AccentButton, OutlineButton } from '../components/UIButtons';
import { useAuth } from '../contexts/AuthContext';

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

  return (
    <Layout currentPage="brevedu-plus">
      {/* Hero Section */}
      <section className="px-padding-medium py-12 text-center bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-12 w-12 text-primary mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">BrevEdu+</h1>
          </div>
          
          <p className="text-2xl font-semibold text-primary mb-4">Supercharge Your Learning</p>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Unlock premium features, AI-powered practice sessions, and exclusive content 
            to accelerate your skill development journey.
          </p>

          {/* Pricing - Hide for premium users */}
          {currentUser?.role !== 'premium' && (
            <div className="bg-gray-50 rounded-[16px] p-8 mb-8 max-w-md mx-auto border border-gray-200">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-primary mb-2">$3.99</div>
                <div className="text-lg text-gray-700">/month</div>
                <div className="text-base text-gray-600 mt-2">Cancel anytime</div>
              </div>
              
              <PrimaryButton className="w-full px-8 py-4 mb-4">
                Start Free Trial
              </PrimaryButton>
              
              <p className="text-sm text-gray-600 text-center">
                7-day free trial, then $3.99/month. Cancel anytime.
              </p>
            </div>
          )}

          {/* Thank you message for premium users */}
          {currentUser?.role === 'premium' && (
            <div className="bg-primary/10 rounded-[16px] p-8 mb-8 max-w-md mx-auto border border-primary/20 text-primary">
              <div className="text-center">
                <Crown className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-primary mb-2">You're already a BrevEdu+ member!</h3>
                <p className="text-lg text-gray-700 mb-4">
                  Thank you for being a premium subscriber. Enjoy unlimited access to all features.
                </p>
                <a href="/courses">
                  <AccentButton>
                    Explore Premium Courses
                  </AccentButton>
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="px-padding-medium py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto"> {/* Already using max-w-7xl - good! */}
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Premium Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-base text-gray-700 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-padding-medium py-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Everything You Get</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span className="text-lg text-gray-900">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Chat Preview Section */}
      <section className="px-padding-medium py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">AI Chat Practice</h2>
          <p className="text-lg text-gray-700 text-center mb-12 max-w-2xl mx-auto leading-relaxed">
            Practice your skills with AI-powered conversations. Get personalized feedback 
            and improve your understanding through interactive dialogue.
          </p>
          
          {/* Mock Chat Interface Preview */}
          <div className="bg-white rounded-[16px] p-padding-medium max-w-2xl mx-auto border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">AI Learning Assistant</div>
                <div className="text-sm text-emerald-600 font-medium">●  Online</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-primary/10 rounded-[12px] p-padding-small border border-primary/20 text-primary">
                <p className="text-base text-gray-900">
                  Hi! I'm your AI learning assistant. Let's practice what you learned in the JavaScript fundamentals course. 
                  Can you explain what a variable is?
                </p>
              </div>
              
              <div className="bg-[#F8DE7E]/10 rounded-[12px] p-padding-small border border-[#F8DE7E]/20">
              <div className="bg-accent-yellow/10 rounded-[12px] p-padding-small border border-accent-yellow/20 text-gray-900">
                <p className="text-base text-gray-900">
                  A variable is like a container that stores data values...
                </p>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              {currentUser?.role === 'premium' ? (
                <a href="/courses">
                  <AccentButton>
                    Start AI Practice Session
                  </AccentButton>
                </a>
              ) : (
                <AccentButton>
                  Try AI Chat Practice
                </AccentButton>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Hide for premium users */}
      {currentUser?.role !== 'premium' && (
        <section className="px-padding-medium py-12 text-center bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Level Up?</h2>
            <p className="text-lg text-gray-700 mb-8">
              Join thousands of learners who are accelerating their skills with BrevEdu+
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <PrimaryButton className="px-8 py-4 flex items-center justify-center space-x-2">
                <Sparkles className="h-5 w-5" />
                <span>Start Free Trial</span>
              </PrimaryButton>
              <OutlineButton
                variant="yellow"
                className="px-8 py-4"
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