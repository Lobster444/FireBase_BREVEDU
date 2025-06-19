import React from 'react';
import { Sparkles } from 'lucide-react';
import { PrimaryButton, AccentButton, PillToggleButton } from './UIButtons';
import { User } from '../types';

interface UserMessage {
  title: string;
  subtitle: string;
  ctaText: string;
}

interface HeroSectionProps {
  currentUser: User | null;
  userMessage: UserMessage;
  activeTab: 'all' | 'premium';
  setActiveTab: (tab: 'all' | 'premium') => void;
  onStartLearning: () => void;
  onUpgrade: () => void;
  onExploreCourses: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  currentUser,
  userMessage,
  activeTab,
  setActiveTab,
  onStartLearning,
  onUpgrade,
  onExploreCourses
}) => {
  return (
    <section className="px-padding-medium py-12 text-center bg-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {userMessage.title.includes('Just 5 Minutes') ? (
            <>
              Master New Skills in
              <span className="block text-[#FF7A59] mt-2">Just 5 Minutes</span>
            </>
          ) : (
            userMessage.title
          )}
        </h1>
        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
          {userMessage.subtitle}
        </p>
        
        {/* Course Type Toggle - Only show if user can access premium */}
        {currentUser?.role === 'premium' && (
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 rounded-[12px] p-1 flex">
              <PillToggleButton
                label="All Courses"
                active={activeTab === 'all'}
                onClick={() => setActiveTab('all')}
              />
              <PillToggleButton
                label="Premium Only"
                active={activeTab === 'premium'}
                onClick={() => setActiveTab('premium')}
              />
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          {!currentUser ? (
            <>
              <AccentButton 
                className="px-8 py-4"
                onClick={onStartLearning}
                aria-label="Sign up for free account to start learning"
              >
                {userMessage.ctaText}
              </AccentButton>
              <PrimaryButton 
                className="px-8 py-4 flex items-center justify-center space-x-2"
                onClick={onUpgrade}
                aria-label="Navigate to BrevEdu+ premium subscription page"
              >
                <Sparkles className="h-5 w-5" />
                <span>Upgrade to Premium</span>
              </PrimaryButton>
            </>
          ) : currentUser.role === 'free' ? (
            <>
              <AccentButton 
                className="px-8 py-4"
                onClick={onStartLearning}
                aria-label="Continue to courses page"
              >
                {userMessage.ctaText}
              </AccentButton>
              <PrimaryButton 
                className="px-8 py-4 flex items-center justify-center space-x-2"
                onClick={onUpgrade}
                aria-label="Upgrade to BrevEdu+ premium subscription"
              >
                <Sparkles className="h-5 w-5" />
                <span>Upgrade to Premium</span>
              </PrimaryButton>
            </>
          ) : (
            <PrimaryButton 
              className="px-8 py-4"
              onClick={onExploreCourses}
              aria-label="Explore premium courses"
            >
              {userMessage.ctaText}
            </PrimaryButton>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;