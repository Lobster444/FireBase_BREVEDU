import React from 'react';
import { MessageCircle } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
              <MessageCircle className="h-5 w-5 text-black" />
            </div>
            <span className="text-xl font-bold">BreVedu</span>
          </div>
          
          <div className="flex flex-wrap gap-6 justify-center">
            <a href="#" className="text-white/80 hover:text-white transition-colors">About</a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">Courses</a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">Pricing</a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">Contact</a>
          </div>
          
          <p className="text-white/60 text-sm">
            © 2025 BreVedu. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;