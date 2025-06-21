import React from 'react';
import { Quote, Star, Sparkles } from 'lucide-react';
import { PrimaryButton, AccentButton } from './UIButtons';
import { User } from '../types';

interface TestimonialsSectionProps {
  currentUser: User | null;
  onStartLearning: () => void;
  onUpgrade: () => void;
  onExploreCourses: () => void;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  currentUser,
  onStartLearning,
  onUpgrade,
  onExploreCourses
}) => {
  // Hard-coded testimonials data
  const testimonials = [
    {
      id: 1,
      quote: "BrevEdu transformed how I learn! The 5-minute lessons fit perfectly into my busy schedule, and the AI practice sessions really help reinforce what I've learned.",
      name: "Sarah Chen",
      role: "Software Developer",
      rating: 5
    },
    {
      id: 2,
      quote: "I've tried many learning platforms, but BrevEdu's bite-sized approach is genius. I can learn during my commute and actually retain the information.",
      name: "Marcus Rodriguez",
      role: "Product Manager",
      rating: 5
    },
    {
      id: 3,
      quote: "The AI chat practice is incredible! It's like having a personal tutor available 24/7. I've learned more in 3 months than I did in a year elsewhere.",
      name: "Emily Johnson",
      role: "UX Designer",
      rating: 5
    },
    {
      id: 4,
      quote: "As a busy parent, finding time to learn new skills was impossible. BrevEdu's micro-learning approach changed everything for me.",
      name: "David Park",
      role: "Marketing Specialist",
      rating: 5
    }
  ];

  return (
    <section className="px-padding-medium py-12 bg-gray-50">
      <div className="max-w-screen-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Learners Say</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Join thousands of learners who are transforming their skills with BrevEdu's 
            bite-sized learning approach and AI-powered practice sessions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-white rounded-[12px] p-padding-medium shadow-[0_2px_8px_rgba(0,0,0,0.1)] border border-gray-100 hover:border-[#FF7A59]/30 transition-all duration-200"
              role="article"
              aria-labelledby={`testimonial-${testimonial.id}-name`}
                </div>
                <cite className="not-italic">
                  <p id={`testimonial-${testimonial.id}-name`} className="text-base font-semibold text-gray-900 mb-1">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-[#FF7A59] font-medium">
                    {testimonial.role}
                  </p>
                </cite>
              </div>
            </div>
          ))}
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-700 mb-6">
            Ready to join our community of successful learners?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!currentUser ? (
              <>
                <AccentButton 
                  className="px-8 py-4"
                  onClick={onStartLearning}
                  aria-label="Sign up for free account to start learning"
                >
                  Start Learning Free
                </AccentButton>
                <PrimaryButton 
                  className="px-8 py-4 flex items-center justify-center space-x-2"
                  onClick={onUpgrade}
                  aria-label="Try BrevEdu+ premium subscription with free trial"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>Try BrevEdu+ Free</span>
                </PrimaryButton>
              </>
            ) : currentUser.role === 'free' ? (
              <PrimaryButton 
                className="px-8 py-4 flex items-center justify-center space-x-2"
                onClick={onUpgrade}
                aria-label="Upgrade to BrevEdu+ premium subscription"
              >
                <Sparkles className="h-5 w-5" />
                <span>Upgrade to Premium</span>
              </PrimaryButton>
            ) : (
              <AccentButton 
                className="px-8 py-4"
                onClick={onExploreCourses}
                aria-label="Explore more premium courses"
              >
                Explore More Courses
              </AccentButton>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;