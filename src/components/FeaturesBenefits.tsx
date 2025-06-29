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
      benefit: 'Apply what you learn right after each Skill Boost'
    }
  ];

  return (
    <section className="px-4 sm:px-8 md:px-12 py-12 sm:py-16 lg:py-24 relative overflow-hidden bg-white border-b border-black/10">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-6 sm:mb-8">
            What You Gain with BrevEdu
          </h2>
          <p className="text-xl sm:text-2xl lg:text-3xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Transform how you learn with our bite-sized approach designed for busy professionals
          </p>
        </div>

        {/* Features Grid with Hover Image */}
        <div className="relative">
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 relative z-10">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="text-center group cursor-pointer p-8 rounded-[1.2rem] hover:bg-grey transition-all duration-300"
                  data-feature={index}
                >
                  {/* Icon */}
                  <div className="w-20 h-20 bg-cobalt rounded-[1.2rem] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-all duration-300 shadow-md">
                    <Icon className="h-10 w-10 text-white transition-transform duration-300" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl sm:text-3xl font-bold text-black mb-4 group-hover:text-cobalt transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-lg sm:text-xl text-gray-700 leading-relaxed group-hover:text-black transition-colors duration-300">
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