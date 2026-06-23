export const useTheme = () => {
  const colorMode = useState<'light' | 'dark'>('color-mode', () => 'dark')

  const isDark = computed(() => colorMode.value === 'dark')

  const toggleTheme = () => {
    colorMode.value = colorMode.value === 'light' ? 'dark' : 'light'
    applyTheme()
  }

  const setTheme = (mode: 'light' | 'dark') => {
    colorMode.value = mode
    applyTheme()
  }

  const applyTheme = () => {
    if (import.meta.client) {
      const html = document.documentElement
      if (colorMode.value === 'dark') {
        html.classList.add('dark')
      } else {
        html.classList.remove('dark')
      }
      localStorage.setItem('pif-theme', colorMode.value)
    }
  }

  const initTheme = () => {
    if (import.meta.client) {
      const saved = localStorage.getItem('pif-theme') as 'light' | 'dark' | null
      // Default to dark; only honour an explicit user choice from a previous visit.
      // Do not follow OS/browser preference.
      colorMode.value = saved ?? 'dark'
      applyTheme()
    }
  }

  return {
    colorMode,
    isDark,
    toggleTheme,
    setTheme,
    initTheme,
  }
}
