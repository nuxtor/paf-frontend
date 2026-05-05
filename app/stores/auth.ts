import { defineStore } from 'pinia'
import type { Customer, LoginCredentials, RegisterData } from '~/types/customer'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<Customer | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isWholesale = computed(() => user.value?.customer_type === 'wholesale')
  const fullName = computed(() =>
    user.value ? `${user.value.first_name} ${user.value.last_name}` : ''
  )

  // Actions
  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true
    try {
      // TODO: Implement API call
      // const response = await apiFetch('/auth/login', {
      //   method: 'POST',
      //   body: credentials,
      // })
      // token.value = response.token
      // user.value = response.user

      // For now, navigate to home
      navigateTo('/')
    } finally {
      isLoading.value = false
    }
  }

  const register = async (data: RegisterData) => {
    isLoading.value = true
    try {
      // TODO: Implement API call
      navigateTo('/auth/login')
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    isLoading.value = true
    try {
      // TODO: Implement API call
      token.value = null
      user.value = null
      navigateTo('/')
    } finally {
      isLoading.value = false
    }
  }

  const fetchUser = async () => {
    if (!token.value) return

    isLoading.value = true
    try {
      // TODO: Implement API call
    } finally {
      isLoading.value = false
    }
  }

  const updateProfile = async (data: Partial<Customer>) => {
    isLoading.value = true
    try {
      // TODO: Implement API call
      if (user.value) {
        Object.assign(user.value, data)
      }
    } finally {
      isLoading.value = false
    }
  }

  // Initialize from storage
  const initAuth = () => {
    if (import.meta.client) {
      const storedToken = localStorage.getItem('auth_token')
      if (storedToken) {
        token.value = storedToken
        fetchUser()
      }
    }
  }

  // Watch token changes and persist
  watch(token, (newToken) => {
    if (import.meta.client) {
      if (newToken) {
        localStorage.setItem('auth_token', newToken)
      } else {
        localStorage.removeItem('auth_token')
      }
    }
  })

  return {
    // State
    user,
    token,
    isLoading,
    // Getters
    isAuthenticated,
    isWholesale,
    fullName,
    // Actions
    login,
    register,
    logout,
    fetchUser,
    updateProfile,
    initAuth,
  }
})
