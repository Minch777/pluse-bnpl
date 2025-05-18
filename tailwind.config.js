/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#8335ff',
        'primary-hover': '#7128f3',
        'primary-light': '#f6efff',
      },
      transitionProperty: {
        'backdrop-filter': 'backdrop-filter',
        'transform-opacity': 'transform, opacity',
        'all-important': 'all'
      },
      animation: {
        'fade-in': 'fadeIn 150ms ease-out forwards',
        'fade-out': 'fadeOut 150ms ease-out forwards',
        'scale-in': 'scaleIn 200ms ease-out forwards',
        'scale-out': 'scaleOut 200ms ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95) translateY(4px)', opacity: '0' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1) translateY(0)', opacity: '1' },
          '100%': { transform: 'scale(0.95) translateY(4px)', opacity: '0' },
        },
      },
      willChange: {
        'backdrop': 'backdrop-filter',
      },
    },
  },
  plugins: [],
} 