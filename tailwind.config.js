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
        'status-pop': {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        },
        'status-ripple': {
          '0%': { transform: 'scale(1)', opacity: '0.55' },
          '100%': { transform: 'scale(1.3)', opacity: '0' },
        },
      },
      animation: {
        'dot-fill': 'dot-fill 200ms ease-out',
        'status-pop': 'status-pop 300ms ease-out',
        'status-ripple': 'status-ripple 250ms ease-out forwards',
      },
    },
  },
  plugins: [],
}

