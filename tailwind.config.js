/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F7F5F0',
        ink: '#1F1D1A',
        rule: '#DDD8CC',
        solved: '#4A7C59',
        tried: '#C97A2E',
        skip: '#8B8578',
        flame: '#B5482C',
        coal: '#181614',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'dot-fill': {
          '0%': { transform: 'scale(0.3)', opacity: '0.3' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'dot-fill': 'dot-fill 200ms ease-out',
      },
    },
  },
  plugins: [],
}

