import React from 'react';
import { Clock, Video, Target, ArrowRight, Play, Mic, MicOff, Volume2 } from 'lucide-react';
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
      icon: Video,
      title: 'AI Practice Sessions',
      benefit: 'Interactive video tutor powered by Tavus AI'
    },
    {
      icon: Target,
      title: 'Real-time Feedback',
      benefit: 'Real‑time visual & verbal feedback from your AI tutor'
    }
  ];

  return (
    <section className="px-padding-medium py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            AI Practice Sessions
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Practice what you learn with our AI-powered video tutor for personalized, interactive learning
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Tavus Video Interface */}
          <div className="order-2 lg:order-1">
            <div className="relative bg-gradient-to-br from-primary/5 to-accent-yellow/5 rounded-headspace-2xl p-8 border border-gray-100">
              {/* Tavus Video Interface Mockup */}
              <div className="bg-white rounded-headspace-xl shadow-headspace-lg overflow-hidden max-w-md mx-auto">
                {/* Video Header */}
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-gray-700">AI Practice Session</span>
                    </div>
                    <div className="text-xs text-gray-500">JavaScript Fundamentals</div>
                  </div>
                </div>

                {/* Video Window */}
                <div className="relative aspect-video bg-gradient-to-br from-blue-50 to-purple-50">
                  {/* AI Avatar Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img 
                      src="/image.png" 
                      alt="AI tutor avatar speaking in video interface"
                      className="w-full h-full object-cover"
                      style={{ objectPosition: 'center' }}
                    />
                  </div>
                  
                  {/* Video Overlay Elements */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                      Live AI Tutor
                    </div>
                  </div>
                  
                  {/* Speaking Indicator */}
                  <div className="absolute bottom-4 left-4">
                    <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-gray-700">Speaking...</span>
                    </div>
                  </div>

                  {/* User Video (Small) */}
                  <div className="absolute bottom-4 right-4 w-20 h-16 bg-gray-200 rounded-lg border-2 border-white shadow-lg overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Video Controls */}
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-4">
                    <button className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow">
                      <Mic className="h-4 w-4 text-gray-600" />
                    </button>
                    <button className="p-3 bg-primary rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105">
                      <Play className="h-5 w-5 text-white ml-0.5" />
                    </button>
                    <button className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow">
                      <Volume2 className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                  
                  {/* Session Info */}
                  <div className="mt-3 text-center">
                    <p className="text-xs text-gray-600">
                      "Let's practice JavaScript variables together!"
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-accent-yellow rounded-full p-3 shadow-headspace-md">
                <Video className="h-6 w-6 text-gray-800" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-primary rounded-full p-3 shadow-headspace-md">
                <Target className="h-6 w-6 text-white" />
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

              {/* Additional Benefits */}
              <div className="bg-gradient-to-r from-primary/5 to-accent-yellow/5 rounded-headspace-xl p-6 border border-primary/10">
                <h4 className="font-semibold text-gray-900 mb-3">Powered by Tavus AI</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <span>Interactive video tutor powered by Tavus AI</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <span>Real‑time visual & verbal feedback</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <span>Natural conversation with AI digital twin</span>
                  </li>
                </ul>
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