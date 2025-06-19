/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
import fontInter from 'tailwindcss-font-inter';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      screens: {
        xl: '1280px',
        '2xl': '1280px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // Headspace-inspired color palette using CSS variables
        primary: 'var(--color-primary)',
        'headspace-orange': 'var(--color-primary)',
        'headspace-orange-hover': 'var(--color-primary-hover)',
        'headspace-orange-active': 'var(--color-primary-active)',
        'headspace-orange-light': 'var(--color-primary-light)',
        'headspace-yellow': 'var(--color-accent-yellow)',
        'headspace-yellow-hover': 'var(--color-accent-yellow-hover)',
        'headspace-blue': 'var(--color-accent-blue)',
        'headspace-green': 'var(--color-accent-green)',
        'headspace-purple': 'var(--color-accent-purple)',
        'headspace-gray': {
          50: 'var(--color-neutral-50)',
          100: 'var(--color-neutral-100)',
          200: 'var(--color-neutral-200)',
          300: 'var(--color-neutral-300)',
          400: 'var(--color-neutral-400)',
          500: 'var(--color-neutral-500)',
          600: 'var(--color-neutral-600)',
          700: 'var(--color-neutral-700)',
          800: 'var(--color-neutral-800)',
          900: 'var(--color-neutral-900)',
        },
        
        // Negative/Danger colors
        'negative': 'var(--color-negative)',
        'negative-hover': 'var(--color-negative-hover)',
        'negative-active': 'var(--color-negative-active)',
        'negative-light': 'var(--color-negative-light)',
        'sentiment-negative': 'var(--color-sentiment-negative)',
        
        // Legacy colors for backward compatibility
        'accent-yellow': 'var(--color-accent-yellow)',
        'accent-yellow-dark': 'var(--color-accent-yellow-hover)',
        'accent-purple': 'var(--color-accent-purple)',
        'accent-purple-dark': '#7B1FA2',
        'accent-deep-purple': '#7B1FA2',
        'accent-green': 'var(--color-accent-green)',
        'neutral-gray': 'var(--color-neutral-500)',
        'text-light': '#ffffff',
        'text-primary': 'var(--color-accent-yellow)',
        'text-secondary': 'var(--color-accent-purple)',
        'text-dark': 'var(--color-neutral-900)',
      },
      fontSize: {
        // Headspace typography scale mapped to CSS variables
        'h1': ['var(--font-size-h1)', { 
          lineHeight: 'var(--line-height-h1)', 
          fontWeight: 'var(--font-weight-h1)', 
          letterSpacing: 'var(--letter-spacing-h1)' 
        }],
        'h2': ['var(--font-size-h2)', { 
          lineHeight: 'var(--line-height-h2)', 
          fontWeight: 'var(--font-weight-h2)', 
          letterSpacing: 'var(--letter-spacing-h2)' 
        }],
        'h3': ['var(--font-size-h3)', { 
          lineHeight: 'var(--line-height-h3)', 
          fontWeight: 'var(--font-weight-h3)' 
        }],
        'link': ['16px', { lineHeight: '1.5', fontWeight: '500' }],
        'body': ['var(--font-size-body)', { 
          lineHeight: 'var(--line-height-body)', 
          fontWeight: 'var(--font-weight-body)' 
        }],
        'small': ['var(--font-size-small)', { 
          lineHeight: 'var(--line-height-small)', 
          fontWeight: 'var(--font-weight-small)' 
        }],
        'x-small': ['var(--font-size-xs)', { 
          lineHeight: 'var(--line-height-xs)', 
          fontWeight: 'var(--font-weight-xs)' 
        }],
      },
      borderRadius: {
        // Headspace border radius scale mapped to CSS variables
        'headspace-sm': 'var(--radius-sm)',
        'headspace-md': 'var(--radius-md)',
        'headspace-lg': 'var(--radius-lg)',
        'headspace-xl': 'var(--radius-xl)',
        'headspace-2xl': 'var(--radius-2xl)',
        'headspace-3xl': 'var(--radius-3xl)',
      },
      boxShadow: {
        // Headspace shadow system mapped to CSS variables
        'headspace-xs': 'var(--shadow-xs)',
        'headspace-sm': 'var(--shadow-sm)',
        'headspace-md': 'var(--shadow-md)',
        'headspace-lg': 'var(--shadow-lg)',
        'headspace-xl': 'var(--shadow-xl)',
        'headspace-focus': 'var(--shadow-focus)',
        'headspace-focus-ring': 'var(--shadow-focus-ring)',
        
        // Legacy shadows for backward compatibility
        'card': 'var(--shadow-md)',
        'button': 'var(--shadow-sm)',
      },
      outlineWidth: {
        // Focus outline widths
        '1': '1px',
        '2': '2px',
        '3': '3px',
        '4': '4px',
      },
      outlineOffset: {
        // Focus outline offsets
        '1': '1px',
        '2': '2px',
        '3': '3px',
        '4': '4px',
      },
      borderWidth: {
        // Custom border widths for focus states
        '3': '3px',
        '4': '4px',
        '5': '5px',
      },
      spacing: {
        // Headspace spacing scale mapped to CSS variables
        'headspace-xs': 'var(--space-xs)',
        'headspace-sm': 'var(--space-sm)',
        'headspace-md': 'var(--space-md)',
        'headspace-lg': 'var(--space-lg)',
        'headspace-xl': 'var(--space-xl)',
        'headspace-2xl': 'var(--space-2xl)',
        'headspace-3xl': 'var(--space-3xl)',
        'headspace-4xl': 'var(--space-4xl)',
        
        // Padding design tokens
        'padding-x-small': 'var(--padding-x-small)',
        'padding-small': 'var(--padding-small)',
        'padding-medium': 'var(--padding-medium)',
        'padding-large': 'var(--padding-large)',
      },
      backdropBlur: {
        'ios': '20px',
        'headspace': '12px',
      },
      animation: {
        // Headspace-style animations - hover/focus only for accessibility
        'breathe': 'breathe 2s ease-in-out infinite',
        'card-breathe': 'card-breathe 3s ease-in-out infinite',
        'gentle-bounce': 'gentle-bounce 0.6s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
        'card-breathe': {
          '0%, 100%': { transform: 'scale(1) translateY(0)' },
          '50%': { transform: 'scale(1.01) translateY(-1px)' },
        },
        'gentle-bounce': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      transitionTimingFunction: {
        'headspace': 'var(--transition-headspace)',
        'headspace-bounce': 'var(--transition-bounce)',
        'ease-out-cubic': 'cubic-bezier(0.33, 1, 0.68, 1)',
      },
      transitionDuration: {
        'fast': 'var(--transition-fast)',
        'normal': 'var(--transition-normal)',
        'slow': 'var(--transition-slow)',
      },
      zIndex: {
        'dropdown': 'var(--z-dropdown)',
        'sticky': 'var(--z-sticky)',
        'fixed': 'var(--z-fixed)',
        'modal-backdrop': 'var(--z-modal-backdrop)',
        'modal': 'var(--z-modal)',
        'popover': 'var(--z-popover)',
        'tooltip': 'var(--z-tooltip)',
        'toast': 'var(--z-toast)',
      },
      // Inter font feature configurations
      interFontFeatures: {
        numeric: ['tnum', 'salt', 'ss02'], // Tabular numbers, stylistic alternates
        display: ['cv11', 'ss01'], // Single-story 'a', stylistic set 1
      },
    },
  },
  plugins: [
    fontInter({ 
      importFontFace: false, // We're using CDN, so don't import font face
      disableFeatures: false, // Enable all OpenType features
    }),
  ],
};