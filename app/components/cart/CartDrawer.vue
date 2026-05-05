<script setup lang="ts">
const cartStore = useCartStore()
const uiStore = useUiStore()
const { getAssetUrl } = useAsset()

// Prevent body scroll when drawer is open
watch(
  () => uiStore.isCartOpen,
  (isOpen) => {
    if (import.meta.client) {
      document.body.style.overflow = isOpen ? 'hidden' : ''
    }
  }
)

const handleCheckout = () => {
  uiStore.closeCart()
  navigateTo('/checkout')
}

const handleViewCart = () => {
  uiStore.closeCart()
  navigateTo('/cart')
}
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="fade">
      <div
        v-if="uiStore.isCartOpen"
        class="fixed inset-0 bg-black/50 z-50"
        @click="uiStore.closeCart"
      />
    </Transition>

    <!-- Drawer -->
    <Transition name="slide-right">
      <div
        v-if="uiStore.isCartOpen"
        class="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-xl"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b">
          <h2 class="font-heading text-xl text-pif-black">
            Your Cart ({{ cartStore.itemCount }})
          </h2>
          <button
            class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            @click="uiStore.closeCart"
          >
            <Icon name="heroicons:x-mark" class="w-6 h-6" />
          </button>
        </div>

        <!-- Cart Items -->
        <div class="flex-1 overflow-y-auto p-4">
          <!-- Loading -->
          <div v-if="cartStore.isLoading && cartStore.isEmpty" class="flex items-center justify-center h-32">
            <div class="animate-spin w-6 h-6 border-3 border-pif-green-dark border-t-transparent rounded-full" />
          </div>

          <!-- Empty -->
          <div v-else-if="cartStore.isEmpty" class="text-center py-12">
            <Icon name="heroicons:shopping-bag" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p class="text-gray-500 mb-4">Your cart is empty</p>
            <button
              class="text-sm font-medium text-pif-green-dark hover:underline"
              @click="uiStore.closeCart"
            >
              Continue Shopping
            </button>
          </div>

          <!-- Items -->
          <div v-else class="space-y-4">
            <div
              v-for="item in cartStore.items"
              :key="item.key"
              class="flex gap-3"
            >
              <!-- Image -->
              <div class="flex-shrink-0">
                <img
                  v-if="item.image"
                  :src="getAssetUrl(item.image)"
                  :alt="item.name"
                  class="w-16 h-16 object-cover rounded-lg"
                />
                <div
                  v-else
                  class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center"
                >
                  <Icon name="heroicons:photo" class="w-6 h-6 text-gray-300" />
                </div>
              </div>

              <!-- Details -->
              <div class="flex-1 min-w-0">
                <h3 class="text-sm font-medium text-pif-black truncate">{{ item.name }}</h3>
                <p v-if="item.variant_name" class="text-xs text-gray-500">{{ item.variant_name }}</p>
                <p class="text-sm font-semibold text-pif-green-dark mt-1">
                  {{ formatCurrency(item.unit_price) }}
                </p>

                <!-- Quantity controls -->
                <div class="flex items-center gap-2 mt-2">
                  <div class="flex items-center border border-gray-300 rounded">
                    <button
                      class="px-1.5 py-0.5 text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-50"
                      :disabled="item.quantity <= 1 || cartStore.isLoading"
                      @click="cartStore.updateQuantity(item.key, item.quantity - 1)"
                    >
                      <Icon name="heroicons:minus" class="w-3 h-3" />
                    </button>
                    <span class="px-2 py-0.5 text-xs">{{ item.quantity }}</span>
                    <button
                      class="px-1.5 py-0.5 text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-50"
                      :disabled="cartStore.isLoading"
                      @click="cartStore.updateQuantity(item.key, item.quantity + 1)"
                    >
                      <Icon name="heroicons:plus" class="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    class="text-gray-400 hover:text-red-500 transition-colors"
                    :disabled="cartStore.isLoading"
                    @click="cartStore.removeItem(item.key)"
                  >
                    <Icon name="heroicons:trash" class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <!-- Line total -->
              <div class="text-sm font-medium text-gray-700">
                {{ formatCurrency(item.total) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div v-if="!cartStore.isEmpty" class="border-t p-4 space-y-3">
          <div class="flex justify-between font-semibold text-lg">
            <span>Subtotal</span>
            <span class="text-pif-green-dark">{{ formatCurrency(cartStore.subtotal) }}</span>
          </div>
          <p class="text-xs text-gray-500">Shipping and taxes calculated at checkout</p>
          <button
            class="w-full py-3 bg-pif-gold text-pif-black font-medium rounded-lg hover:bg-pif-gold-light transition-colors"
            @click="handleCheckout"
          >
            Checkout
          </button>
          <button
            class="w-full py-3 border border-pif-green-dark text-pif-green-dark font-medium rounded-lg hover:bg-pif-green-dark hover:text-white transition-colors"
            @click="handleViewCart"
          >
            View Cart
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
