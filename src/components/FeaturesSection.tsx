import React from 'react';
import { Clock, MessageCircle, Target, ArrowRight } from 'lucide-react';
import { AccentButton } from './UIButtons';
import { User } from '../types';

interface FeaturesSectionProps {
  currentUser: User | null;
  onStartPracticing: () => void;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  currentUser,
  onStartPracticing
}) => {
  const features = [
    {
      icon: Clock,
      title: 'Learn in 5 Minutes',
      benefit: 'Master new skills during your coffee break'
    },
    {
      icon: MessageCircle,
      title: 'AI Practice Sessions',
      benefit: 'Reinforce learning with intelligent conversations'
    },
    {
      icon: Target,
      title: 'Focused Content',
      benefit: 'No fluff, just the essentials you need to know'
    }
  ];

  return (
    <section className="px-padding-medium py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What You Gain with BrevEdu
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Transform how you learn with our bite-sized approach designed for busy professionals
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Visual Demo */}
          <div className="order-2 lg:order-1">
            <div className="relative bg-gradient-to-br from-primary/5 to-accent-yellow/5 rounded-headspace-2xl p-8 border border-gray-100">
              {/* Mock AI Chat Interface */}
              <div className="bg-white rounded-headspace-xl shadow-headspace-md p-6 max-w-md mx-auto">
                <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">AI Practice Tutor</h4>
                    <p className="text-sm text-gray-600">JavaScript Fundamentals</p>
                  </div>
                </div>
                
                {/* Chat Messages */}
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-headspace-lg p-3">
                    <p className="text-sm text-gray-800">
                      Let's practice variables! Can you explain the difference between let and const?
                    </p>
                  </div>
                  <div className="bg-primary/10 rounded-headspace-lg p-3 ml-4">
                    <p className="text-sm text-gray-800">
                      const creates immutable bindings while let allows reassignment...
                    </p>
                  </div>
                  <div className="bg-emerald-50 rounded-headspace-lg p-3">
                    <p className="text-sm text-emerald-800 font-medium">
                      ✓ Excellent! You understand the key concepts.
                    </p>
                  </div>
                </div>
                
                {/* Typing Indicator */}
                <div className="flex items-center space-x-2 mt-4 text-gray-500">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-accent-yellow rounded-full p-3 shadow-headspace-md">
                <Target className="h-6 w-6 text-gray-800" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-primary rounded-full p-3 shadow-headspace-md">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          {/* Right Side - Features Grid */}
          <div className="order-1 lg:order-2">
            <div className="space-y-8">
              {/* Feature Cards */}
              <div className="grid grid-cols-1 gap-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div 
                      key={index}
                      className="bg-white rounded-headspace-xl p-6 border border-gray-100 shadow-headspace-sm hover:shadow-headspace-md transition-all duration-300 group"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-headspace-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-base text-gray-700 leading-relaxed">
                            {feature.benefit}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <AccentButton 
                  className="w-full sm:w-auto px-8 py-4 text-lg font-semibold flex items-center justify-center space-x-2 group"
                  onClick={onStartPracticing}
                  aria-label={currentUser ? "Continue to courses" : "Sign up to start practicing"}
                >
                  <span>Start Practicing Now</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </AccentButton>
                
                {!currentUser && (
                  <p className="text-sm text-gray-600 mt-3">
                    Free account • No credit card required
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;