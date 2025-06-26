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
      quote: "Skill Boosts helped me retain twice as much in just 5 minutes—without disrupting my workday.",
      name: "Sarah Chen",
      role: "Software Developer",
      rating: 5
    },
    {
      id: 2,
      quote: "Every Skill Boost introduces a fun new insight—this one gave me an interesting industry stat I never knew before.",
      name: "Marcus Rodriguez",
      role: "Product Manager",
      rating: 5
    },
    {
      id: 3,
      quote: "The AI chat practice is incredible! It's like having a personal tutor available 24/7. I've learned more new things in 2 weeks than I did in a year elsewhere.",
      name: "Emily Johnson",
      role: "UX Designer",
      rating: 5
    },
    {
      id: 4,
      quote: "As a busy guy, finding time to learn new skills was impossible. BrevEdu's micro-learning approach changed everything for me.",
      name: "David Park",
      role: "Marketing Specialist",
      rating: 5
    }
  ];

  return (
    <section className="px-4 sm:px-padding-medium py-6 sm:py-12">
      <div className="max-w-screen-2xl mx-auto">
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">What Our Learners Say</h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join thousands of learners who are transforming their skills with BrevEdu's 
            bite-sized learning approach and AI-powered practice sessions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-white rounded-[12px] p-3 sm:p-4 lg:p-padding-medium shadow-[0_2px_8px_rgba(0,0,0,0.1)] border border-gray-100 hover:border-[#002fa7]/30 transition-all duration-200"
              role="article"
              aria-labelledby={`testimonial-${testimonial.id}-name`}
            >
              <div className="flex items-center mb-2 sm:mb-3 lg:mb-4">
                <Quote className="h-5 w-5 text-[#002fa7] mr-2" />
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              
              <blockquote className="mb-3 sm:mb-4 lg:mb-6">
                <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                  "{testimonial.quote}"
                </p>
              </blockquote>
              
              <div className="mt-auto">
                <cite className="not-italic">
                  <p id={`testimonial-${testimonial.id}-name`} className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-1">
                    {testimonial.name}
                  </p>
                  <p className="text-sm sm:text-base text-[#FF7A59] font-medium">
                    {testimonial.role}
                  </p>
                </cite>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;