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

// Primary Button (ManyChat Cobalt)
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
        bg-cobalt text-white px-6 py-4 sm:py-3 rounded-[1.2rem] font-medium text-base
        transition-all duration-300 ease-mc
        hover:bg-[#4a4fd9] hover:shadow-[0_4px_12px_rgba(59,66,196,0.4)] 
        active:bg-[#2f35a0] active:scale-95
        disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed disabled:hover:bg-gray-300 disabled:hover:shadow-none disabled:active:scale-100
        focus:outline-none focus-visible:outline-2 focus-visible:outline-cobalt focus-visible:outline-offset-2
        flex items-center justify-center
        ${className}
      `}
      style={{
        minHeight: '44px',
      }}
      {...props}
    >
      {icon && <span className="mr-2 flex items-center">{icon}</span>}
      {children}
    </button>
  );
};

// Accent Button (Hyper Yellow Filled)
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
        bg-hyper-yellow text-black px-6 py-4 sm:py-3 rounded-[1.2rem] font-semibold text-base
        transition-all duration-300 ease-mc
        hover:bg-[#ffed4d] hover:shadow-[0_4px_12px_rgba(255,241,0,0.4)]
        active:bg-[#e6d900] active:scale-95
        disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed disabled:hover:bg-gray-300 disabled:hover:shadow-none disabled:active:scale-100
        focus:outline-none focus-visible:outline-2 focus-visible:outline-hyper-yellow focus-visible:outline-offset-2
        flex items-center justify-center
        ${className}
      `}
      style={{
        minHeight: '44px',
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
  variant?: 'cobalt' | 'yellow';
  active?: boolean;
}

export const OutlineButton: React.FC<OutlineButtonProps> = ({
  onClick,
  disabled = false,
  children,
  className = '',
  type = 'button',
  variant = 'cobalt',
  active = false,
  'aria-label': ariaLabel,
  icon,
  ...props
}) => {
  const variantClasses = variant === 'cobalt' 
    ? {
        border: 'border-cobalt',
        text: 'text-cobalt',
        hoverBg: 'hover:bg-cobalt',
        hoverText: 'hover:text-white',
        activeBg: 'bg-cobalt',
        activeText: 'text-white',
        focusRing: 'focus-visible:ring-[rgba(59,66,196,0.4)]',
        hoverShadow: 'hover:shadow-[0_4px_12px_rgba(59,66,196,0.3)]'
      }
    : {
        border: 'border-hyper-yellow',
        text: 'text-hyper-yellow',
        hoverBg: 'hover:bg-hyper-yellow',
        hoverText: 'hover:text-gray-900',
        activeBg: 'bg-hyper-yellow',
        activeText: 'text-gray-900',
        focusRing: 'focus-visible:ring-[rgba(255,241,0,0.4)]',
        hoverShadow: 'hover:shadow-[0_4px_12px_rgba(255,241,0,0.3)]'
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
        px-4 py-4 sm:py-3 rounded-[1.2rem] font-medium text-base border-2
        transition-all duration-300 ease-mc
        active:scale-95
        ${active 
          ? `${variantClasses.activeBg} ${variantClasses.activeText} ${variantClasses.border} shadow-[0_2px_8px_rgba(0,0,0,0.1)]`
          : `bg-white ${variantClasses.text} ${variantClasses.border} ${variantClasses.hoverBg} ${variantClasses.hoverText} ${variantClasses.hoverShadow}`
        }
        disabled:border-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 disabled:hover:shadow-none
        focus:outline-none focus-visible:outline-2 focus-visible:outline-cobalt focus-visible:outline-offset-2
        flex items-center justify-center
        ${className}
      `}
      style={{
        minHeight: '44px',
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
        bg-grey text-gray-800 px-6 py-4 sm:py-3 rounded-[1.2rem] font-medium text-base
        border border-gray-400
        transition-all duration-300 ease-mc
        hover:bg-[#e0e5e0] hover:border-gray-500 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]
        active:bg-[#d4d9d4] active:scale-95
        disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:bg-gray-100 disabled:hover:shadow-none disabled:active:scale-100
        focus:outline-none focus-visible:outline-2 focus-visible:outline-gray-400 focus-visible:outline-offset-2
        flex items-center justify-center
        ${className}
      `}
      style={{
        minHeight: '44px',
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
        bg-red text-white px-6 py-4 sm:py-3 rounded-[1.2rem] font-medium text-base
        transition-all duration-300 ease-mc
        hover:bg-[#e60000] hover:shadow-[0_4px_12px_rgba(255,0,0,0.3)]
        active:bg-[#cc0000] active:scale-95
        disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed disabled:hover:bg-gray-300 disabled:hover:shadow-none disabled:active:scale-100
        focus:outline-none focus-visible:outline-2 focus-visible:outline-red focus-visible:outline-offset-2
        flex items-center justify-center
        ${className}
      `}
      style={{
        minHeight: '44px',
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
        text-cobalt hover:text-[#4a4fd9] 
        transition-all duration-300 ease-mc
        underline underline-offset-4 font-medium px-2 py-4 sm:py-3 rounded-headspace-lg text-base
        disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:text-gray-500
        focus:outline-none focus-visible:outline-2 focus-visible:outline-cobalt focus-visible:outline-offset-2
        flex items-center justify-center
        ${className}
      `}
      style={{
        minHeight: '44px',
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
        inline-flex items-center justify-center px-4 py-2 rounded-[0.8rem] font-medium text-base
        transition-all duration-300 ease-mc
        active:scale-95
        focus:outline-none focus-visible:outline-2 focus-visible:outline-cobalt focus-visible:outline-offset-2
        ${active 
          ? 'bg-black text-white shadow-[0_2px_8px_rgba(0,0,0,0.3)]' 
          : 'bg-[#f6f5f8] text-cobalt hover:bg-[#f0eff2] shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
        }
        ${disabled ? 'pointer-events-none opacity-60 cursor-not-allowed' : ''}
        ${className}
      `}
      style={{
        minHeight: '44px',
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