/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        sans: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        background: {
          light: '#FAFAFA',
          dark: '#0A0A0A',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#171717',
        },
        primary: {
          light: '#0A0A0A',
          dark: '#FAFAFA',
        },
        secondary: {
          light: '#6B7280',
          dark: '#9CA3AF',
        },
        accent: {
          light: '#3B82F6',
          dark: '#60A5FA',
        },
        border: {
          light: '#E5E7EB',
          dark: '#262626',
        },
        category: {
          light: '#F3F4F6',
          dark: '#262626',
        },
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-top': 'env(safe-area-inset-top)',
      },
      animation: {
        'spin-slow': 'spin 1s linear infinite',
        'slide-up': 'slideUp 300ms ease-out',
        'fade-in': 'fadeIn 200ms ease-in',
        'scale-in': 'scaleIn 200ms ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
