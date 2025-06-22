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
      title: 'Clean Mini-Learnings',
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

        </div>
      </div>
    </section>
  );
};

export default FeaturesBenefits;