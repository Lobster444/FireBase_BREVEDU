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
    <section className="hero-headspace px-padding-medium py-16 sm:py-20 text-center">
      <div className="hero-content max-w-4xl mx-auto">
        <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          {userMessage.title.includes('Just 5 Minutes') ? (
            <>
              Master New Skills in
              <span className="block text-[#002fa7] mt-2 drop-shadow-sm">Just 5 Minutes</span>
            </>
          ) : (
            userMessage.title
          )}
        </h1>
        <p className="hero-subtitle text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
          {userMessage.subtitle}
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
          {!currentUser ? (
            <>
              <AccentButton 
                className="hero-cta-primary px-8 py-4 text-lg font-semibold"
                onClick={onStartLearning}
                aria-label="Sign up for free account to start learning"
              >
                {userMessage.ctaText}
              </AccentButton>
              <SecondaryButton 
                className="hero-cta-secondary px-8 py-4 text-lg font-semibold flex items-center justify-center space-x-2"
                onClick={onUpgrade}
                aria-label="Navigate to BrevEdu+ premium subscription page"
              >
                <Sparkles className="h-5 w-5" />
                <span>Upgrade to Premium</span>
              </SecondaryButton>
            </>
          ) : currentUser.role === 'free' ? (
            <>
              <AccentButton 
                className="hero-cta-primary px-8 py-4 text-lg font-semibold"
                onClick={onStartLearning}
                aria-label="Continue to courses page"
              >
                {userMessage.ctaText}
              </AccentButton>
              <PrimaryButton 
                className="hero-cta-secondary px-8 py-4 text-lg font-semibold flex items-center justify-center space-x-2"
                onClick={onUpgrade}
                aria-label="Upgrade to BrevEdu+ premium subscription"
              >
                <Sparkles className="h-5 w-5" />
                <span>Upgrade to Premium</span>
              </PrimaryButton>
            </>
          ) : (
            <AccentButton 
              className="hero-cta-primary px-8 py-4 text-lg font-semibold"
              onClick={onExploreCourses}
              aria-label="Explore premium courses"
            >
              {userMessage.ctaText}
            </AccentButton>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;