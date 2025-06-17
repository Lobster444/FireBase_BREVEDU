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
        disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed disabled:hover:bg-gray-300 disabled:hover:shadow-none disabled:active:scale-100 disabled:hover:animate-none
        focus:outline-none focus:ring-2 focus:ring-[rgba(255,122,89,0.5)] focus:ring-offset-2 focus:ring-offset-white focus:animate-[breathe_2s_infinite]
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
        bg-[#F5C842] text-gray-900 px-6 py-4 sm:py-3 rounded-[10px] font-medium
        transition-[background-color_0.3s_ease-out,transform_0.2s_ease-out,box-shadow_0.3s_ease-out]
        hover:bg-[#F2C94C] hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:animate-[breathe_2s_infinite]
        active:bg-[#E6B800] active:scale-95
        disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed disabled:hover:bg-gray-300 disabled:hover:shadow-none disabled:active:scale-100 disabled:hover:animate-none
        focus:outline-none focus:ring-2 focus:ring-[rgba(245,200,66,0.5)] focus:ring-offset-2 focus:ring-offset-white focus:animate-[breathe_2s_infinite]
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
        border: 'border-[#FF7A59]',
        text: 'text-[#FF7A59]',
        hoverBg: 'hover:bg-[#FF7A59]',
        hoverText: 'hover:text-white',
        activeBg: 'bg-[#FF7A59]',
        activeText: 'text-white',
        focusRing: 'focus:ring-[rgba(255,122,89,0.5)]'
      }
    : {
        border: 'border-[#F5C842]',
        text: 'text-[#F5C842]',
        hoverBg: 'hover:bg-[#F5C842]',
        hoverText: 'hover:text-gray-900',
        activeBg: 'bg-[#F5C842]',
        activeText: 'text-gray-900',
        focusRing: 'focus:ring-[rgba(245,200,66,0.5)]'
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
          : `bg-white ${variantClasses.text} ${variantClasses.border} ${variantClasses.hoverBg} ${variantClasses.hoverText}`
        }
        disabled:border-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 disabled:hover:shadow-none disabled:hover:animate-none
        focus:outline-none focus:ring-2 focus:ring-offset-2 ${variantClasses.focusRing} focus:ring-offset-white focus:animate-[breathe_2s_infinite]
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
        bg-gray-100 text-gray-800 px-6 py-4 sm:py-3 rounded-[10px] font-medium
        border border-gray-200
        transition-[background-color_0.3s_ease-out,transform_0.2s_ease-out,box-shadow_0.3s_ease-out]
        hover:bg-gray-200 hover:border-gray-300 hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:animate-[breathe_2s_infinite]
        active:bg-gray-300 active:scale-95
        disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:bg-gray-100 disabled:hover:shadow-none disabled:active:scale-100 disabled:hover:animate-none
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 focus:ring-offset-white focus:animate-[breathe_2s_infinite]
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
        text-[#FF7A59] hover:text-[#FF8A6B] 
        transition-[color_0.3s_ease-out,transform_0.2s_ease-out]
        underline underline-offset-4 font-medium px-2 py-4 sm:py-3 rounded-[10px]
        hover:animate-[breathe_2s_infinite]
        disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:text-gray-500 disabled:hover:animate-none
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgba(255,122,89,0.5)] focus:ring-offset-white focus:animate-[breathe_2s_infinite]
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

// Pill Toggle Button (Headspace-style)
interface PillToggleButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

export const PillToggleButton: React.FC<PillToggleButtonProps> = ({
  label,
  active,
  onClick,
  disabled = false,
  className = '',
  'aria-label': ariaLabel,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      aria-label={ariaLabel || label}
      aria-disabled={disabled}
      className={`
        inline-flex items-center justify-center px-6 py-3 rounded-full font-medium
        transition-[background-color_0.3s_ease-out,color_0.3s_ease-out,transform_0.2s_ease-out,box-shadow_0.3s_ease-out]
        hover:animate-[breathe_2s_infinite] focus:animate-[breathe_2s_infinite]
        active:scale-95
        focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FF7A59] focus-visible:ring-opacity-50 focus-visible:ring-offset-2 focus-visible:ring-offset-white
        disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:animate-none disabled:active:scale-100
        ${active 
          ? 'bg-gray-900 text-white shadow-[0_2px_8px_rgba(0,0,0,0.2)]' 
          : 'bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
        }
        ${className}
      `}
      style={{
        minHeight: '44px',
        animationTimingFunction: 'ease-in-out'
      }}
    >
      {/* Active dot indicator */}
      {active && (
        <span 
          className="h-2 w-2 bg-white rounded-full mr-3 flex-shrink-0"
          aria-hidden="true"
        />
      )}
      
      {/* Label text */}
      <span className="font-medium text-base leading-none">
        {label}
      </span>
    </button>
  );
};