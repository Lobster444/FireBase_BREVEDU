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
        primary: '#1a1a1a',
        'accent-yellow': '#f5f387',
        'accent-yellow-dark': '#e0de69',
        'accent-purple': '#ddbffb',
        'accent-purple-dark': '#ab90db',
        'accent-deep-purple': '#ab90db',
        'accent-green': '#e0de69',
        'neutral-gray': '#5e5e5e',
        'text-light': '#ffffff',
        'text-primary': '#f5f387',
        'text-secondary': '#ddbffb',
        'text-dark': '#1a1a1a',
      },
      fontSize: {
        'h1': ['36px', { lineHeight: '1.2', fontWeight: '600' }],
        'h2': ['28px', { lineHeight: '1.3', fontWeight: '600' }],
        'h3': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'link': ['18px', { lineHeight: '1.5', fontWeight: '500' }],
        'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'small': ['14px', { lineHeight: '1.4', fontWeight: '400' }],
        'x-small': ['12px', { lineHeight: '1.3', fontWeight: '400' }],
      },
      backdropBlur: {
        'ios': '20px',
      },
      boxShadow: {
        'card': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'button': '0 2px 8px rgba(0, 0, 0, 0.1)',
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