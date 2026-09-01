<script setup lang="ts">
import type { Order } from '~/types/order'

definePageMeta({
  layout: 'checkout',
})

useSeoMeta({
  title: 'Order Confirmed | Premium Abrahamic Foods',
})

const route = useRoute()
const { apiFetch } = useApi()
const cartStore = useCartStore()

const order = ref<Order | null>(null)
const isLoading = ref(true)
const error = ref('')

const STASHED_ORDER_KEY = 'paf_last_order_number'

const readStashedOrderNumber = (): string => {
  try {
    return sessionStorage.getItem(STASHED_ORDER_KEY) || ''
  } catch {
    return ''
  }
}

const forgetStashedOrderNumber = () => {
  try {
    sessionStorage.removeItem(STASHED_ORDER_KEY)
  } catch {
    // Nothing to clean up if storage was never available.
  }
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

onMounted(async () => {
  // Three ways to name the order, in order of how much we trust them. Stripe
  // adds `payment_intent` to the return URL itself, so it survives even when
  // our own `order` parameter does not; the stashed copy covers a query string
  // that never arrived at all.
  const orderNumber = (route.query.order as string) || readStashedOrderNumber()
  const paymentIntent = route.query.payment_intent as string

  if (!orderNumber && !paymentIntent) {
    error.value =
      'We could not tell which order this page is for. If you have been charged, ' +
      'your confirmation email has the order number — please get in touch and we will pick it up from there.'
    isLoading.value = false
    return
  }

  // Stripe sends the customer back the moment the card clears, which can beat
  // the webhook that marks the order paid. The API asks Stripe directly, but a
  // payment still settling (3-D Secure, slower methods) is worth a few retries
  // before giving up on it.
  const attempts = 4

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await apiFetch<{ success: boolean; order: Order }>('/checkout/confirm', {
        method: 'POST',
        body: {
          order_number: orderNumber || undefined,
          payment_intent: paymentIntent || undefined,
        },
      })

      if (response.success) {
        order.value = response.order
        error.value = ''
        forgetStashedOrderNumber()
        // Clear the cart after successful confirmation
        cartStore.clearCart()
        break
      }

      error.value = 'Could not confirm your order. Please contact support.'
    } catch (err: any) {
      error.value = err?.data?.message || 'Something went wrong confirming your order.'

      // A payment that has not landed yet is the only thing worth waiting for.
      const stillSettling = err?.data?.message === 'Payment not confirmed'
      if (!stillSettling) break
      if (attempt < attempts) await wait(2000)
    }
  }

  isLoading.value = false
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
