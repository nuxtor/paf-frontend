<script setup lang="ts">
const cartStore = useCartStore()
const { getAssetUrl } = useAsset()

useSeoMeta({
  title: 'Shopping Cart | Premium Abrahimic Foods',
})

const breadcrumbs = [{ label: 'Cart' }]

// Coupon form
const couponInput = ref('')
const isApplyingCoupon = ref(false)

const handleApplyCoupon = async () => {
  if (!couponInput.value.trim()) return
  isApplyingCoupon.value = true
  try {
    await cartStore.applyCoupon(couponInput.value.trim())
    couponInput.value = ''
  } catch {
    // Toast handled by store
  } finally {
    isApplyingCoupon.value = false
  }
}

onMounted(() => {
  cartStore.fetchCart()
})
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="container py-8">
      <TheBreadcrumb :items="breadcrumbs" />

      <h1 class="font-heading text-3xl text-pif-black mb-8">Shopping Cart</h1>

      <!-- Loading State -->
      <div v-if="cartStore.isLoading && cartStore.isEmpty" class="bg-white rounded-xl shadow-sm p-8 text-center">
        <div class="animate-spin w-8 h-8 border-4 border-pif-green-dark border-t-transparent rounded-full mx-auto mb-4" />
        <p class="text-gray-500">Loading your cart...</p>
      </div>

      <!-- Empty Cart -->
      <div v-else-if="cartStore.isEmpty" class="bg-white rounded-xl shadow-sm p-8 text-center">
        <Icon name="heroicons:shopping-cart" class="w-20 h-20 text-gray-300 mx-auto mb-4" />
        <h2 class="text-xl font-medium text-gray-700 mb-2">Your cart is empty</h2>
        <p class="text-gray-500 mb-6">
          Looks like you haven't added any items to your cart yet.
        </p>
        <NuxtLink
          to="/products"
          class="inline-flex items-center gap-2 px-6 py-3 bg-pif-green-dark text-white font-medium rounded-lg hover:bg-pif-green transition-colors"
        >
          Start Shopping
          <Icon name="heroicons:arrow-right" class="w-5 h-5" />
        </NuxtLink>
      </div>

      <!-- Cart with Items -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2 space-y-4">
          <div
            v-for="item in cartStore.items"
            :key="item.key"
            class="bg-white rounded-xl shadow-sm p-4 flex gap-4"
          >
            <!-- Product Image -->
            <div class="flex-shrink-0">
              <img
                v-if="item.image"
                :src="getAssetUrl(item.image)"
                :alt="item.name"
                class="w-24 h-24 object-cover rounded-lg"
              />
              <div
                v-else
                class="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center"
              >
                <Icon name="heroicons:photo" class="w-8 h-8 text-gray-300" />
              </div>
            </div>

            <!-- Product Details -->
            <div class="flex-1">
              <h3 class="font-medium text-pif-black">
                {{ item.name }}
              </h3>
              <p v-if="item.variant_name" class="text-sm text-gray-500">{{ item.variant_name }}</p>
              <p class="text-xs text-gray-400 mt-0.5">SKU: {{ item.sku }}</p>
              <p class="font-semibold text-pif-green-dark mt-1">
                {{ formatCurrency(item.unit_price) }}
              </p>
            </div>

            <!-- Quantity & Remove -->
            <div class="flex flex-col items-end justify-between">
              <button
                class="text-gray-400 hover:text-red-500 transition-colors"
                :disabled="cartStore.isLoading"
                @click="cartStore.removeItem(item.key)"
              >
                <Icon name="heroicons:trash" class="w-5 h-5" />
              </button>

              <div class="flex items-center border border-gray-300 rounded-lg">
                <button
                  class="px-2 py-1 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  :disabled="item.quantity <= 1 || cartStore.isLoading"
                  @click="cartStore.updateQuantity(item.key, item.quantity - 1)"
                >
                  <Icon name="heroicons:minus" class="w-4 h-4" />
                </button>
                <span class="px-3 py-1 text-sm">{{ item.quantity }}</span>
                <button
                  class="px-2 py-1 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  :disabled="cartStore.isLoading"
                  @click="cartStore.updateQuantity(item.key, item.quantity + 1)"
                >
                  <Icon name="heroicons:plus" class="w-4 h-4" />
                </button>
              </div>

              <p class="text-sm font-medium text-gray-700">
                {{ formatCurrency(item.total) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <h2 class="font-heading text-xl text-pif-black mb-4">Order Summary</h2>

            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal ({{ cartStore.itemCount }} items)</span>
                <span class="font-medium">{{ formatCurrency(cartStore.subtotal) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Shipping</span>
                <span class="font-medium">
                  {{ cartStore.shippingTotal > 0 ? formatCurrency(cartStore.shippingTotal) : 'Calculated at checkout' }}
                </span>
              </div>
              <div v-if="cartStore.discountTotal > 0" class="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-{{ formatCurrency(cartStore.discountTotal) }}</span>
              </div>
            </div>

            <!-- Coupon Code -->
            <div class="border-t my-4 pt-4">
              <div v-if="cartStore.couponCode" class="flex items-center justify-between bg-green-50 rounded-lg p-3">
                <div class="flex items-center gap-2">
                  <Icon name="heroicons:tag" class="w-4 h-4 text-green-600" />
                  <span class="text-sm font-medium text-green-700">{{ cartStore.couponCode }}</span>
                </div>
                <button
                  class="text-sm text-red-500 hover:text-red-700"
                  :disabled="cartStore.isLoading"
                  @click="cartStore.removeCoupon()"
                >
                  Remove
                </button>
              </div>
              <div v-else class="flex gap-2">
                <input
                  v-model="couponInput"
                  type="text"
                  placeholder="Promo code"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pif-green focus:border-pif-green"
                  @keyup.enter="handleApplyCoupon"
                />
                <button
                  class="px-4 py-2 bg-pif-green-dark text-white text-sm font-medium rounded-lg hover:bg-pif-green transition-colors disabled:opacity-50"
                  :disabled="isApplyingCoupon || !couponInput.trim()"
                  @click="handleApplyCoupon"
                >
                  Apply
                </button>
              </div>
            </div>

            <div class="border-t my-4 pt-4">
              <div class="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span class="text-pif-green-dark">{{ formatCurrency(cartStore.total) }}</span>
              </div>
            </div>

            <NuxtLink
              to="/checkout"
              class="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-pif-green-dark text-white font-medium rounded-lg hover:bg-pif-green transition-colors"
            >
              Proceed to Checkout
              <Icon name="heroicons:arrow-right" class="w-5 h-5" />
            </NuxtLink>

            <NuxtLink
              to="/products"
              class="block text-center mt-4 text-sm text-pif-green-dark hover:underline"
            >
              Continue Shopping
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
