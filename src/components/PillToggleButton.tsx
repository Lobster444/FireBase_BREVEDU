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

export default PillToggleButton;