/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      screens: {
        '0px': '0',
        '375px': '375px',
        '576px': '576px',
        '768px': '768px',
        '1024px': '1024px',
        '1280px': '1280px',
        '1440px': '1440px',
        '1512px': '1512px',
        '1800px': '1800px',
        '1920px': '1920px',
        '2400px': '2400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Rooftop', ...defaultTheme.fontFamily.sans],
        gravity: ['ManyChatGravity', 'sans-serif'],
        cofo: ['CoFo Sans Mono', 'sans-serif'],
      },
      colors: {
        // ManyChat color palette
        dusk: 'var(--dusk)',
        ecru: 'var(--ecru)',
        hazel: 'var(--hazel)',
        powder: 'var(--powder)',
        thistle: 'var(--thistle)',
        amethyst: 'var(--amethyst)',
        cobalt: 'var(--cobalt)',
        currant: 'var(--currant)',
        gold: 'var(--gold)',
        kelp: 'var(--kelp)',
        grey: 'var(--grey)',
        'black-10': 'var(--black-10)',
        'black-30': 'var(--black-30)',
        'vivid-orange': 'var(--vivid-orange)',
        'hyper-yellow': 'var(--hyper-yellow)',
        neonPink: 'var(--neon-pink)',
        'electric-cyan': 'var(--electric-cyan)',
        'sharp-green': 'var(--sharp-green)',
        violet: 'var(--violet)',
        'pitch-black': 'var(--pitch-black)',
        'dark-violet': 'var(--dark-violet)',
        'old-grey': 'var(--old-grey)',
        'light-blue': 'var(--light-blue)',
        'blue-grey': 'var(--blue-grey)',
        'dark-grey': 'var(--dark-grey)',
        'border-grey': 'var(--border-grey)',
        'light-red': 'var(--light-red)',
        'light-green': 'var(--light-green)',
        'grey-green': 'var(--grey-green)',
        pink: 'var(--pink)',
        
        // Dynamic colors
        'dynamic-base': 'var(--bg-color-base)',
        'dynamic-lg': 'var(--bg-color-lg)',
        'text-dynamic-base': 'var(--text-color-base)',
      },
      spacing: {
        '0.4rem': '0.4rem',
        '0.8rem': '0.8rem',
        '1.2rem': '1.2rem',
        '1.6rem': '1.6rem',
        '2rem': '2rem',
        '2.4rem': '2.4rem',
        '3.2rem': '3.2rem',
        '4rem': '4rem',
        '4.8rem': '4.8rem',
        '6rem': '6rem',
        '8rem': '8rem',
        '10rem': '10rem',
        '12rem': '12rem',
        '16rem': '16rem',
      },
      maxWidth: {
        'mc': '127.2rem',
        'mc-wide': '141.6rem',
      },
      screens: {
        'tn': '576px',
        'sm': '768px',
        'md': '1024px',
        'lg': '1280px',
        'big': '1440px',
        'huge': '1512px',
        'xl': '1800px',
        '2xl': '1920px',
        '3xl': '2400px',
        'sm-md': {'min': '768px', 'max': '1023px'},
        'hover-hover': {'raw': '(hover: hover)'},
      },
      animation: {
        'page-fade-in': 'page-fade-in 0.3s ease-out',
        'page-slide-up': 'page-slide-up 0.4s ease-out',
        'page-scale-in': 'page-scale-in 0.2s ease-out',
      },
      keyframes: {
        'page-fade-in': {
          '0%': { opacity: '0', transform: 'translateY(12px) translateZ(0)' },
          '100%': { opacity: '1', transform: 'translateY(0) translateZ(0)' },
        },
        'page-slide-up': {
          '0%': { transform: 'translateY(24px) translateZ(0)', opacity: '0' },
          '100%': { transform: 'translateY(0) translateZ(0)', opacity: '1' },
        },
        'page-scale-in': {
          '0%': { transform: 'scale(0.96) translateZ(0)', opacity: '0' },
          '100%': { transform: 'scale(1) translateZ(0)', opacity: '1' },
        },
        'grid-pan': {
          '0%': { backgroundPosition: '0% 0%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 100%' }
        },
      },
      transitionTimingFunction: {
        'ease-mc': 'cubic-bezier(0.43, 0.195, 0.02, 1)',
      },
      animation: {
        'grid-pan': 'grid-pan 30s ease-in-out infinite',
        'grid-pan-slow': 'grid-pan 50s ease-in-out infinite',
        'grid-pan-fast': 'grid-pan 20s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};