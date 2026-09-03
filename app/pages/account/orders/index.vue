<script setup lang="ts">
import { ORDER_STATUSES, PAYMENT_STATUSES } from '~/utils/constants'
import type { Order } from '~/types/order'

definePageMeta({
  layout: 'account',
})

const { apiFetch } = useApi()

const orders = ref<Order[]>([])
const isLoading = ref(true)

const fetchOrders = async () => {
  isLoading.value = true
  try {
    // The API answers with { orders, meta } — there is no `data` envelope.
    const response = await apiFetch<{ orders: Order[] }>('/orders')
    orders.value = response.orders ?? []
  } catch (error) {
    console.error('Failed to fetch orders', error)
    orders.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchOrders)

useSeoMeta({
  title: 'Order History | Premium Abrahamic Foods',
})
</script>

<template>
  <div>
    <h1 class="font-heading text-2xl text-pif-black dark:text-white mb-6">Order History</h1>

    <!-- Loading -->
    <div v-if="isLoading" class="bg-white dark:bg-dark-200 rounded-xl shadow-sm dark:shadow-black/50 p-8 text-center">
      <PSpinner size="md" />
    </div>

    <!-- Empty -->
    <div
      v-else-if="orders.length === 0"
      class="bg-white dark:bg-dark-200 rounded-xl shadow-sm dark:shadow-black/50 overflow-hidden"
    >
      <div class="p-8 text-center text-gray-500 dark:text-gray-400">
        <Icon name="heroicons:shopping-bag" class="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-dark-700" />
        <p class="mb-4">You haven't placed any orders yet.</p>
        <NuxtLink
          to="/products"
          class="inline-flex items-center gap-2 px-6 py-3 bg-pif-green-dark text-white font-medium rounded-lg hover:bg-pif-green transition-colors"
        >
          Start Shopping
          <Icon name="heroicons:arrow-right" class="w-5 h-5" />
        </NuxtLink>
      </div>
    </div>

    <!-- Orders -->
    <div v-else class="space-y-4">
      <div
        v-for="order in orders"
        :key="order.order_number"
        class="bg-white dark:bg-dark-200 rounded-xl shadow-sm dark:shadow-black/50 p-6"
      >
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400">Order</p>
            <p class="font-medium text-pif-black dark:text-white">{{ order.order_number }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400">Date</p>
            <p class="text-sm">{{ formatDate(order.created_at) }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400">Status</p>
            <PBadge :variant="(ORDER_STATUSES[order.status]?.color as any) || 'default'">
              {{ ORDER_STATUSES[order.status]?.label || order.status }}
            </PBadge>
          </div>
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400">Payment</p>
            <PBadge :variant="(PAYMENT_STATUSES[order.payment_status]?.color as any) || 'default'">
              {{ PAYMENT_STATUSES[order.payment_status]?.label || order.payment_status }}
            </PBadge>
          </div>
          <div class="md:text-right">
            <p class="text-xs text-gray-500 dark:text-gray-400">Total</p>
            <p class="font-semibold text-pif-green-dark dark:text-green-400">
              {{ formatCurrency(toAmount(order.total)) }}
            </p>
          </div>
        </div>

        <div v-if="order.items?.length" class="border-t border-gray-200 dark:border-dark-600 pt-4 text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <div v-for="(i, idx) in order.items" :key="idx">
            <p>{{ formatOrderQty(i) }} × {{ orderItemLabel(i) }}</p>
            <p v-if="i.note" class="text-xs text-gray-500 dark:text-gray-500 italic">Note: {{ i.note }}</p>
          </div>
        </div>

        <div class="border-t border-gray-200 dark:border-dark-600 mt-4 pt-4">
          <NuxtLink
            :to="`/account/orders/${order.order_number}`"
            class="inline-flex items-center gap-2 text-sm font-medium text-pif-green-dark dark:text-pif-gold hover:underline"
          >
            View order details
            <Icon name="heroicons:arrow-right" class="w-4 h-4" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
