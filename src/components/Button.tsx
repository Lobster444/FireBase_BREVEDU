import React from 'react';
import { LucideIcon } from 'lucide-react';

interface BaseButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  'aria-label'?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost';
  fullWidth?: boolean;
  loading?: boolean;
}

/**
 * Standardized Button Component
 * Uses consistent border-radius (1.2rem), font styles, and sizing
 */
export const Button: React.FC<BaseButtonProps> = ({
  children,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  'aria-label': ariaLabel,
  icon: Icon,
  iconPosition = 'left',
  size = 'md',
  variant = 'primary',
  fullWidth = false,
  loading = false,
  ...props
}) => {
  // Base styles - consistent across all buttons
  const baseStyles = `
    inline-flex items-center justify-center
    rounded-[1.2rem] font-medium
    transition-all duration-300 ease-mc
    focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
    active:scale-95
    min-h-[44px]
    ${fullWidth ? 'w-full' : ''}
  `;

  // Size variants
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  // Color variants
  const variantStyles = {
    primary: `
      bg-cobalt text-white
      hover:bg-[#4a4fd9] hover:shadow-[0_4px_12px_rgba(59,66,196,0.4)]
      focus-visible:outline-cobalt
      shadow-[0_2px_8px_rgba(59,66,196,0.3)]
    `,
    secondary: `
      bg-grey text-gray-800 border border-gray-400
      hover:bg-[#e0e5e0] hover:border-gray-500 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]
      focus-visible:outline-gray-400
      shadow-md
    `,
    accent: `
      bg-hyper-yellow text-black
      hover:bg-[#ffed4d] hover:shadow-[0_4px_12px_rgba(255,241,0,0.4)]
      focus-visible:outline-hyper-yellow
      shadow-lg
    `,
    danger: `
      bg-red text-white
      hover:bg-red-600 hover:shadow-[0_4px_12px_rgba(255,0,0,0.3)]
      focus-visible:outline-red
      shadow-[0_2px_8px_rgba(255,0,0,0.3)]
    `,
    ghost: `
      bg-transparent text-gray-700 border border-gray-300
      hover:bg-gray-50 hover:border-gray-400
      focus-visible:outline-gray-400
    `
  };

  const combinedClassName = `
    ${baseStyles}
    ${sizeStyles[size]}
    ${variantStyles[variant]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      className={combinedClassName}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      )}
      
      {Icon && iconPosition === 'left' && !loading && (
        <Icon className="h-5 w-5 mr-2" />
      )}
      
      {children}
      
      {Icon && iconPosition === 'right' && !loading && (
        <Icon className="h-5 w-5 ml-2" />
      )}
    </button>
  );
};

/**
 * Icon Button Component
 * For buttons that only contain an icon
 */
interface IconButtonProps {
  icon: LucideIcon;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  'aria-label': string;
  variant?: 'gray' | 'primary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  onClick,
  disabled = false,
  'aria-label': ariaLabel,
  variant = 'gray',
  size = 'md',
  className = ''
}) => {
  const baseStyles = `
    inline-flex items-center justify-center
    rounded-[0.8rem]
    transition-all duration-300 ease-mc
    focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-95
  `;

  const sizeStyles = {
    sm: 'p-1.5 min-w-[36px] min-h-[36px]',
    md: 'p-2 min-w-[44px] min-h-[44px]',
    lg: 'p-3 min-w-[52px] min-h-[52px]'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const variantStyles = {
    gray: `
      text-gray-400 hover:text-gray-600 hover:bg-gray-50
      focus-visible:outline-gray-400
    `,
    primary: `
      text-cobalt hover:text-[#4a4fd9] hover:bg-cobalt/10
      focus-visible:outline-cobalt
    `,
    danger: `
      text-red hover:text-red-600 hover:bg-red-50
      focus-visible:outline-red
    `
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      <Icon className={iconSizes[size]} />
    </button>
  );
};

/**
 * Link Button Component
 * For buttons that look like links
 */
interface LinkButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

export const LinkButton: React.FC<LinkButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = '',
  'aria-label': ariaLabel
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        text-cobalt hover:text-[#4a4fd9] 
        transition-colors duration-300 ease-mc
        underline underline-offset-4 font-medium
        px-2 py-1 rounded-[0.8rem]
        disabled:text-gray-500 disabled:cursor-not-allowed
        focus:outline-none focus-visible:outline-2 focus-visible:outline-cobalt focus-visible:outline-offset-2
        min-h-[44px] flex items-center justify-center
        ${className}
      `}
    >
      {children}
    </button>
  );
};

/**
 * Pill Toggle Button Component
 * For filter/toggle functionality
 */
interface PillToggleButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export const PillToggleButton: React.FC<PillToggleButtonProps> = ({
  label,
  active,
  onClick,
  disabled = false,
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={`
        inline-flex items-center justify-center
        px-4 py-2 rounded-[0.8rem] font-medium text-base
        transition-all duration-300 ease-mc
        active:scale-95
        focus:outline-none focus-visible:outline-2 focus-visible:outline-cobalt focus-visible:outline-offset-2
        min-h-[44px]
        ${active 
          ? 'bg-black text-white shadow-[0_2px_8px_rgba(0,0,0,0.3)]' 
          : 'bg-grey text-cobalt hover:bg-[#e0e5e0] shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
        }
        ${disabled ? 'pointer-events-none opacity-60 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {active && (
        <span className="h-2 w-2 bg-white rounded-full mr-2 flex-shrink-0" />
      )}
      <span className="font-medium leading-none">{label}</span>
    </button>
  );
};