import React from 'react';
import { Video, Play, Mic, Volume2, ArrowRight } from 'lucide-react';
import { AccentButton } from './UIButtons';
import { User } from '../types';

interface AIVideoTutorProps {
  currentUser: User | null;
  onStartPracticing: () => void;
}

const AIVideoTutor: React.FC<AIVideoTutorProps> = ({
  currentUser,
  onStartPracticing
}) => {
  const benefits = [
    'Interactive video tutor powered by Tavus AI',
    'Real-time visual & verbal feedback',
    'Natural conversation with AI digital twin'
  ];

  return (
    <section className="px-4 sm:px-padding-medium py-8 sm:py-16 lg:py-20 bg-gray-50 relative">
      {/* Section Divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      
      <div className="max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4">
            AI Practice Sessions
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Explore new ideas with our AI-powered video tutor
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Left Side - Tavus Video Interface */}
          <div className="order-2 lg:order-1">
            <div className="relative bg-gradient-to-br from-primary/5 to-accent-yellow/5 rounded-headspace-2xl p-3 sm:p-4 lg:p-8">
              {/* Tavus Video Interface Mockup */}
              <div className="bg-white rounded-headspace-xl shadow-headspace-lg overflow-hidden max-w-xs sm:max-w-md mx-auto">
                {/* Video Header */}
                <div className="bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-xs sm:text-sm font-medium text-gray-700">AI Practice Session</span>
                    </div>
                    <div className="text-xs text-gray-500 hidden sm:block">JavaScript Fundamentals</div>
                  </div>
                </div>

                {/* Video Window */}
                <div className="relative aspect-video bg-gradient-to-br from-blue-50 to-purple-50">
                  {/* AI Avatar */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img 
                      src="/image.png" 
                      alt="AI tutor avatar speaking in video interface"
                      className="w-full h-full object-cover"
                      style={{ objectPosition: 'center' }}
                    />
                  </div>

                  {/* User Video (Small) */}
                  <div className="absolute bottom-4 right-4 w-16 h-12 sm:w-20 sm:h-16 bg-gray-200 rounded-lg border-2 border-white shadow-lg overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-400 rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Video Controls */}
                <div className="bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-3 sm:space-x-4">
                    <button 
                      className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
                      aria-label="Toggle microphone"
                    >
                      <Mic className="h-4 w-4 text-gray-600" />
                    </button>
                    <button 
                      className="p-3 bg-primary rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105"
                      aria-label="Play video"
                    >
                      <Play className="h-5 w-5 text-white ml-0.5" />
                    </button>
                    <button 
                      className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
                      aria-label="Adjust volume"
                    >
                      <Volume2 className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                  
                  {/* Session Info */}
                  <div className="mt-2 sm:mt-3 text-center">
                    <p className="text-xs text-gray-600 hidden sm:block">
                      "Let's practice JavaScript variables together!"
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 bg-accent-yellow rounded-full p-2 sm:p-3 shadow-headspace-md">
                <Video className="h-4 w-4 sm:h-6 sm:w-6 text-gray-800" />
              </div>
              <div className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 bg-primary rounded-full p-2 sm:p-3 shadow-headspace-md">
                <Play className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
          </div>

          {/* Right Side - Benefits & CTA */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-primary/20 transition-all duration-300 group">
              {/* Benefits List */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">
                  AI Practice Sessions
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Explore new ideas with our AI-powered video tutor
                </p>
                
                <div className="space-y-3 mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Experience Interactive Learning</h4>
                  <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span className="text-sm text-gray-700 font-medium">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
                </div>
              </div>

              {/* Tavus Branding */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100 mb-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Video className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900">Powered by Tavus AI</h4>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Our AI tutors use advanced conversational video technology to provide 
                  natural, engaging practice sessions that adapt to your learning pace.
                </p>
              </div>

              {/* CTA Button */}
              <div>
                <AccentButton 
                  className="w-full px-6 py-4 text-lg font-bold flex items-center justify-center space-x-2 group-hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl"
                  onClick={onStartPracticing}
                  aria-label={currentUser ? "Continue to courses and start practicing" : "Sign up to start practicing with AI"}
                >
                  <span>Start Practicing Now</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </AccentButton>
                
                {!currentUser && (
                  <p className="text-sm text-gray-500 mt-3 text-center">
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

export default AIVideoTutor;