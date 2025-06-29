import React from 'react';
import { Quote, Star } from 'lucide-react';
import { User } from '../types';

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
    <section className="px-4 sm:px-padding-medium py-6 sm:py-12 bg-white">
      <div className="max-w-screen-2xl mx-auto">
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">What Our Learners Say</h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join thousands of learners who are transforming their skills with BrevEdu's 
            bite-sized learning approach and AI-powered practice sessions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-grey rounded-[1.2rem] p-4 sm:p-5 lg:p-6 shadow-md border border-black/5 hover:border-cobalt/20 hover:shadow-lg transition-all duration-300"
              role="article"
              aria-labelledby={`testimonial-${testimonial.id}-name`}
            >
              <div className="flex items-center mb-3 sm:mb-4 lg:mb-5">
                <Quote className="h-5 w-5 text-cobalt mr-2" />
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-hyper-yellow fill-current" />
                  ))}
                </div>
              </div>
              
              <blockquote className="mb-4 sm:mb-5 lg:mb-6">
                <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                  "{testimonial.quote}"
                </p>
              </blockquote>
              
              <div className="mt-auto">
                <cite className="not-italic">
                  <p id={`testimonial-${testimonial.id}-name`} className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-1">
                    {testimonial.name}
                  </p>
                  <p className="text-sm sm:text-base text-cobalt font-medium">
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