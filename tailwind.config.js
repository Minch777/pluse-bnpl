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
    },
  },
  plugins: [],
} 