import React from 'react';
import { Quotes, Star } from '@phosphor-icons/react';
import { User } from '../types';
import './testimonials.css';

interface TestimonialsSectionProps {
  currentUser: User | null;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  currentUser
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
    <section className="px-4 sm:px-8 md:px-12 py-12 sm:py-16 lg:py-24 bg-white">
      <div className="max-w-screen-2xl mx-auto">
        <div className="text-center mb-10 sm:mb-14 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-6 sm:mb-8">What Our Learners Say</h2>
          <p className="text-xl sm:text-2xl lg:text-3xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Join thousands of learners who are transforming their skills with BrevEdu's 
            bite-sized learning approach and AI-powered practice sessions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-grey rounded-[1.2rem] p-6 sm:p-7 lg:p-8 shadow-md border border-black/5 hover:border-cobalt/20 hover:shadow-lg transition-all duration-300"
              role="article"
              aria-labelledby={`testimonial-${testimonial.id}-name`}
            >
              <div className="flex items-center mb-4 sm:mb-5 lg:mb-6">
                <Quotes className="h-6 w-6 text-cobalt mr-3" />
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 star-icon" weight="fill" />
                  ))}
                </div>
              </div>
              
              <blockquote className="mb-5 sm:mb-6 lg:mb-8">
                <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed">
                  "{testimonial.quote}"
                </p>
              </blockquote>
              
              <div className="mt-auto">
                <cite className="not-italic">
                  <p id={`testimonial-${testimonial.id}-name`} className="text-base sm:text-lg lg:text-xl font-semibold text-black mb-2">
                    {testimonial.name}
                  </p>
                  <p className="text-sm sm:text-lg text-cobalt font-medium">
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