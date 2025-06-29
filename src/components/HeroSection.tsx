import React from 'react';
import { Sparkle, ChatCircle } from '@phosphor-icons/react';
import { PrimaryButton, AccentButton, SecondaryButton, PillToggleButton } from './UIButtons';
import { User } from '../types';

interface UserMessage {
  title: string;
  subtitle: string;
  ctaText: string;
}

interface HeroSectionProps {
  currentUser: User | null;
  userMessage: UserMessage;
  onStartLearning: () => void;
  onUpgrade: () => void;
  onExploreCourses: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  currentUser,
  userMessage,
  onStartLearning,
  onUpgrade,
  onExploreCourses
}) => {
  return (
    <section className="w-full py-12 sm:py-20 lg:py-28 text-center relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 z-0">
      {/* Section Divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
      
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-100 rounded-full opacity-50 blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-100 rounded-full opacity-40 blur-xl"></div>
      
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-20 xl:gap-24 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left space-y-8 sm:space-y-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
              {userMessage.title.includes('Just 5 Minutes') ? (
                <>
                  Learn something new
                  <span className="block text-cobalt mt-3 sm:mt-10 lg:mt-2 drop-shadow-sm">just in 5 minutes</span>
                </>
              ) : (
                userMessage.title
              )}
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl max-w-3xl mx-auto lg:mx-0 leading-relaxed font-normal text-gray-700">
              {userMessage.subtitle}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center lg:justify-start pt-6 sm:pt-8">
              {!currentUser ? (
                <>
                  <AccentButton 
                    className="text-black px-10 sm:px-12 py-5 sm:py-6 text-xl sm:text-2xl font-semibold min-w-[220px] sm:min-w-[260px] shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={onStartLearning}
                    aria-label="Sign up for free account to start learning"
                  >
                    {userMessage.ctaText}
                  </AccentButton>
                </>
              ) : currentUser.role === 'free' ? (
                <>
                  <AccentButton 
                    className="text-black px-10 sm:px-12 py-5 sm:py-6 text-xl sm:text-2xl font-semibold min-w-[220px] sm:min-w-[260px] shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={onStartLearning}
                    aria-label="Continue to courses page"
                  >
                    {userMessage.ctaText}
                  </AccentButton>
                </>
              ) : (
                <AccentButton 
                  className="text-black px-10 sm:px-12 py-5 sm:py-6 text-xl sm:text-2xl font-semibold min-w-[220px] sm:min-w-[260px] shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={onExploreCourses}
                  aria-label="Explore premium courses"
                >
                  {userMessage.ctaText}
                </AccentButton>
              )}
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative max-w-sm sm:max-w-lg w-full transform hover:scale-105 transition-transform duration-500 mt-8 lg:mt-0">
              <img 
                src="/41b02b86-3dc4-46c7-b506-8c61fd37e4b1 copy.png"
                alt="Interactive learning interface showing mobile app with AI tutor and course content"
                className="w-full h-auto rounded-[1.2rem] sm:rounded-[1.6rem] shadow-xl"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;