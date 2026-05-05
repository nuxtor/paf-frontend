export const useApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const getCartSessionId = (): string => {
    if (!import.meta.client) return ''

    let sessionId = localStorage.getItem('cart_session_id')
    if (!sessionId) {
      sessionId = crypto.randomUUID()
      localStorage.setItem('cart_session_id', sessionId)
    }
    return sessionId
  }

  const apiFetch = $fetch.create({
    baseURL: config.public.apiBaseUrl as string,
    onRequest({ options }) {
      const headers = new Headers(options.headers)

      headers.set('Accept', 'application/json')

      if (authStore.token) {
        headers.set('Authorization', `Bearer ${authStore.token}`)
      }

      const sessionId = getCartSessionId()
      if (sessionId) {
        headers.set('X-Cart-Session', sessionId)
      }

      options.headers = headers
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        authStore.logout()
        navigateTo('/auth/login')
      }
    },
  })

  return { apiFetch, getCartSessionId }
}
