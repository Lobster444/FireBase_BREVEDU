import React from 'react';
import { Clock, Target, Zap } from 'lucide-react';

const FeaturesBenefits: React.FC = () => {
  const features = [
    {
      icon: Clock,
      title: 'Learn in 5 Minutes',
      benefit: 'Master new skills during your coffee break'
    },
    {
      icon: Target,
      title: 'Bite-Sized Lessons',
      benefit: 'Focused content designed for busy professionals'
    },
    {
      icon: Zap,
      title: 'Instant Application',
      benefit: 'Practice immediately with AI-powered sessions'
    }
  ];

  return (
    <section className="px-4 sm:px-padding-medium py-6 sm:py-12 lg:py-16 relative overflow-hidden">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4">
            What You Gain with BrevEdu
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Transform how you learn with our bite-sized approach designed for busy professionals
          </p>
        </div>

        {/* Features Grid with Hover Image */}
        <div className="relative">
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 relative z-10">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="text-center group cursor-pointer hover-trigger"
                  data-feature={index}
                >
                  {/* Icon */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-primary/10 rounded-headspace-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2 lg:mb-3 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
                    {feature.benefit}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Floating Hover Image - Desktop Only */}
          <div className="hidden lg:block absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-8 z-20 pointer-events-none">
            <div className="hover-image opacity-0 scale-95 transition-all duration-500 ease-out">
              <div className="relative">
                {/* Image Container with Glow Effect */}
                <div className="relative bg-gradient-to-br from-primary/10 to-accent-yellow/10 rounded-headspace-2xl p-4 shadow-headspace-xl">
                  <img 
                    src="/41b02b86-3dc4-46c7-b506-8c61fd37e4b1.png"
                    alt="Interactive learning interface showing mobile app with AI tutor and course content"
                    className="w-80 h-auto rounded-headspace-xl shadow-headspace-lg"
                  />
                  
                  {/* Floating Badge */}
                  <div className="absolute -top-3 -right-3 bg-accent-yellow rounded-full px-4 py-2 shadow-headspace-md">
                    <span className="text-sm font-bold text-gray-800">Interactive Learning</span>
                  </div>
                  
                  {/* Pulse Animation */}
                  <div className="absolute inset-0 rounded-headspace-2xl bg-primary/5 animate-pulse"></div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary rounded-full opacity-20 animate-bounce"></div>
                <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-accent-yellow rounded-full opacity-30 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
              </div>
            </div>
          </div>

          {/* Mobile Hover Image - Shows Below Grid */}
          <div className="lg:hidden mt-6 sm:mt-8">
            <div className="mobile-hover-image opacity-0 scale-95 transition-all duration-500 ease-out">
              <div className="text-center">
                <div className="inline-block relative bg-gradient-to-br from-primary/10 to-accent-yellow/10 rounded-headspace-2xl p-4 shadow-headspace-xl">
                  
                  {/* Mobile Badge */}
                  <div className="absolute -top-2 sm:-top-3 left-1/2 transform -translate-x-1/2 bg-accent-yellow rounded-full px-3 sm:px-4 py-1 sm:py-2 shadow-headspace-md">
                    <span className="text-sm font-bold text-gray-800">See It In Action</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles for Hover Interaction */}
      <style jsx>{`
        .hover-trigger:hover ~ .hover-image,
        .hover-trigger:hover ~ * .hover-image {
          opacity: 1 !important;
          transform: translateY(-50%) translateX(2rem) scale(1) !important;
        }
        
        .hover-trigger:hover ~ .mobile-hover-image,
        .hover-trigger:hover ~ * .mobile-hover-image {
          opacity: 1 !important;
          transform: scale(1) !important;
        }
        
        /* Enhanced hover states for better interaction */
        .hover-trigger:hover {
          transform: translateY(-4px);
        }
        
        @media (max-width: 1023px) {
          .hover-trigger:hover ~ .mobile-hover-image {
            opacity: 1 !important;
            transform: scale(1) !important;
          }
        }
      `}</style>
    </section>
  );
};

export default FeaturesBenefits;