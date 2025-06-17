/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
import fontInter from 'tailwindcss-font-inter';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // Headspace-inspired color palette
        primary: '#1a1a1a',
        'headspace-orange': '#FF7A59',
        'headspace-orange-hover': '#FF8A6B',
        'headspace-orange-active': '#E6694F',
        'headspace-orange-light': '#FFF4F1',
        'headspace-yellow': '#F5C842',
        'headspace-yellow-hover': '#F2C94C',
        'headspace-blue': '#4A90E2',
        'headspace-green': '#7ED321',
        'headspace-purple': '#9013FE',
        'headspace-gray': {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
        
        // Legacy colors for backward compatibility
        'accent-yellow': '#F5C842',
        'accent-yellow-dark': '#F2C94C',
        'accent-purple': '#9013FE',
        'accent-purple-dark': '#7B1FA2',
        'accent-deep-purple': '#7B1FA2',
        'accent-green': '#7ED321',
        'neutral-gray': '#9E9E9E',
        'text-light': '#ffffff',
        'text-primary': '#F5C842',
        'text-secondary': '#9013FE',
        'text-dark': '#212121',
      },
      fontSize: {
        // Headspace typography scale with improved line heights
        'h1': ['32px', { lineHeight: '1.25', fontWeight: '700', letterSpacing: '-0.02em' }],
        'h2': ['24px', { lineHeight: '1.3', fontWeight: '700', letterSpacing: '-0.01em' }],
        'h3': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'link': ['16px', { lineHeight: '1.5', fontWeight: '500' }],
        'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'small': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'x-small': ['12px', { lineHeight: '1.4', fontWeight: '500' }],
      },
      borderRadius: {
        // Headspace border radius scale
        'headspace-sm': '6px',
        'headspace-md': '8px',
        'headspace-lg': '10px',
        'headspace-xl': '12px',
        'headspace-2xl': '16px',
        'headspace-3xl': '20px',
      },
      boxShadow: {
        // Headspace shadow system
        'headspace-xs': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'headspace-sm': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'headspace-md': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'headspace-lg': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'headspace-xl': '0 12px 48px rgba(0, 0, 0, 0.18)',
        'headspace-focus': '0 0 0 4px rgba(255, 122, 89, 0.4)',
        'headspace-focus-ring': '0 0 0 2px rgba(255, 122, 89, 0.3)',
        
        // Legacy shadows for backward compatibility
        'card': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'button': '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
      spacing: {
        // Headspace spacing scale (8px base)
        'headspace-xs': '4px',   // 4px
        'headspace-sm': '8px',   // 8px
        'headspace-md': '16px',  // 16px
        'headspace-lg': '24px',  // 24px
        'headspace-xl': '32px',  // 32px
        'headspace-2xl': '48px', // 48px
        'headspace-3xl': '64px', // 64px
        'headspace-4xl': '96px', // 96px
      },
      backdropBlur: {
        'ios': '20px',
        'headspace': '12px',
      },
      animation: {
        // Headspace-style animations
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
        'headspace': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'headspace-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'ease-out-cubic': 'cubic-bezier(0.33, 1, 0.68, 1)',
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