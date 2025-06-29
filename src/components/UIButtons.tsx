// Wrapper components for backward compatibility with specific variants
import React from 'react';
import { Button, LinkButton, PillToggleButton, IconButton } from './Button';

// Re-export components that don't have duplicates
export { LinkButton, PillToggleButton, IconButton } from './Button';

// Wrapper components with specific variants for backward compatibility
export const PrimaryButton: React.FC<React.ComponentProps<typeof Button>> = (props) => (
  <Button variant="primary" {...props} />
);

export const AccentButton: React.FC<React.ComponentProps<typeof Button>> = (props) => (
  <Button variant="accent" {...props} />
);

export const SecondaryButton: React.FC<React.ComponentProps<typeof Button>> = (props) => (
  <Button variant="secondary" {...props} />
);

export const DangerButton: React.FC<React.ComponentProps<typeof Button>> = (props) => (
  <Button variant="danger" {...props} />
);

// Outline Button for backward compatibility
interface OutlineButtonProps extends React.ComponentProps<typeof Button> {
  variant?: 'cobalt' | 'yellow';
  active?: boolean;
}

export const OutlineButton: React.FC<OutlineButtonProps> = ({ 
  variant: outlineVariant = 'cobalt', 
  active = false, 
  className = '',
  children,
  ...props 
}) => {
  const buttonVariant = active ? 'primary' : 'ghost';
  const variantClasses = outlineVariant === 'yellow' && active 
    ? 'bg-hyper-yellow text-black hover:bg-[#ffed4d]' 
    : '';
  
  return (
    <Button 
      variant={buttonVariant} 
      className={`border-2 ${outlineVariant === 'cobalt' ? 'border-cobalt' : 'border-hyper-yellow'} ${variantClasses} ${className}`}
      aria-pressed={active}
      {...props}
    >
      {children}
    </Button>
  );
};