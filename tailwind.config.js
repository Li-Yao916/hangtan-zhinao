/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          dark: '#0A2B3D',
          DEFAULT: '#0B232D',
          light: '#133A4B',
        },
      },
    },
  },
  plugins: [],
};
