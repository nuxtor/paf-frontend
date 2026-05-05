import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './app/components/**/*.{js,vue,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/plugins/**/*.{js,ts}',
    './app/app.vue',
    './app/error.vue',
  ],
  theme: {
    extend: {
      colors: {
        pif: {
          green: {
            dark: '#1B4332',
            DEFAULT: '#2D6A4F',
            light: '#40916C',
          },
          gold: {
            DEFAULT: '#D4A437',
            light: '#E8C468',
          },
          cream: '#FAF9F6',
          black: '#000000',
          white: '#FFFFFF',
        },
        // Custom dark palette without blue tint
        dark: {
          DEFAULT: '#000000',
          50: '#0a0a0a',
          100: '#0d0d0d',
          200: '#121212',
          300: '#171717',
          400: '#1a1a1a',
          500: '#1f1f1f',
          600: '#262626',
          700: '#2e2e2e',
          800: '#383838',
          900: '#454545',
        },
      },
      fontFamily: {
        heading: ['Ovo', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
        },
      },
    },
  },
  plugins: [],
} satisfies Config