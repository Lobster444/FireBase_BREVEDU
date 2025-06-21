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
    <section className="hero-headspace px-6 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20 text-center">
      <div className="hero-content max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left px-4 sm:px-6 lg:px-0">
            <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 lg:mb-10 leading-tight">
              {userMessage.title.includes('Just 5 Minutes') ? (
                <>
                  Master New Skills in
                  <span className="block text-[#002fa7] mt-3 lg:mt-4 drop-shadow-sm">Just 5 Minutes</span>
                </>
              ) : (
                userMessage.title
              )}
            </h1>
            <p className="hero-subtitle text-lg sm:text-xl mb-12 lg:mb-14 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium px-2 sm:px-0">
              {userMessage.subtitle}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center lg:justify-start px-4 sm:px-0">
              {!currentUser ? (
                <>
                  <AccentButton 
                    className="hero-cta-primary px-10 py-5 text-lg font-semibold min-w-[200px]"
                    onClick={onStartLearning}
                    aria-label="Sign up for free account to start learning"
                  >
                    {userMessage.ctaText}
                  </AccentButton>
                </>
              ) : currentUser.role === 'free' ? (
                <>
                  <AccentButton 
                    className="hero-cta-primary px-10 py-5 text-lg font-semibold min-w-[200px]"
                    onClick={onStartLearning}
                    aria-label="Continue to courses page"
                  >
                    {userMessage.ctaText}
                  </AccentButton>
                </>
              ) : (
                <AccentButton 
                  className="hero-cta-primary px-10 py-5 text-lg font-semibold min-w-[200px]"
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
            <div className="relative max-w-lg w-full px-6 sm:px-8 lg:px-0 mt-8 lg:mt-0">
              <img 
                src="/41b02b86-3dc4-46c7-b506-8c61fd37e4b1 copy.png"
                alt="Interactive learning interface showing mobile app with AI tutor and course content"
                className="w-full h-auto rounded-headspace-xl shadow-headspace-lg"
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