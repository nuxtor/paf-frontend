<script setup lang="ts">
import type { Order } from '~/types/order'

definePageMeta({
  layout: 'checkout',
})

useSeoMeta({
  title: 'Order Confirmed | Premium Abrahimic Foods',
})

const route = useRoute()
const { apiFetch } = useApi()
const cartStore = useCartStore()

const order = ref<Order | null>(null)
const isLoading = ref(true)
const error = ref('')

onMounted(async () => {
  const orderNumber = route.query.order as string

  if (!orderNumber) {
    error.value = 'No order number found.'
    isLoading.value = false
    return
  }

  try {
    const response = await apiFetch<{ success: boolean; order: Order }>('/checkout/confirm', {
      method: 'POST',
      body: { order_number: orderNumber },
    })

    if (response.success) {
      order.value = response.order
      // Clear the cart after successful confirmation
      cartStore.clearCart()
    } else {
      error.value = 'Could not confirm your order. Please contact support.'
    }
  } catch (err: any) {
    error.value = err?.data?.message || 'Something went wrong confirming your order.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="container py-16">
    <!-- Loading -->
    <div v-if="isLoading" class="max-w-lg mx-auto text-center">
      <div class="animate-spin w-10 h-10 border-4 border-pif-green-dark border-t-transparent rounded-full mx-auto mb-6" />
      <p class="text-gray-500">Confirming your order...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="max-w-lg mx-auto text-center">
      <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon name="heroicons:exclamation-triangle" class="w-10 h-10 text-red-600" />
      </div>
      <h1 class="font-heading text-3xl text-pif-black mb-4">Something Went Wrong</h1>
      <p class="text-gray-600 mb-8">{{ error }}</p>
      <div class="space-y-4">
        <NuxtLink
          to="/contact"
          class="block w-full py-3 bg-pif-green-dark text-white font-medium rounded-lg hover:bg-pif-green transition-colors text-center"
        >
          Contact Support
        </NuxtLink>
        <NuxtLink
          to="/"
          class="block w-full py-3 border border-pif-green-dark text-pif-green-dark font-medium rounded-lg hover:bg-pif-green-dark hover:text-white transition-colors text-center"
        >
          Go Home
        </NuxtLink>
      </div>
    </div>

    <!-- Success -->
    <div v-else-if="order" class="max-w-lg mx-auto text-center">
      <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon name="heroicons:check" class="w-10 h-10 text-green-600" />
      </div>

      <h1 class="font-heading text-3xl text-pif-black mb-4">Thank You for Your Order!</h1>

      <p class="text-gray-600 mb-8">
        Your order has been placed successfully. We've sent a confirmation email with all the details.
      </p>

      <div class="bg-gray-50 rounded-xl p-6 mb-8">
        <p class="text-sm text-gray-500 mb-2">Order Number</p>
        <p class="text-xl font-semibold text-pif-black">#{{ order.order_number }}</p>
        <div class="mt-4 flex items-center justify-center gap-4 text-sm text-gray-500">
          <span>Status: <span class="font-medium text-pif-green-dark capitalize">{{ order.status }}</span></span>
          <span>Total: <span class="font-medium text-pif-green-dark">{{ formatCurrency(order.total) }}</span></span>
        </div>
      </div>

      <!-- Order Items -->
      <div v-if="order.items?.length" class="bg-white rounded-xl border p-4 mb-8 text-left">
        <h3 class="font-medium text-pif-black mb-3">Items Ordered</h3>
        <div class="space-y-2">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="flex justify-between text-sm gap-4"
          >
            <span class="text-gray-700">
              {{ item.name }} x {{ item.quantity }}
              <span v-if="item.note" class="block text-xs text-gray-500 italic">
                Note: {{ item.note }}
              </span>
            </span>
            <span class="font-medium whitespace-nowrap">{{ formatCurrency(item.line_total) }}</span>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <NuxtLink
          :to="`/account/orders/${order.id}`"
          class="block w-full py-3 bg-pif-green-dark text-white font-medium rounded-lg hover:bg-pif-green transition-colors"
        >
          View Order Details
        </NuxtLink>
        <NuxtLink
          to="/products"
          class="block w-full py-3 border border-pif-green-dark text-pif-green-dark font-medium rounded-lg hover:bg-pif-green-dark hover:text-white transition-colors"
        >
          Continue Shopping
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
