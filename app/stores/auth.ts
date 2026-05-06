import { defineStore } from 'pinia'
import type { Customer, LoginCredentials, RegisterData } from '~/types/customer'

interface AuthResponse {
  customer: Customer
  token: string
}

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
    const { apiFetch } = useApi()
    isLoading.value = true
    try {
      const response = await apiFetch<AuthResponse>('/auth/login', {
        method: 'POST',
        body: credentials,
      })
      token.value = response.token
      user.value = response.customer
      const uiStore = useUiStore()
      uiStore.addToast('success', 'Welcome back!')
      navigateTo('/account')
    } finally {
      isLoading.value = false
    }
  }

  const register = async (data: RegisterData) => {
    const { apiFetch } = useApi()
    isLoading.value = true
    try {
      const response = await apiFetch<AuthResponse>('/auth/register', {
        method: 'POST',
        body: data,
      })
      token.value = response.token
      user.value = response.customer
      const uiStore = useUiStore()
      uiStore.addToast('success', 'Account created — welcome!')
      navigateTo('/account')
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    const { apiFetch } = useApi()
    isLoading.value = true
    try {
      if (token.value) {
        await apiFetch('/auth/logout', { method: 'POST' }).catch(() => {})
      }
    } finally {
      token.value = null
      user.value = null
      isLoading.value = false
      navigateTo('/')
    }
  }

  const fetchUser = async () => {
    if (!token.value) return
    const { apiFetch } = useApi()
    isLoading.value = true
    try {
      const response = await apiFetch<{ customer: Customer }>('/auth/user')
      user.value = response.customer
    } catch {
      token.value = null
      user.value = null
    } finally {
      isLoading.value = false
    }
  }

  const updateProfile = async (data: Partial<Customer>) => {
    const { apiFetch } = useApi()
    isLoading.value = true
    try {
      const response = await apiFetch<{ customer: Customer }>('/account', {
        method: 'PUT',
        body: data,
      })
      user.value = response.customer
      const uiStore = useUiStore()
      uiStore.addToast('success', 'Profile updated')
    } catch (error: any) {
      const uiStore = useUiStore()
      uiStore.addToast('error', error?.data?.message || 'Failed to update profile')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const changePassword = async (payload: {
    current_password: string
    password: string
    password_confirmation: string
  }) => {
    const { apiFetch } = useApi()
    isLoading.value = true
    try {
      await apiFetch('/account/password', {
        method: 'PUT',
        body: payload,
      })
      const uiStore = useUiStore()
      uiStore.addToast('success', 'Password updated')
    } catch (error: any) {
      const uiStore = useUiStore()
      uiStore.addToast('error', error?.data?.message || 'Failed to update password')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const forgotPassword = async (email: string) => {
    const { apiFetch } = useApi()
    isLoading.value = true
    try {
      await apiFetch('/auth/forgot-password', {
        method: 'POST',
        body: { email },
      })
      const uiStore = useUiStore()
      uiStore.addToast('success', 'Password reset link sent')
    } catch (error: any) {
      const uiStore = useUiStore()
      uiStore.addToast('error', error?.data?.message || 'Failed to send reset link')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const resetPassword = async (payload: {
    email: string
    token: string
    password: string
    password_confirmation: string
  }) => {
    const { apiFetch } = useApi()
    isLoading.value = true
    try {
      await apiFetch('/auth/reset-password', {
        method: 'POST',
        body: payload,
      })
      const uiStore = useUiStore()
      uiStore.addToast('success', 'Password reset successfully — please sign in')
      navigateTo('/auth/login')
    } catch (error: any) {
      const uiStore = useUiStore()
      uiStore.addToast('error', error?.data?.message || 'Failed to reset password')
      throw error
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
    changePassword,
    forgotPassword,
    resetPassword,
    initAuth,
  }
})
