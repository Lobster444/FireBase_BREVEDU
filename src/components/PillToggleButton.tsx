import React from 'react';

interface PillToggleButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

const PillToggleButton: React.FC<PillToggleButtonProps> = ({
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
        inline-flex items-center justify-center px-4 py-2 rounded-[8px] font-medium text-base
        transition-[background-color_0.3s_ease-out,color_0.3s_ease-out,transform_0.2s_ease-out,box-shadow_0.3s_ease-out]
        hover:animate-[breathe_2s_infinite] focus:animate-[breathe_2s_infinite]
        active:scale-95
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF7A59]/50
        disabled:pointer-events-none disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:animate-none disabled:active:scale-100
        ${active 
          ? 'bg-[#2D2C2B] text-white shadow-[0_2px_8px_rgba(45,44,43,0.3)]' 
          : 'bg-[#F5F0EC] text-[#2D2C2B] hover:bg-[#ECE5DC] shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
        }
        ${disabled ? 'css-ksxdzs' : ''}
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

export default PillToggleButton;