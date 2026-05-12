<script setup lang="ts">
const cartStore = useCartStore()
const uiStore = useUiStore()
const route = useRoute()

const isHiddenRoute = computed(() => {
  const path = route.path
  return path === '/cart' || path.startsWith('/checkout')
})

const isVisible = computed(() => !cartStore.isEmpty && !isHiddenRoute.value)
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 translate-x-4"
    enter-to-class="opacity-100 translate-x-0"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 translate-x-0"
    leave-to-class="opacity-0 translate-x-4"
  >
    <button
      v-if="isVisible"
      type="button"
      aria-label="Open cart"
      class="fixed right-4 md:right-6 bottom-6 md:bottom-8 z-40 flex items-center gap-3 pl-4 pr-5 py-3 rounded-full shadow-lg shadow-black/20 dark:shadow-black/60 bg-pif-green-dark dark:bg-pif-gold text-white dark:text-pif-black hover:bg-pif-green dark:hover:bg-pif-gold-light transition-colors"
      @click="uiStore.openCart()"
    >
      <span class="relative flex items-center justify-center">
        <Icon name="heroicons:shopping-bag" class="w-6 h-6" />
        <span
          class="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 rounded-full text-[11px] font-semibold flex items-center justify-center bg-pif-gold dark:bg-pif-green-dark text-pif-black dark:text-white"
        >
          {{ cartStore.itemCount }}
        </span>
      </span>
      <span class="font-semibold text-sm md:text-base">
        {{ formatCurrency(cartStore.total) }}
      </span>
    </button>
  </Transition>
</template>
