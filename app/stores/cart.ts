import { defineStore } from 'pinia'
import type { ApiCartItem, ApiCart } from '~/types/cart'
import type { ShippingRate } from '~/types/shipping'

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref<ApiCartItem[]>([])
  const isLoading = ref(false)
  const couponCode = ref<string | null>(null)
  const shippingTotal = ref(0)
  const taxTotal = ref(0)
  const discountTotal = ref(0)
  const shippingRates = ref<ShippingRate[]>([])
  const selectedShippingRate = ref<ShippingRate | null>(null)
  const isFetchingRates = ref(false)

  // Getters
  const itemCount = computed(() =>
    items.value.reduce((sum: number, item: ApiCartItem) => sum + item.quantity, 0)
  )

  const subtotal = computed(() =>
    items.value.reduce((sum: number, item: ApiCartItem) => sum + item.total, 0)
  )

  const total = computed(
    () => subtotal.value + shippingTotal.value + taxTotal.value - discountTotal.value
  )

  const isEmpty = computed(() => items.value.length === 0)

  // Sync state from API response
  const syncFromApi = (cart: ApiCart) => {
    const config = useRuntimeConfig()
    const imageBase = ((config.public.imageBaseUrl as string) || '').replace(/\/$/, '')
    items.value = cart.items.map((item) => ({
      ...item,
      image: item.image
        ? /^https?:\/\//i.test(item.image)
          ? item.image
          : `${imageBase}/${item.image.replace(/^\//, '')}`
        : item.image,
    }))
    couponCode.value = cart.promotion_code
  }

  // Actions
  const fetchCart = async () => {
    const { apiFetch } = useApi()
    isLoading.value = true
    try {
      const response = await apiFetch<{ cart: ApiCart }>('/cart')
      syncFromApi(response.cart)
    } catch {
      // Cart may not exist yet for guests — that's fine
    } finally {
      isLoading.value = false
    }
  }

  const addItem = async (productId: number, quantity: number, variantId?: number) => {
    const { apiFetch } = useApi()
    isLoading.value = true
    try {
      const response = await apiFetch<{ cart: ApiCart }>('/cart/items', {
        method: 'POST',
        body: {
          product_id: productId,
          quantity,
          variant_id: variantId ?? null,
        },
      })
      syncFromApi(response.cart)

      // Show cart drawer
      const uiStore = useUiStore()
      uiStore.openCart()
      uiStore.addToast('success', 'Item added to cart')
    } catch (error: any) {
      const uiStore = useUiStore()
      uiStore.addToast('error', error?.data?.message || 'Failed to add item to cart')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateQuantity = async (itemKey: string, quantity: number) => {
    const { apiFetch } = useApi()
    isLoading.value = true
    try {
      const response = await apiFetch<{ cart: ApiCart }>(`/cart/items/${itemKey}`, {
        method: 'PUT',
        body: { quantity },
      })
      syncFromApi(response.cart)
    } catch (error: any) {
      const uiStore = useUiStore()
      uiStore.addToast('error', error?.data?.message || 'Failed to update quantity')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const removeItem = async (itemKey: string) => {
    const { apiFetch } = useApi()
    isLoading.value = true
    try {
      const response = await apiFetch<{ cart: ApiCart }>(`/cart/items/${itemKey}`, {
        method: 'DELETE',
      })
      syncFromApi(response.cart)
      const uiStore = useUiStore()
      uiStore.addToast('success', 'Item removed from cart')
    } catch (error: any) {
      const uiStore = useUiStore()
      uiStore.addToast('error', error?.data?.message || 'Failed to remove item')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const clearCart = async () => {
    items.value = []
    couponCode.value = null
    discountTotal.value = 0
    shippingTotal.value = 0
    selectedShippingRate.value = null
    shippingRates.value = []
  }

  const applyCoupon = async (code: string) => {
    const { apiFetch } = useApi()
    isLoading.value = true
    try {
      const response = await apiFetch<{ cart: ApiCart }>('/cart/promo', {
        method: 'POST',
        body: { code },
      })
      syncFromApi(response.cart)
      const uiStore = useUiStore()
      uiStore.addToast('success', 'Promo code applied')
    } catch (error: any) {
      const uiStore = useUiStore()
      uiStore.addToast('error', error?.data?.message || 'Invalid promo code')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const removeCoupon = async () => {
    const { apiFetch } = useApi()
    isLoading.value = true
    try {
      const response = await apiFetch<{ cart: ApiCart }>('/cart/promo', {
        method: 'DELETE',
      })
      syncFromApi(response.cart)
      discountTotal.value = 0
    } catch {
      couponCode.value = null
      discountTotal.value = 0
    } finally {
      isLoading.value = false
    }
  }

  const getShippingRates = async (postcode: string, country = 'GB') => {
    const { apiFetch } = useApi()
    isFetchingRates.value = true
    try {
      const totalWeight = items.value.reduce((sum: number, item: ApiCartItem) => sum + item.quantity, 0)
      const response = await apiFetch<{ rates: ShippingRate[] }>('/shipping/rates', {
        method: 'POST',
        body: {
          postcode,
          country,
          weight: totalWeight,
          order_total: subtotal.value,
        },
      })
      shippingRates.value = response.rates
      return response.rates
    } catch (error: any) {
      const uiStore = useUiStore()
      uiStore.addToast('error', error?.data?.message || 'Failed to fetch shipping rates')
      shippingRates.value = []
      return []
    } finally {
      isFetchingRates.value = false
    }
  }

  const selectShippingRate = (rate: ShippingRate) => {
    selectedShippingRate.value = rate
    shippingTotal.value = rate.free_shipping ? 0 : rate.rate
  }

  return {
    // State
    items,
    isLoading,
    couponCode,
    shippingTotal,
    taxTotal,
    discountTotal,
    shippingRates,
    selectedShippingRate,
    isFetchingRates,
    // Getters
    itemCount,
    subtotal,
    total,
    isEmpty,
    // Actions
    fetchCart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    getShippingRates,
    selectShippingRate,
  }
})
