import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', () => {
  // State
  const isMobileMenuOpen = ref(false)
  const isCartOpen = ref(false)
  const isSearchOpen = ref(false)

  // Toasts
  const toasts = ref<
    Array<{
      id: string
      type: 'success' | 'error' | 'warning' | 'info'
      message: string
      duration?: number
    }>
  >([])

  // Actions
  const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
  }

  const openMobileMenu = () => {
    isMobileMenuOpen.value = true
  }

  const closeMobileMenu = () => {
    isMobileMenuOpen.value = false
  }

  const toggleCart = () => {
    isCartOpen.value = !isCartOpen.value
  }

  const openCart = () => {
    isCartOpen.value = true
  }

  const closeCart = () => {
    isCartOpen.value = false
  }

  const toggleSearch = () => {
    isSearchOpen.value = !isSearchOpen.value
  }

  const addToast = (
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    duration = 5000
  ) => {
    const id = Math.random().toString(36).slice(2, 9)
    toasts.value.push({ id, type, message, duration })

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  return {
    // State
    isMobileMenuOpen,
    isCartOpen,
    isSearchOpen,
    toasts,
    // Actions
    toggleMobileMenu,
    openMobileMenu,
    closeMobileMenu,
    toggleCart,
    openCart,
    closeCart,
    toggleSearch,
    addToast,
    removeToast,
  }
})
