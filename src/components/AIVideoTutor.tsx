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
    <section className="px-4 sm:px-padding-medium py-8 sm:py-12 lg:py-16 bg-gray-50">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            AI Practice Sessions
          </h2>
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Practice what you learn with our AI-powered video tutor for personalized, interactive learning
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Left Side - Tavus Video Interface */}
          <div className="order-2 lg:order-1">
            <div className="relative bg-gradient-to-br from-primary/5 to-accent-yellow/5 rounded-headspace-2xl p-4 sm:p-8">
              {/* Tavus Video Interface Mockup */}
              <div className="bg-white rounded-headspace-xl shadow-headspace-lg overflow-hidden max-w-md mx-auto">
                {/* Video Header */}
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
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
                  <div className="absolute bottom-4 right-4 w-16 h-12 sm:w-20 sm:h-16 bg-gray-200 rounded-lg border-2 border-white shadow-lg overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-400 rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Video Controls */}
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-4">
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
                  <div className="mt-3 text-center">
                    <p className="text-xs text-gray-600 hidden sm:block">
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
                <Play className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          {/* Right Side - Benefits & CTA */}
          <div className="order-1 lg:order-2">
            <div className="space-y-6 sm:space-y-8">
              {/* Benefits List */}
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                  Experience Interactive Learning
                </h3>
                <ul className="space-y-3 sm:space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      </div>
                      <span className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tavus Branding */}
              <div className="bg-gradient-to-r from-primary/5 to-accent-yellow/5 rounded-headspace-xl p-4 sm:p-6 border border-primary/10">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Video className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900">Powered by Tavus AI</h4>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Our AI tutors use advanced conversational video technology to provide 
                  natural, engaging practice sessions that adapt to your learning pace.
                </p>
              </div>

              {/* CTA Button */}
              <div className="pt-2 sm:pt-4">
                <AccentButton 
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold flex items-center justify-center space-x-2 group"
                  onClick={onStartPracticing}
                  aria-label={currentUser ? "Continue to courses and start practicing" : "Sign up to start practicing with AI"}
                >
                  <span>Start Practicing Now</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </AccentButton>
                
                {!currentUser && (
                  <p className="text-sm text-gray-600 mt-3 text-center sm:text-left">
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