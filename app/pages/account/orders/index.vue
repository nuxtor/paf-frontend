<script setup lang="ts">
import { ORDER_STATUSES, PAYMENT_STATUSES } from '~/utils/constants'

definePageMeta({
  layout: 'account',
})

interface OrderListItem {
  order_number: string
  status: string
  payment_status: string
  total: string | number
  currency: string
  created_at: string
  items?: Array<{ name: string; quantity: number }>
}

const { apiFetch } = useApi()

const orders = ref<OrderListItem[]>([])
const isLoading = ref(true)

const fetchOrders = async () => {
  isLoading.value = true
  try {
    const response = await apiFetch<{ data: OrderListItem[] }>('/orders')
    orders.value = response.data
  } catch (error) {
    console.error('Failed to fetch orders', error)
    orders.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchOrders)

const toNum = (v: string | number) => (typeof v === 'string' ? parseFloat(v) : v)

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(new Date(date))

useSeoMeta({
  title: 'Order History | Premium Abrahimic Foods',
})
</script>

<template>
  <div>
    <h1 class="font-heading text-2xl text-pif-black mb-6">Order History</h1>

    <!-- Loading -->
    <div v-if="isLoading" class="bg-white rounded-xl shadow-sm p-8 text-center">
      <PSpinner size="md" />
    </div>

    <!-- Empty -->
    <div
      v-else-if="orders.length === 0"
      class="bg-white rounded-xl shadow-sm overflow-hidden"
    >
      <div class="p-8 text-center text-gray-500">
        <Icon name="heroicons:shopping-bag" class="w-12 h-12 mx-auto mb-3 text-gray-300" />
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
        class="bg-white rounded-xl shadow-sm p-6"
      >
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <p class="text-xs text-gray-500">Order</p>
            <p class="font-medium text-pif-black">{{ order.order_number }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500">Date</p>
            <p class="text-sm">{{ formatDate(order.created_at) }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500">Status</p>
            <PBadge :variant="(ORDER_STATUSES[order.status]?.color as any) || 'gray'">
              {{ ORDER_STATUSES[order.status]?.label || order.status }}
            </PBadge>
          </div>
          <div>
            <p class="text-xs text-gray-500">Payment</p>
            <PBadge :variant="(PAYMENT_STATUSES[order.payment_status]?.color as any) || 'gray'">
              {{ PAYMENT_STATUSES[order.payment_status]?.label || order.payment_status }}
            </PBadge>
          </div>
          <div class="md:text-right">
            <p class="text-xs text-gray-500">Total</p>
            <p class="font-semibold text-pif-green-dark">
              {{ formatCurrency(toNum(order.total)) }}
            </p>
          </div>
        </div>

        <div v-if="order.items?.length" class="border-t pt-4 text-sm text-gray-600">
          <p class="line-clamp-1">
            {{ order.items.map(i => `${i.quantity}× ${i.name}`).join(', ') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
