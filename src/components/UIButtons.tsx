import React from 'react';

interface BaseButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
  icon?: React.ReactNode;
}

// Primary Button (Headspace Orange)
export const PrimaryButton: React.FC<BaseButtonProps> = ({
  onClick,
  disabled = false,
  children,
  className = '',
  type = 'button',
  'aria-label': ariaLabel,
  icon,
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      className={`
        bg-[#FF7A59] text-white px-6 py-4 sm:py-3 rounded-[10px] font-medium
        transition-[background-color_0.3s_ease-out,transform_0.2s_ease-out,box-shadow_0.3s_ease-out]
        hover:bg-[#FF8A6B] hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:animate-[breathe_2s_infinite]
        active:bg-[#E6694F] active:scale-95
        disabled:bg-[#e0e0e0] disabled:text-[#888] disabled:cursor-not-allowed disabled:hover:bg-[#e0e0e0] disabled:hover:shadow-none disabled:active:scale-100 disabled:hover:animate-none
        focus:outline-none focus:ring-2 focus:ring-[rgba(255,122,89,0.5)] focus:ring-offset-2 focus:ring-offset-primary focus:animate-[breathe_2s_infinite]
        flex items-center justify-center
        ${className}
      `}
      style={{
        animationTimingFunction: 'ease-in-out'
      }}
      {...props}
    >
      {icon && <span className="mr-2 flex items-center">{icon}</span>}
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
  icon,
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      className={`
        bg-accent-yellow text-text-dark px-6 py-4 sm:py-3 rounded-[10px] font-medium
        transition-[background-color_0.3s_ease-out,transform_0.2s_ease-out,box-shadow_0.3s_ease-out]
        hover:bg-accent-yellow-dark hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:animate-[breathe_2s_infinite]
        active:bg-accent-yellow-dark/80 active:scale-95
        disabled:bg-[#e0e0e0] disabled:text-[#888] disabled:cursor-not-allowed disabled:hover:bg-[#e0e0e0] disabled:hover:shadow-none disabled:active:scale-100 disabled:hover:animate-none
        focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 focus:ring-offset-2 focus:ring-offset-primary focus:animate-[breathe_2s_infinite]
        flex items-center justify-center
        ${className}
      `}
      style={{
        animationTimingFunction: 'ease-in-out'
      }}
      {...props}
    >
      {icon && <span className="mr-2 flex items-center">{icon}</span>}
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
  icon,
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
        focusRing: 'focus:ring-accent-purple/50'
      }
    : {
        border: 'border-accent-yellow',
        text: 'text-accent-yellow',
        hoverBg: 'hover:bg-accent-yellow',
        hoverText: 'hover:text-text-dark',
        activeBg: 'bg-accent-yellow',
        activeText: 'text-text-dark',
        focusRing: 'focus:ring-accent-yellow/50'
      };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      aria-pressed={active}
      className={`
        px-4 py-4 sm:py-3 rounded-[10px] font-medium border-2
        transition-[background-color_0.3s_ease-out,transform_0.2s_ease-out,box-shadow_0.3s_ease-out]
        hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:animate-[breathe_2s_infinite]
        active:scale-95
        ${active 
          ? `${variantClasses.activeBg} ${variantClasses.activeText} ${variantClasses.border}` 
          : `bg-transparent ${variantClasses.text} ${variantClasses.border} ${variantClasses.hoverBg} ${variantClasses.hoverText}`
        }
        disabled:border-[#e0e0e0] disabled:text-[#888] disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#888] disabled:hover:shadow-none disabled:hover:animate-none
        focus:outline-none focus:ring-2 focus:ring-offset-2 ${variantClasses.focusRing} focus:ring-offset-primary focus:animate-[breathe_2s_infinite]
        flex items-center justify-center
        ${className}
      `}
      style={{
        animationTimingFunction: 'ease-in-out'
      }}
      {...props}
    >
      {icon && <span className="mr-2 flex items-center">{icon}</span>}
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
  icon,
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      className={`
        bg-neutral-gray/20 text-text-light px-6 py-4 sm:py-3 rounded-[10px] font-medium
        border border-neutral-gray/30
        transition-[background-color_0.3s_ease-out,transform_0.2s_ease-out,box-shadow_0.3s_ease-out]
        hover:bg-neutral-gray/30 hover:border-neutral-gray/50 hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:animate-[breathe_2s_infinite]
        active:bg-neutral-gray/40 active:scale-95
        disabled:bg-[#e0e0e0] disabled:text-[#888] disabled:cursor-not-allowed disabled:hover:bg-[#e0e0e0] disabled:hover:shadow-none disabled:active:scale-100 disabled:hover:animate-none
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-gray/50 focus:ring-offset-primary focus:animate-[breathe_2s_infinite]
        flex items-center justify-center
        ${className}
      `}
      style={{
        animationTimingFunction: 'ease-in-out'
      }}
      {...props}
    >
      {icon && <span className="mr-2 flex items-center">{icon}</span>}
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
  icon,
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      className={`
        text-accent-yellow hover:text-accent-yellow-dark 
        transition-[color_0.3s_ease-out,transform_0.2s_ease-out]
        underline underline-offset-4 font-medium px-2 py-4 sm:py-3 rounded-[10px]
        hover:animate-[breathe_2s_infinite]
        disabled:text-[#888] disabled:cursor-not-allowed disabled:hover:text-[#888] disabled:hover:animate-none
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-yellow/50 focus:ring-offset-primary focus:animate-[breathe_2s_infinite]
        flex items-center justify-center
        ${className}
      `}
      style={{
        animationTimingFunction: 'ease-in-out'
      }}
      {...props}
    >
      {icon && <span className="mr-2 flex items-center">{icon}</span>}
      {children}
    </button>
  );
};