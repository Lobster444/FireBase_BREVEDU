import React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  type?: 'fade' | 'slide' | 'scale';
}

const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  className = '',
  type = 'fade'
}) => {
  const getAnimationClass = () => {
    switch (type) {
      case 'slide':
        return 'animate-slide-up';
      case 'scale':
        return 'animate-scale-in';
      case 'fade':
      default:
        return 'animate-fade-in';
    }
  };

  return (
    <div className={`${getAnimationClass()} ${className}`}>
      {children}
    </div>
  );
};

export default PageTransition;