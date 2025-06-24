import React from 'react';
import { Clock, Target, Zap } from 'lucide-react';

const FeaturesBenefits: React.FC = () => {
  const features = [
    {
      icon: Clock,
      title: 'Quick Boosts',
      benefit: 'Fresh insights in under 5 minutes'
    },
    {
      icon: Target,
      title: 'Clean and Focus',
      benefit: 'Focused content designed for busy professionals'
    },
    {
      icon: Zap,
      title: 'Instant Application',
      benefit: 'Practice immediately with AI-powered sessions'
    }
  ];

  return (
    <section className="px-4 sm:px-padding-medium py-6 sm:py-12 lg:py-16 relative overflow-hidden bg-white border-b border-gray-100">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
            What You Gain with BrevEdu
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
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
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                    <Icon className="h-8 w-8 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
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