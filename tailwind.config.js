/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fef9f0',
          100: '#fef3e1',
          200: '#fce8c3',
          300: '#f9d4a1',
          400: '#f5b870',
          500: '#d4af37',
          600: '#b8860b',
          700: '#997706',
          800: '#7a6205',
          900: '#5d4a03',
        }
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #ffffff 0%, #faf8f3 100%)',
      }
    },
  },
  plugins: [],
}
