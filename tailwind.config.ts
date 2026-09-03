import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

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
            dark: '#3da052',
            DEFAULT: '#2D6A4F',
            light: '#40916C',
            // Bottom stop of the category bar's gradient — a shade of the
            // brand green rather than a fourth green in its own right.
            deep: '#2b8f4a',
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
        heading: ['Bebas Neue', 'Oswald', 'Impact', 'sans-serif'],
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

      // CMS page bodies and product descriptions are raw HTML dropped in with
      // v-html, so Preflight leaves them with no heading sizes, list markers or
      // paragraph spacing. The typography plugin supplies all of that; these
      // variables just point its dark palette at the site's own colours rather
      // than its stock greys.
      typography: ({ theme }: { theme: (path: string) => string }) => ({
        invert: {
          css: {
            '--tw-prose-invert-body': theme('colors.gray.300'),
            '--tw-prose-invert-headings': theme('colors.white'),
            '--tw-prose-invert-lead': theme('colors.gray.400'),
            '--tw-prose-invert-bold': theme('colors.white'),
            '--tw-prose-invert-counters': theme('colors.gray.400'),
            '--tw-prose-invert-bullets': theme('colors.pif.gold.DEFAULT'),
            '--tw-prose-invert-hr': theme('colors.dark.600'),
            '--tw-prose-invert-quotes': theme('colors.gray.100'),
            '--tw-prose-invert-quote-borders': theme('colors.pif.gold.DEFAULT'),
            '--tw-prose-invert-captions': theme('colors.gray.400'),
            '--tw-prose-invert-th-borders': theme('colors.dark.600'),
            '--tw-prose-invert-td-borders': theme('colors.dark.600'),
          },
        },
      }),
    },
  },
  plugins: [typography],
} satisfies Config