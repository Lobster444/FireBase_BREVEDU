import React, { useState } from 'react';
import { Clock, Target, Zap } from 'lucide-react';

const FeaturesBenefits: React.FC = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: Clock,
      title: 'Learn in 5 Minutes',
      benefit: 'Master new skills during your coffee break',
      image: '/41b02b86-3dc4-46c7-b506-8c61fd37e4b1.png',
      imageAlt: 'Mobile learning interface showing quick lesson completion',
      gradient: 'from-blue-500/10 to-purple-500/10'
    },
    {
      icon: Target,
      title: 'Bite-Sized Lessons',
      benefit: 'Focused content designed for busy professionals',
      image: '/41b02b86-3dc4-46c7-b506-8c61fd37e4b1.png',
      imageAlt: 'Focused learning modules with clear objectives',
      gradient: 'from-emerald-500/10 to-teal-500/10'
    },
    {
      icon: Zap,
      title: 'Instant Application',
      benefit: 'Practice immediately with AI-powered sessions',
      image: '/41b02b86-3dc4-46c7-b506-8c61fd37e4b1.png',
      imageAlt: 'AI-powered practice session in progress',
      gradient: 'from-orange-500/10 to-red-500/10'
    }
  ];

  return (
    <section className="px-padding-medium py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What You Gain with BrevEdu
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Transform how you learn with our bite-sized approach designed for busy professionals
          </p>
        </div>

        {/* Enhanced Features Grid with Hover Interactions */}
        <div className="relative">
          {/* Background Image Container */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-96 h-96">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-700 ease-out ${
                    hoveredFeature === index 
                      ? 'opacity-100 scale-100 rotate-0' 
                      : 'opacity-0 scale-95 rotate-3'
                  }`}
                  style={{
                    transitionDelay: hoveredFeature === index ? '150ms' : '0ms'
                  }}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl blur-xl scale-110`} />
                  
                  {/* Main Image */}
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={feature.image}
                      alt={feature.imageAlt}
                      className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
                    />
                    
                    {/* Overlay with Feature Info */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {feature.benefit}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Decorative Elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent-yellow rounded-full shadow-lg animate-bounce" 
                       style={{ animationDelay: '0.5s', animationDuration: '2s' }} />
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-primary rounded-full shadow-lg animate-bounce" 
                       style={{ animationDelay: '1s', animationDuration: '2.5s' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isHovered = hoveredFeature === index;
              
              return (
                <div 
                  key={index}
                  className="text-center group cursor-pointer"
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  {/* Interactive Card */}
                  <div className={`
                    relative bg-white rounded-2xl p-8 transition-all duration-500 ease-out
                    ${isHovered 
                      ? 'shadow-2xl scale-105 -translate-y-2 bg-gradient-to-br from-white to-gray-50' 
                      : 'shadow-lg hover:shadow-xl'
                    }
                  `}>
                    {/* Animated Border */}
                    <div className={`
                      absolute inset-0 rounded-2xl transition-all duration-500
                      ${isHovered 
                        ? 'bg-gradient-to-r from-primary/20 via-accent-yellow/20 to-primary/20 p-0.5' 
                        : 'bg-transparent'
                      }
                    `}>
                      <div className="w-full h-full bg-white rounded-2xl" />
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon with Enhanced Animation */}
                      <div className={`
                        w-16 h-16 rounded-headspace-xl flex items-center justify-center mx-auto mb-6 
                        transition-all duration-500 ease-out
                        ${isHovered 
                          ? 'bg-primary text-white shadow-lg scale-110 rotate-6' 
                          : 'bg-primary/10 text-primary group-hover:bg-primary/20'
                        }
                      `}>
                        <Icon className={`h-8 w-8 transition-all duration-300 ${
                          isHovered ? 'scale-110' : ''
                        }`} />
                      </div>
                      
                      {/* Text Content with Enhanced Typography */}
                      <h3 className={`
                        text-xl font-bold mb-3 transition-all duration-300
                        ${isHovered ? 'text-primary scale-105' : 'text-gray-900'}
                      `}>
                        {feature.title}
                      </h3>
                      
                      <p className={`
                        text-base leading-relaxed transition-all duration-300
                        ${isHovered ? 'text-gray-800 scale-102' : 'text-gray-700'}
                      `}>
                        {feature.benefit}
                      </p>
                      
                      {/* Hover Indicator */}
                      <div className={`
                        mt-4 w-12 h-1 bg-gradient-to-r from-primary to-accent-yellow rounded-full mx-auto
                        transition-all duration-500 ease-out
                        ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
                      `} />
                    </div>
                    
                    {/* Floating Action Hint */}
                    <div className={`
                      absolute -top-2 -right-2 w-6 h-6 bg-accent-yellow rounded-full 
                      flex items-center justify-center shadow-lg transition-all duration-500
                      ${isHovered ? 'opacity-100 scale-100 rotate-12' : 'opacity-0 scale-50'}
                    `}>
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Background Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-accent-yellow/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse" 
               style={{ animationDelay: '1s' }} />
        </div>

        {/* Call-to-Action Hint */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500 italic">
            Hover over each feature to see it in action
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesBenefits;