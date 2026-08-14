/**
 * The storefront is dark only.
 *
 * There is no toggle and no saved preference: `dark` goes on <html> before
 * first paint (see the inline script in nuxt.config) and stays there. This
 * composable is kept so callers that need to know which palette they are
 * drawing against — Stripe Elements on the checkout, which is an iframe and
 * cannot read our CSS — have one place to ask.
 */
export const useTheme = () => {
  const colorMode = useState<'light' | 'dark'>('color-mode', () => 'dark')

  const isDark = computed(() => colorMode.value === 'dark')

  const applyTheme = () => {
    if (import.meta.client) {
      document.documentElement.classList.add('dark')
    }
  }

  const initTheme = () => applyTheme()

  return {
    colorMode,
    isDark,
    initTheme,
  }
}
