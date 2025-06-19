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
        bg-[#002fa7] text-white px-6 py-4 sm:py-3 rounded-headspace-lg font-medium text-base
        transition-[background-color_0.3s_ease-out,transform_0.2s_ease-out,box-shadow_0.3s_ease-out]
        hover:bg-[#0040d1] hover:shadow-[0_4px_12px_rgba(0,47,167,0.4)] hover:animate-[breathe_2s_infinite]
        active:bg-[#002080] active:scale-95
        disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed disabled:hover:bg-gray-300 disabled:hover:shadow-none disabled:active:scale-100 disabled:hover:animate-none
        focus:outline-none focus-visible:outline-2 focus-visible:outline-[#002fa7] focus-visible:outline-offset-2 focus-visible:animate-[breathe_2s_infinite]
        flex items-center justify-center
        ${className}
      `}
      style={{
        minHeight: '44px',
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
        bg-[#F8DE7E] text-white px-6 py-4 sm:py-3 rounded-headspace-lg font-medium text-base
        transition-[background-color_0.3s_ease-out,transform_0.2s_ease-out,box-shadow_0.3s_ease-out]
        hover:bg-[#F5D65A] hover:shadow-[0_4px_12px_rgba(248,222,126,0.4)] hover:animate-[breathe_2s_infinite]
        active:bg-[#F0D040] active:scale-95
        disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed disabled:hover:bg-gray-300 disabled:hover:shadow-none disabled:active:scale-100 disabled:hover:animate-none
        focus:outline-none focus-visible:outline-2 focus-visible:outline-[#F8DE7E] focus-visible:outline-offset-2 focus-visible:animate-[breathe_2s_infinite]
        flex items-center justify-center
        ${className}
      `}
      style={{
        minHeight: '44px',
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
        border: 'border-[#002fa7]',
        text: 'text-[#002fa7]',
        hoverBg: 'hover:bg-[#002fa7]',
        hoverText: 'hover:text-white',
        activeBg: 'bg-[#002fa7]',
        activeText: 'text-white',
        focusRing: 'focus-visible:ring-[rgba(0,47,167,0.4)]',
        hoverShadow: 'hover:shadow-[0_4px_12px_rgba(0,47,167,0.3)]'
      }
    : {
        border: 'border-[#F8DE7E]',
        text: 'text-[#F8DE7E]',
        hoverBg: 'hover:bg-[#F8DE7E]',
        hoverText: 'hover:text-gray-900',
        activeBg: 'bg-[#F8DE7E]',
        activeText: 'text-gray-900',
        focusRing: 'focus-visible:ring-[rgba(248,222,126,0.4)]',
        hoverShadow: 'hover:shadow-[0_4px_12px_rgba(248,222,126,0.3)]'
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
        px-4 py-4 sm:py-3 rounded-headspace-lg font-medium text-base border-2
        transition-[background-color_0.3s_ease-out,transform_0.2s_ease-out,box-shadow_0.3s_ease-out,border-color_0.3s_ease-out]
        hover:animate-[breathe_2s_infinite] active:scale-95
        ${active 
          ? `${variantClasses.activeBg} ${variantClasses.activeText} ${variantClasses.border} shadow-[0_2px_8px_rgba(0,0,0,0.1)]`
          : `bg-white ${variantClasses.text} ${variantClasses.border} ${variantClasses.hoverBg} ${variantClasses.hoverText} ${variantClasses.hoverShadow}`
        }
        disabled:border-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 disabled:hover:shadow-none disabled:hover:animate-none
        focus:outline-none focus-visible:outline-2 focus-visible:outline-[#002fa7] focus-visible:outline-offset-2 focus-visible:animate-[breathe_2s_infinite]
        flex items-center justify-center
        ${className}
      `}
      style={{
        minHeight: '44px',
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
        bg-gray-100 text-gray-800 px-6 py-4 sm:py-3 rounded-headspace-lg font-medium text-base
        border-2 border-gray-400
        transition-[background-color_0.3s_ease-out,transform_0.2s_ease-out,box-shadow_0.3s_ease-out]
        hover:bg-gray-200 hover:border-gray-500 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:animate-[breathe_2s_infinite]
        active:bg-gray-300 active:scale-95
        disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:bg-gray-100 disabled:hover:shadow-none disabled:active:scale-100 disabled:hover:animate-none
        focus:outline-none focus-visible:outline-2 focus-visible:outline-gray-400 focus-visible:outline-offset-2 focus-visible:animate-[breathe_2s_infinite]
        flex items-center justify-center
        ${className}
      `}
      style={{
        minHeight: '44px',
        animationTimingFunction: 'ease-in-out'
      }}
      {...props}
    >
      {icon && <span className="mr-2 flex items-center">{icon}</span>}
      {children}
    </button>
  );
};

// Danger/Negative Button (for destructive actions)
export const DangerButton: React.FC<BaseButtonProps> = ({
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
        bg-negative text-white px-6 py-4 sm:py-3 rounded-headspace-lg font-medium text-base
        transition-[background-color_0.3s_ease-out,transform_0.2s_ease-out,box-shadow_0.3s_ease-out]
        hover:bg-negative-hover hover:shadow-[0_4px_12px_rgba(239,68,68,0.4)] hover:animate-[breathe_2s_infinite]
        active:bg-negative-active active:scale-95
        disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed disabled:hover:bg-gray-300 disabled:hover:shadow-none disabled:active:scale-100 disabled:hover:animate-none
        focus:outline-none focus-visible:outline-2 focus-visible:outline-negative focus-visible:outline-offset-2 focus-visible:animate-[breathe_2s_infinite]
        flex items-center justify-center
        ${className}
      `}
      style={{
        minHeight: '44px',
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
        text-[#002fa7] hover:text-[#0040d1] 
        transition-[color_0.3s_ease-out,transform_0.2s_ease-out]
        underline underline-offset-4 font-medium px-2 py-4 sm:py-3 rounded-headspace-lg text-base
        hover:animate-[breathe_2s_infinite]
        disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:text-gray-500 disabled:hover:animate-none
        focus:outline-none focus-visible:outline-2 focus-visible:outline-[#002fa7] focus-visible:outline-offset-2 focus-visible:animate-[breathe_2s_infinite]
        flex items-center justify-center
        ${className}
      `}
      style={{
        minHeight: '44px',
        animationTimingFunction: 'ease-in-out'
      }}
      {...props}
    >
      {icon && <span className="mr-2 flex items-center">{icon}</span>}
      {children}
    </button>
  );
};

// Pill Toggle Button (Headspace-style) - Perfect implementation already exists
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
        inline-flex items-center justify-center px-4 py-2 rounded-headspace-md font-medium text-base
        transition-[background-color_0.3s_ease-out,color_0.3s_ease-out,transform_0.2s_ease-out,box-shadow_0.3s_ease-out]
        active:scale-95
        focus:outline-none focus-visible:outline-2 focus-visible:outline-[#002fa7] focus-visible:outline-offset-2
        ${active 
          ? 'bg-[#2D2C2B] text-white shadow-[0_2px_8px_rgba(45,44,43,0.3)]' 
          : 'bg-[#f6f5f8] text-[#002fa7] hover:bg-[#f0eff2] hover:animate-[breathe_2s_infinite] focus-visible:animate-[breathe_2s_infinite] shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
        }
        ${disabled ? 'pointer-events-none opacity-60 cursor-not-allowed' : ''}
        ${className}
      `}
      style={{
        minHeight: '44px',
        animationTimingFunction: 'ease-in-out'
      }}
    >
      {/* Active dot indicator - only shown when active */}
      {active && (
        <span 
          className="h-2 w-2 bg-white rounded-full mr-2 flex-shrink-0"
          aria-hidden="true"
        />
      )}
      
      {/* Label text */}
      <span className="font-medium leading-none">
        {label}
      </span>
    </button>
  );
};