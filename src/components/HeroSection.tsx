import React from 'react';
import { Sparkles } from 'lucide-react';
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
    <section className="hero-headspace w-full py-8 sm:py-16 lg:py-20 text-center relative overflow-hidden">
      <div className="hero-content max-w-screen-2xl mx-auto px-padding-medium lg:px-padding-large">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 xl:gap-20 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left space-y-6 sm:space-y-8">
            <h1 className="hero-title text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight">
              {userMessage.title.includes('Just 5 Minutes') ? (
                <>
                  Learn something new
                  <span className="block text-[#002fa7] mt-1 sm:mt-2 lg:mt-3 drop-shadow-sm">just in 5 minutes</span>
                </>
              ) : (
                userMessage.title
              )}
            </h1>
            <p className="hero-subtitle text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto lg:mx-0 leading-relaxed font-normal text-gray-700">
              {userMessage.subtitle}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start pt-4 sm:pt-6">
              {!currentUser ? (
                <>
                  <AccentButton 
                    className="hero-cta-primary text-white px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-semibold min-w-[200px] sm:min-w-[240px] shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={onStartLearning}
                    aria-label="Sign up for free account to start learning"
                  >
                    {userMessage.ctaText}
                  </AccentButton>
                </>
              ) : currentUser.role === 'free' ? (
                <>
                  <AccentButton 
                    className="hero-cta-primary text-white px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-semibold min-w-[200px] sm:min-w-[240px] shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={onStartLearning}
                    aria-label="Continue to courses page"
                  >
                    {userMessage.ctaText}
                  </AccentButton>
                </>
              ) : (
                <AccentButton 
                  className="hero-cta-primary text-white px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-semibold min-w-[200px] sm:min-w-[240px] shadow-lg hover:shadow-xl transition-all duration-300"
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
            <div className="relative max-w-sm sm:max-w-lg w-full">
              <img 
                src="/41b02b86-3dc4-46c7-b506-8c61fd37e4b1 copy.png"
                alt="Interactive learning interface showing mobile app with AI tutor and course content"
                className="w-full h-auto rounded-headspace-xl shadow-headspace-lg transform hover:scale-105 transition-transform duration-500"
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