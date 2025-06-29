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
    <section className="px-4 sm:px-padding-medium py-6 sm:py-12 lg:py-20 bg-grey">
      <div className="max-w-screen-2xl mx-auto">
        <div className="bg-white rounded-[1.2rem] sm:rounded-[1.6rem] p-4 sm:p-6 lg:p-8 text-center border border-black/5 shadow-lg">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-2 sm:mb-3 lg:mb-4">
              <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-cobalt mr-2 sm:mr-3" />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Upgrade to BrevEdu+</h2>
            </div>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8">
              Get full access to all courses, AI-powered practice sessions, and exclusive content. 
              Accelerate your learning with premium features designed for serious learners.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 justify-center items-center mb-4 sm:mb-6 lg:mb-8 bg-grey p-4 rounded-[1.2rem]">
              <div className="flex items-center space-x-2 text-emerald-700">
                <span className="text-base sm:text-lg">✓</span>
                <span className="text-sm sm:text-base lg:text-lg font-medium">Unlimited course access</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-700">
                <span className="text-base sm:text-lg">✓</span>
                <span className="text-sm sm:text-base lg:text-lg font-medium">3 daily AI practice sessions</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-700">
                <span className="text-base sm:text-lg">✓</span>
                <span className="text-sm sm:text-base lg:text-lg font-medium">Premium-only content</span>
              </div>
            </div>
            
            <PrimaryButton 
              onClick={onUpgradeClick}
              className="px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 flex items-center justify-center space-x-2 mx-auto text-lg sm:text-xl shadow-lg"
              aria-label="Start BrevEdu+ premium subscription"
            >
              <Sparkles className="h-5 w-5" />
              <span>Start BrevEdu+ Today</span>
            </PrimaryButton>
            
            <p className="text-sm sm:text-base text-gray-600 mt-3 sm:mt-4 lg:mt-6">
              7-day free trial • Cancel anytime • $5.99/month
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpgradePromoSection;