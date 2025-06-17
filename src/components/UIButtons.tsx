import React from 'react';

interface BaseButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
}

// Primary Button (Purple Filled)
export const PrimaryButton: React.FC<BaseButtonProps> = ({
  onClick,
  disabled = false,
  children,
  className = '',
  type = 'button',
  'aria-label': ariaLabel,
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        bg-accent-purple text-text-dark px-6 py-3 rounded-full text-body font-medium
        transition-all duration-200 shadow-button
        hover:bg-accent-purple-dark hover:shadow-lg
        active:bg-accent-purple-dark/80 active:scale-95
        disabled:bg-neutral-gray disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neutral-gray disabled:hover:shadow-button disabled:active:scale-100
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-purple focus:ring-offset-primary
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

// Accent Button (Yellow Filled)
export const AccentButton: React.FC<BaseButtonProps> = ({
  onClick,
  disabled = false,
  children,
  className = '',
  type = 'button',
  'aria-label': ariaLabel,
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        bg-accent-yellow text-text-dark px-6 py-3 rounded-full text-body font-medium
        transition-all duration-200 shadow-button
        hover:bg-accent-yellow-dark hover:shadow-lg
        active:bg-accent-yellow-dark/80 active:scale-95
        disabled:bg-neutral-gray disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neutral-gray disabled:hover:shadow-button disabled:active:scale-100
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-yellow focus:ring-offset-primary
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

// Outline Button (Filters/Toggles)
interface OutlineButtonProps extends BaseButtonProps {
  variant?: 'purple' | 'yellow';
  active?: boolean;
}

export const OutlineButton: React.FC<OutlineButtonProps> = ({
  onClick,
  disabled = false,
  children,
  className = '',
  type = 'button',
  variant = 'purple',
  active = false,
  'aria-label': ariaLabel,
  ...props
}) => {
  const variantClasses = variant === 'purple' 
    ? {
        border: 'border-accent-purple',
        text: 'text-accent-purple',
        hoverBg: 'hover:bg-accent-purple',
        hoverText: 'hover:text-text-dark',
        activeBg: 'bg-accent-purple',
        activeText: 'text-text-dark',
        focusRing: 'focus:ring-accent-purple'
      }
    : {
        border: 'border-accent-yellow',
        text: 'text-accent-yellow',
        hoverBg: 'hover:bg-accent-yellow',
        hoverText: 'hover:text-text-dark',
        activeBg: 'bg-accent-yellow',
        activeText: 'text-text-dark',
        focusRing: 'focus:ring-accent-yellow'
      };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        px-4 py-2 rounded-lg text-small font-medium border-2
        transition-all duration-200
        ${active 
          ? `${variantClasses.activeBg} ${variantClasses.activeText} ${variantClasses.border}` 
          : `bg-transparent ${variantClasses.text} ${variantClasses.border} ${variantClasses.hoverBg} ${variantClasses.hoverText}`
        }
        disabled:border-neutral-gray disabled:text-neutral-gray disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-neutral-gray
        focus:outline-none focus:ring-2 focus:ring-offset-2 ${variantClasses.focusRing} focus:ring-offset-primary
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

// Secondary Button (Neutral/Gray)
export const SecondaryButton: React.FC<BaseButtonProps> = ({
  onClick,
  disabled = false,
  children,
  className = '',
  type = 'button',
  'aria-label': ariaLabel,
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        bg-neutral-gray/20 text-text-light px-6 py-3 rounded-full text-body font-medium
        border border-neutral-gray/30
        transition-all duration-200
        hover:bg-neutral-gray/30 hover:border-neutral-gray/50
        active:bg-neutral-gray/40 active:scale-95
        disabled:bg-neutral-gray/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neutral-gray/10 disabled:active:scale-100
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-gray focus:ring-offset-primary
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

// Link Button (looks like a link but behaves like a button)
export const LinkButton: React.FC<BaseButtonProps> = ({
  onClick,
  disabled = false,
  children,
  className = '',
  type = 'button',
  'aria-label': ariaLabel,
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        text-accent-yellow hover:text-accent-yellow-dark transition-colors
        underline underline-offset-4 text-body font-medium
        disabled:text-neutral-gray disabled:cursor-not-allowed disabled:hover:text-neutral-gray
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-yellow focus:ring-offset-primary rounded
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};