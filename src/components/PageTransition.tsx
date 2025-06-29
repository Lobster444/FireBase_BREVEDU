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
        return 'animate-page-slide-up duration-500 ease-mc';
      case 'scale':
        return 'animate-page-scale-in duration-300 ease-mc';
      case 'fade':
      default:
        return 'animate-page-fade-in duration-300 ease-mc';
    }
  };

  return (
    <div className={`${getAnimationClass()} ${className}`}>
      {children}
    </div>
  );
};

export default PageTransition;