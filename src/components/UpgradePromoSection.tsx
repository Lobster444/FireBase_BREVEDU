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
    <section className="px-4 sm:px-padding-medium py-6 sm:py-12 bg-white">
      <div className="max-w-screen-2xl mx-auto">
        <div className="bg-gradient-to-r from-[#FF7A59]/10 to-[#F5C842]/10 rounded-[16px] p-4 sm:p-6 lg:p-padding-large text-center border border-[#FF7A59]/20">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-2 sm:mb-3 lg:mb-4">
              <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-[#FF7A59] mr-2 sm:mr-3" />
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Upgrade to BrevEdu+</h2>
            </div>
            
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 mb-3 sm:mb-4 lg:mb-6 leading-relaxed">
              Get full access to all courses, AI-powered practice sessions, and exclusive content. 
              Accelerate your learning with premium features designed for serious learners.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4 justify-center items-center mb-3 sm:mb-4 lg:mb-6">
              <div className="flex items-center space-x-2 text-emerald-700">
                <span className="text-sm sm:text-base">✓</span>
                <span className="text-xs sm:text-sm lg:text-base font-medium">Unlimited course access</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-700">
                <span className="text-sm sm:text-base">✓</span>
                <span className="text-xs sm:text-sm lg:text-base font-medium">3 daily AI practice sessions</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-700">
                <span className="text-sm sm:text-base">✓</span>
                <span className="text-xs sm:text-sm lg:text-base font-medium">Premium-only content</span>
              </div>
            </div>
            
            <PrimaryButton 
              onClick={onUpgradeClick}
              className="px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 flex items-center justify-center space-x-2 mx-auto text-sm sm:text-base lg:text-lg"
              aria-label="Start BrevEdu+ premium subscription"
            >
              <Sparkles className="h-5 w-5" />
              <span>Start BrevEdu+ Today</span>
            </PrimaryButton>
            
            <p className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3 lg:mt-4">
              7-day free trial • Cancel anytime • $3.99/month
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpgradePromoSection;