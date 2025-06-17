import React from 'react';
import { Home, BookOpen, Crown, User } from 'lucide-react';

interface MobileNavigationProps {
  currentPage?: string;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ currentPage }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home', href: '/' },
    { id: 'courses', icon: BookOpen, label: 'Courses', href: '/courses' },
    { id: 'brevedu-plus', icon: Crown, label: 'BrevEdu+', href: '/brevedu-plus' },
    { id: 'profile', icon: User, label: 'Profile', href: '/profile' },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-50 shadow-[0_-2px_8px_rgba(0,0,0,0.1)]">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id || (currentPage === undefined && item.id === 'home');
          
          return (
            <a
              key={item.id}
              href={item.href}
              className={`
                flex flex-col items-center justify-center p-3 min-w-[60px] min-h-[60px] rounded-[12px] transition-all duration-200 ease-out
                hover:bg-[#FF7A59]/10 hover:animate-[breathe_2s_infinite]
                focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FF7A59] focus-visible:ring-opacity-40 focus-visible:ring-offset-2 focus-visible:ring-offset-white
                ${isActive 
                  ? 'text-[#FF7A59] bg-[#FF7A59]/10' 
                  : 'text-gray-600 hover:text-[#FF7A59]'
                }
              `}
              style={{
                animationTimingFunction: 'ease-in-out'
              }}
              aria-label={`Navigate to ${item.label}`}
            >
              <Icon className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavigation;