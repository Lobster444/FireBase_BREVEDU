import React from 'react';
import { Home, BookOpen, Crown, User, GraduationCap } from 'lucide-react';

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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-primary/90 backdrop-blur-ios border-t border-neutral-gray/20 z-50">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id || (currentPage === undefined && item.id === 'home');
          
          return (
            <a
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center p-3 min-w-[44px] min-h-[44px] ${
                isActive ? 'text-accent-yellow' : 'text-text-light'
              } transition-colors`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-x-small">{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavigation;