/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4da6ff',
          DEFAULT: '#0078ff',
          dark: '#0057cc',
        },
        secondary: {
          light: '#f8fafc',
          DEFAULT: '#e2e8f0',
          dark: '#94a3b8',
        },
      },
    },
  },
  plugins: [],
}; 