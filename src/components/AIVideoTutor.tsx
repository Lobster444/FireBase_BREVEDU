import React from 'react';
import { Video, Play, Mic, Volume2, ArrowRight, MessageCircle } from 'lucide-react';
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
    {
      icon: '🤖',
      title: 'AI-Powered Conversations',
      description: 'Interactive video tutor powered by Tavus AI'
    },
    {
      icon: '⚡',
      title: 'Real-Time Feedback',
      description: 'Get instant visual and verbal feedback'
    },
    {
      icon: '💬',
      title: 'Natural Dialogue',
      description: 'Engage in natural conversation with AI'
    }
  ];

  return (
    <section className="px-4 sm:px-padding-medium py-12 sm:py-20 lg:py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Section Divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
      
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-100 rounded-full opacity-50 blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-100 rounded-full opacity-40 blur-xl"></div>
      
      <div className="max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
            AI Practice Sessions
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience the future of learning with our AI-powered video tutor that adapts to your pace and provides personalized feedback
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left Side - Tavus Video Interface */}
          <div className="order-2 lg:order-1">
            <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/50">
              {/* Tavus Video Interface Mockup */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-sm sm:max-w-lg mx-auto border border-gray-100">
                {/* Video Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg"></div>
                      <span className="text-sm sm:text-base font-semibold text-gray-800">AI Practice Session</span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 hidden sm:block font-medium">JavaScript Fundamentals</div>
                  </div>
                </div>

                {/* Video Window */}
                <div className="relative aspect-video bg-gradient-to-br from-blue-100 to-purple-100">
                  {/* AI Avatar */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img 
                      src="/image.png" 
                      alt="AI tutor avatar speaking in video interface"
                      className="w-full h-full object-cover rounded-lg"
                      style={{ objectPosition: 'center' }}
                    />
                  </div>
                  
                  {/* Overlay gradient for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>

                {/* Video Controls */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-4 sm:space-x-6">
                    <button 
                      className="p-2.5 bg-white rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105"
                      aria-label="Toggle microphone"
                    >
                      <Mic className="h-4 w-4 text-gray-700" />
                    </button>
                    <button 
                      className="p-3.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
                      aria-label="Play video"
                    >
                      <Play className="h-5 w-5 text-white ml-0.5" />
                    </button>
                    <button 
                      className="p-2.5 bg-white rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105"
                      aria-label="Adjust volume"
                    >
                      <Volume2 className="h-4 w-4 text-gray-700" />
                    </button>
                  </div>
                  
                  {/* Session Info */}
                  <div className="mt-3 sm:mt-4 text-center">
                    <p className="text-sm text-gray-700 hidden sm:block font-medium">
                      "Let's practice JavaScript variables together!"
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-3 sm:-top-4 -right-3 sm:-right-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-3 sm:p-4 shadow-xl">
                <Video className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="absolute -bottom-3 sm:-bottom-4 -left-3 sm:-left-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-3 sm:p-4 shadow-xl">
                <Play className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
          </div>

          {/* Right Side - Benefits & CTA */}
          <div className="order-1 lg:order-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50 hover:shadow-3xl hover:border-blue-200/50 transition-all duration-500 group">
              {/* Benefits List */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 group-hover:text-blue-600 transition-colors duration-300">
                  Experience Interactive Learning
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                  Transform your learning experience with cutting-edge AI technology
                </p>
                
                <div className="space-y-6 mb-8">
                  <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-4 group/item">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-xl group-hover/item:scale-110 transition-transform duration-300">
                        {benefit.icon}
                      </div>
                      <div className="flex-1">
                        <h5 className="text-base font-semibold text-gray-900 mb-1">{benefit.title}</h5>
                        <p className="text-sm text-gray-600 leading-relaxed">{benefit.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                </div>
              </div>

              {/* Tavus Branding */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100 mb-8">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Video className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="text-base font-bold text-gray-900">Powered by Tavus AI</h4>
                </div>
                <p className="text-base text-gray-700 leading-relaxed">
                  Our AI tutors use advanced conversational video technology to provide 
                  natural, engaging practice sessions that adapt to your learning pace.
                </p>
              </div>

              {/* CTA Button */}
              <div>
                <AccentButton 
                  className="w-full px-8 py-5 text-xl font-bold flex items-center justify-center space-x-3 group-hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600"
                  onClick={onStartPracticing}
                  aria-label={currentUser ? "Continue to courses and start practicing" : "Sign up to start practicing with AI"}
                >
                  <span>Start Practicing Now</span>
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                </AccentButton>
                
                {!currentUser && (
                  <p className="text-base text-gray-500 mt-4 text-center font-medium">
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