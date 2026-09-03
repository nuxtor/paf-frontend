<script setup lang="ts">
import { ORDER_STATUSES, PAYMENT_STATUSES } from '~/utils/constants'
import type { Order, OrderAddress } from '~/types/order'

definePageMeta({
  layout: 'account',
})

const route = useRoute()
const { apiFetch } = useApi()
const uiStore = useUiStore()

// Orders are addressed by their number (PAF-YYYYMMDD-XXXX) everywhere the
// customer sees them, and that is what the API looks them up by too.
const orderNumber = computed(() => route.params.orderNumber as string)

const order = ref<Order | null>(null)
const isLoading = ref(true)
const error = ref('')
const isCancelling = ref(false)

const fetchOrder = async () => {
  isLoading.value = true
  error.value = ''
  try {
    const response = await apiFetch<{ order: Order }>(`/orders/${orderNumber.value}`)
    order.value = response.order
  } catch (err: any) {
    order.value = null
    error.value =
      err?.response?.status === 404
        ? 'We could not find that order on your account.'
        : 'We could not load that order. Please try again.'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchOrder)

// Mirrors Order::canBeCancelled() on the API — anything already packed or on
// its way has to go through customer service instead.
const canCancel = computed(
  () => !!order.value && ['pending', 'confirmed', 'processing'].includes(order.value.status)
)

const cancelOrder = async () => {
  if (!order.value || isCancelling.value) return
  if (!confirm(`Cancel order ${order.value.order_number}? This cannot be undone.`)) return

  isCancelling.value = true
  try {
    const response = await apiFetch<{ order: Order }>(
      `/orders/${order.value.order_number}/cancel`,
      { method: 'POST' }
    )
    order.value = response.order
    uiStore.addToast('success', 'Your order has been cancelled.')
  } catch (err: any) {
    uiStore.addToast('error', err?.data?.error || 'We could not cancel this order.')
  } finally {
    isCancelling.value = false
  }
}

const addressLines = (address?: OrderAddress): string[] => {
  if (!address) return []
  return [
    [address.first_name, address.last_name].filter(Boolean).join(' '),
    address.company,
    address.address_line_1,
    address.address_line_2,
    address.city,
    address.county,
    address.postcode,
    address.country,
    address.phone,
  ].filter((line): line is string => !!line && line.trim() !== '')
}

useSeoMeta({
  title: () => `Order ${orderNumber.value} | Premium Abrahamic Foods`,
})
</script>

<template>
  <div>
    <NuxtLink
      to="/account/orders"
      class="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-pif-green-dark dark:hover:text-pif-gold mb-4"
    >
      <Icon name="heroicons:arrow-left" class="w-4 h-4" />
      Back to orders
    </NuxtLink>

    <!-- Loading -->
    <div v-if="isLoading" class="bg-white dark:bg-dark-200 rounded-xl shadow-sm dark:shadow-black/50 p-8 text-center">
      <PSpinner size="md" class="mx-auto" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-white dark:bg-dark-200 rounded-xl shadow-sm dark:shadow-black/50 p-8 text-center">
      <Icon name="heroicons:exclamation-triangle" class="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-dark-700" />
      <p class="text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
      <NuxtLink
        to="/account/orders"
        class="inline-flex items-center gap-2 px-6 py-3 bg-pif-green-dark text-white font-medium rounded-lg hover:bg-pif-green transition-colors"
      >
        Back to Order History
      </NuxtLink>
    </div>

    <template v-else-if="order">
      <!-- Summary -->
      <div class="bg-white dark:bg-dark-200 rounded-xl shadow-sm dark:shadow-black/50 p-6 mb-4">
        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 class="font-heading text-2xl text-pif-black dark:text-white">
              Order {{ order.order_number }}
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Placed {{ formatDate(order.created_at) }}
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <PBadge :variant="(ORDER_STATUSES[order.status]?.color as any) || 'default'">
              {{ ORDER_STATUSES[order.status]?.label || order.status }}
            </PBadge>
            <PBadge :variant="(PAYMENT_STATUSES[order.payment_status]?.color as any) || 'default'">
              {{ PAYMENT_STATUSES[order.payment_status]?.label || order.payment_status }}
            </PBadge>
          </div>
        </div>
      </div>

      <!-- Tracking -->
      <div v-if="order.shipments?.length" class="bg-white dark:bg-dark-200 rounded-xl shadow-sm dark:shadow-black/50 p-6 mb-4">
        <h2 class="font-medium text-pif-black dark:text-white mb-3">Delivery</h2>
        <div
          v-for="shipment in order.shipments"
          :key="shipment.id"
          class="flex flex-wrap items-center justify-between gap-3 py-2 border-b border-gray-200 dark:border-dark-600 last:border-0"
        >
          <div class="text-sm">
            <p class="text-pif-black dark:text-white">
              {{ (shipment.carrier || 'Courier').toUpperCase() }}
              <span v-if="shipment.tracking_number" class="text-gray-500 dark:text-gray-400">
                · {{ shipment.tracking_number }}
              </span>
            </p>
            <p v-if="shipment.shipped_at" class="text-xs text-gray-500 dark:text-gray-400">
              Dispatched {{ formatDate(shipment.shipped_at) }}
            </p>
          </div>
          <a
            v-if="shipment.tracking_url"
            :href="shipment.tracking_url"
            target="_blank"
            rel="noopener"
            class="text-sm font-medium text-pif-green-dark dark:text-pif-gold hover:underline"
          >
            Track parcel
          </a>
        </div>
      </div>

      <!-- Items -->
      <div class="bg-white dark:bg-dark-200 rounded-xl shadow-sm dark:shadow-black/50 p-6 mb-4">
        <h2 class="font-medium text-pif-black dark:text-white mb-3">Items</h2>
        <div class="divide-y divide-gray-200 dark:divide-dark-600">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="flex justify-between gap-4 py-3 text-sm"
          >
            <div>
              <p class="text-pif-black dark:text-white">{{ orderItemLabel(item) }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatOrderQty(item) }} × {{ formatCurrency(toAmount(item.unit_price)) }}
                <span v-if="item.sku"> · {{ item.sku }}</span>
              </p>
              <p v-if="item.note" class="text-xs text-gray-500 dark:text-gray-400 italic">Note: {{ item.note }}</p>
            </div>
            <p class="font-medium whitespace-nowrap">
              {{ formatCurrency(toAmount(item.total)) }}
            </p>
          </div>
        </div>

        <!-- Totals -->
        <div class="border-t border-gray-200 dark:border-dark-600 mt-4 pt-4 space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-500 dark:text-gray-400">Subtotal</span>
            <span>{{ formatCurrency(toAmount(order.subtotal)) }}</span>
          </div>
          <div v-if="toAmount(order.discount_amount) > 0" class="flex justify-between">
            <span class="text-gray-500 dark:text-gray-400">
              Discount
              <span v-if="order.promotion_code">({{ order.promotion_code }})</span>
            </span>
            <span class="text-pif-green-dark dark:text-green-400">
              −{{ formatCurrency(toAmount(order.discount_amount)) }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500 dark:text-gray-400">
              Delivery
              <span v-if="order.shipping_method">({{ order.shipping_method }})</span>
            </span>
            <span>{{ formatCurrency(toAmount(order.shipping_amount)) }}</span>
          </div>
          <div class="flex justify-between font-semibold text-base pt-2 border-t border-gray-200 dark:border-dark-600">
            <span>Total</span>
            <span class="text-pif-green-dark dark:text-green-400">{{ formatCurrency(toAmount(order.total)) }}</span>
          </div>
        </div>
      </div>

      <!-- Addresses -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div class="bg-white dark:bg-dark-200 rounded-xl shadow-sm dark:shadow-black/50 p-6">
          <h2 class="font-medium text-pif-black dark:text-white mb-3">Delivery address</h2>
          <address class="not-italic text-sm text-gray-600 dark:text-gray-300 space-y-0.5">
            <p v-for="(line, idx) in addressLines(order.shipping_address)" :key="idx">
              {{ line }}
            </p>
          </address>
        </div>
        <div class="bg-white dark:bg-dark-200 rounded-xl shadow-sm dark:shadow-black/50 p-6">
          <h2 class="font-medium text-pif-black dark:text-white mb-3">Billing address</h2>
          <address class="not-italic text-sm text-gray-600 dark:text-gray-300 space-y-0.5">
            <p v-for="(line, idx) in addressLines(order.billing_address)" :key="idx">
              {{ line }}
            </p>
          </address>
        </div>
      </div>

      <!-- Notes -->
      <div v-if="order.customer_notes" class="bg-white dark:bg-dark-200 rounded-xl shadow-sm dark:shadow-black/50 p-6 mb-4">
        <h2 class="font-medium text-pif-black dark:text-white mb-2">Your notes</h2>
        <p class="text-sm text-gray-600 dark:text-gray-300">{{ order.customer_notes }}</p>
      </div>

      <!-- Cancel -->
      <div v-if="canCancel" class="text-right">
        <button
          type="button"
          class="px-5 py-2.5 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
          :disabled="isCancelling"
          @click="cancelOrder"
        >
          {{ isCancelling ? 'Cancelling…' : 'Cancel Order' }}
        </button>
      </div>
    </template>
  </div>
</template>
