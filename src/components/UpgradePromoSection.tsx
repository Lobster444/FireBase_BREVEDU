import React from 'react';
import { Sparkles } from 'lucide-react';
import { PrimaryButton } from './UIButtons';

interface UpgradePromoSectionProps {
  onUpgradeClick: () => void;
}

const UpgradePromoSection: React.FC<UpgradePromoSectionProps> = ({
  onUpgradeClick
}) => {
  return (
    <section className="px-4 sm:px-8 md:px-12 py-12 sm:py-20 lg:py-28 bg-grey">
      <div className="max-w-screen-2xl mx-auto">
        <div className="bg-white rounded-[1.2rem] sm:rounded-[1.6rem] p-8 sm:p-10 lg:p-12 text-center border border-black/5 shadow-lg">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-4 sm:mb-6 lg:mb-8">
              <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 text-cobalt mr-3 sm:mr-4" />
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black">Upgrade to BrevEdu+</h2>
            </div>
            
            <p className="text-xl sm:text-2xl lg:text-3xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-10">
              Get full access to all courses, AI-powered practice sessions, and exclusive content. 
              Accelerate your learning with premium features designed for serious learners.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 justify-center items-center mb-8 sm:mb-10 lg:mb-12 bg-grey p-6 rounded-[1.2rem]">
              <div className="flex items-center space-x-3 text-kelp">
                <span className="text-lg sm:text-xl">✓</span>
                <span className="text-base sm:text-lg lg:text-xl font-medium">Unlimited course access</span>
              </div>
              <div className="flex items-center space-x-3 text-kelp">
                <span className="text-lg sm:text-xl">✓</span>
                <span className="text-base sm:text-lg lg:text-xl font-medium">3 daily AI practice sessions</span>
              </div>
              <div className="flex items-center space-x-3 text-kelp">
                <span className="text-lg sm:text-xl">✓</span>
                <span className="text-base sm:text-lg lg:text-xl font-medium">Premium-only content</span>
              </div>
            </div>
            
            <PrimaryButton 
              onClick={onUpgradeClick}
              className="px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 flex items-center justify-center space-x-3 mx-auto text-xl sm:text-2xl shadow-lg"
              aria-label="Start BrevEdu+ premium subscription"
            >
              <Sparkles className="h-6 w-6" />
              <span>Start BrevEdu+ Today</span>
            </PrimaryButton>
            
            <p className="text-base sm:text-lg text-gray-600 mt-6 sm:mt-8 lg:mt-10">
              7-day free trial • Cancel anytime • $5.99/month
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpgradePromoSection;