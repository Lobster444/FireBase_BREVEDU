import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Play, Mic, Volume2, MessageCircle } from 'lucide-react';
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
  const navigate = useNavigate();

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

  const handleClick = () => {
    if (!currentUser) {
      onStartPracticing();       // opens sign-up form
    } else {
      navigate('/courses');      // logged-in user continues to courses
    }
  };

  return (
    <section className="px-4 sm:px-padding-medium py-12 sm:py-20 lg:py-24 bg-grey relative overflow-hidden">
      {/* Section Divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-black/10"></div>
      
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50"></div>
      
      <div className="max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-cobalt rounded-[1.2rem] mb-6">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
            AI Practice Sessions
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience AI‑powered Boosts: instant guidance, clear feedback, and natural conversation—so you absorb something new every time
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left Side - Tavus Video Interface */}
          <div className="order-2 lg:order-1">
            <div className="relative bg-white rounded-[1.6rem] p-6 sm:p-8 lg:p-10 shadow-xl border border-black/5">
              {/* Tavus Video Interface Mockup */}
              <div className="bg-white rounded-[1.2rem] shadow-lg overflow-hidden max-w-sm sm:max-w-lg mx-auto border border-gray-100">
                {/* Video Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg"></div>
                      <span className="text-base sm:text-lg font-semibold text-gray-800">AI Practice Session</span>
                    </div>
                    <div className="text-sm sm:text-base text-gray-600 hidden sm:block font-medium">How AIs, like ChatGPT Learn</div>
                  </div>
                </div>

                {/* Video Window */}
                <div className="relative aspect-video bg-gradient-to-br from-powder/30 to-thistle/30">
                  {/* AI Avatar */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img 
                      src="/ChatGPT Image Jun 23, 2025, 05_28_21 PM.png" 
                      alt="AI tutor avatar speaking in video interface"
                      className="w-full h-full object-cover rounded-lg"
                      style={{ objectPosition: 'center' }}
                    />
                  </div>
                  
                  {/* Overlay gradient for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>

                {/* Video Controls */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 flex flex-col">
                  <div className="flex items-center justify-center space-x-4 sm:space-x-6">
                    <button 
                      className="p-2.5 bg-white rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
                      aria-label="Toggle microphone"
                    >
                      <Mic className="h-4 w-4 text-gray-700" />
                    </button>
                    <button 
                      className="p-3.5 bg-cobalt rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
                      aria-label="Play video"
                    >
                      <Play className="h-5 w-5 text-white ml-0.5" />
                    </button>
                    <button 
                      className="p-2.5 bg-white rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
                      aria-label="Adjust volume"
                    >
                      <Volume2 className="h-4 w-4 text-gray-700" />
                    </button>
                  </div>
                  
                  {/* Session Info */}
                  <div className="mt-3 sm:mt-4 text-center">
                    <p className="text-base text-gray-700 hidden sm:block font-medium">
                      "Let's practice together!"
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-3 sm:-top-4 -right-3 sm:-right-4 bg-hyper-yellow rounded-full p-3 sm:p-4 shadow-xl">
                <Video className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="absolute -bottom-3 sm:-bottom-4 -left-3 sm:-left-4 bg-cobalt rounded-full p-3 sm:p-4 shadow-xl">
                <Play className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
          </div>

          {/* Right Side - Benefits & CTA */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-[1.6rem] p-8 shadow-xl border border-black/5 hover:shadow-2xl hover:border-cobalt/20 transition-all duration-500 group">
              {/* Benefits List */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 group-hover:text-cobalt transition-colors duration-300">
                  Experience Interactive Learning
                </h3>
                <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
                  Transform your learning experience with cutting-edge AI technology
                </p>
                
                <div className="space-y-6 mb-8">
                  <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-4 group/item">
                      <div className="flex-shrink-0 w-12 h-12 bg-cobalt rounded-xl flex items-center justify-center text-xl group-hover/item:scale-110 transition-transform duration-300">
                        {benefit.icon}
                      </div>
                      <div className="flex-1">
                        <h5 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h5>
                        <p className="text-base text-gray-600 leading-relaxed">{benefit.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                </div>
              </div>

              {/* Tavus Branding */}
              <div className="bg-grey rounded-[1.2rem] p-6 border border-black/5 mb-8">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-10 h-10 bg-cobalt rounded-xl flex items-center justify-center">
                    <Video className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">Powered by Tavus AI</h4>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Our AI tutors use advanced conversational video technology to provide 
                  natural, engaging practice sessions that adapt to your learning pace.
                </p>
              </div>

              {/* CTA Button */}
              <div>
                <AccentButton 
                  className="w-full px-8 py-5 text-xl sm:text-2xl font-bold flex items-center justify-center space-x-3 group-hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
                  onClick={handleClick}
                  aria-label={currentUser ? "Continue to courses and start practicing" : "Sign up to start practicing with AI"}
                >
                  <span>Start Practicing Now</span>
                </AccentButton>
                
                {!currentUser && (
                  <p className="text-lg text-gray-500 mt-4 text-center font-medium">
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