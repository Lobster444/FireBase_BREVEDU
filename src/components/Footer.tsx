import React from 'react';
import { MessageCircle } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 py-10 sm:py-16">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-4">
              <MessageCircle className="h-6 w-6 text-black" />
            </div>
            <span className="text-2xl font-bold">BreVedu</span>
          </div>
          
          <div className="flex flex-wrap gap-8 justify-center my-6 sm:my-0">
            <a href="#" className="text-white/80 hover:text-white transition-colors text-lg">About</a>
            <a href="#" className="text-white/80 hover:text-white transition-colors text-lg">Courses</a>
            <a href="#" className="text-white/80 hover:text-white transition-colors text-lg">Pricing</a>
            <a href="#" className="text-white/80 hover:text-white transition-colors text-lg">Contact</a>
          </div>
          
          <p className="text-white/60 text-base">
            © 2025 BreVedu. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;