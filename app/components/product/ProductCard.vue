<script setup lang="ts">
import type { Product } from '~/types/product'

const props = defineProps<{
  product: Product
}>()

const cartStore = useCartStore()
const { getAssetUrl } = useAsset()
const isAdding = ref(false)

const handleQuickAdd = async () => {
  isAdding.value = true
  await cartStore.addItem(props.product.id, 1)
  isAdding.value = false
}

const formattedPrice = computed(() => formatCurrency(props.product.price))

const hasDiscount = computed(
  () =>
    props.product.compare_at_price && props.product.compare_at_price > props.product.price
)
</script>

<template>
  <article
    class="group relative bg-white dark:bg-dark-200 rounded-xl shadow-sm hover:shadow-md dark:shadow-black/50 transition-shadow duration-300 border border-transparent dark:border-dark-600"
  >
    <!-- Image -->
    <NuxtLink
      :to="`/products/${product.slug}`"
      class="block aspect-square overflow-hidden rounded-t-xl bg-pif-cream dark:bg-dark-300"
    >
      <img
        v-if="product.featured_image"
        :src="getAssetUrl(product.featured_image)"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div
        v-else
        class="w-full h-full flex flex-col items-center justify-center text-gray-300 dark:text-gray-600"
      >
        <Icon name="heroicons:photo" class="w-12 h-12 mb-1" />
        <span class="text-xs">No image</span>
      </div>
    </NuxtLink>

    <!-- Badges -->
    <div class="absolute top-3 left-3 flex flex-col gap-2">
      <PBadge v-if="product.is_new" variant="gold">New</PBadge>
      <PBadge v-if="hasDiscount" variant="error">Sale</PBadge>
      <PBadge v-if="product.halal_certified" variant="success">
        <Icon name="heroicons:check-badge" class="w-3 h-3 mr-1" />
        Halal
      </PBadge>
    </div>

    <!-- Quick Add Button -->
    <button
      v-if="!product.has_variants"
      class="absolute top-3 right-3 p-2 bg-white dark:bg-dark-300 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-pif-green-dark dark:hover:bg-pif-gold hover:text-white dark:hover:text-pif-black text-gray-700 dark:text-gray-300"
      :disabled="isAdding"
      @click.prevent="handleQuickAdd"
    >
      <Icon name="heroicons:plus" class="w-5 h-5" />
    </button>

    <!-- Content -->
    <div class="p-4">
      <p class="text-sm text-pif-green dark:text-pif-gold mb-1">{{ product.category?.name }}</p>

      <NuxtLink :to="`/products/${product.slug}`">
        <h3
          class="font-heading text-lg text-pif-black dark:text-white hover:text-pif-green-dark dark:hover:text-pif-gold transition-colors line-clamp-2"
        >
          {{ product.name }}
        </h3>
      </NuxtLink>

      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
        {{ product.short_description }}
      </p>

      <!-- Price -->
      <div class="mt-3 flex items-baseline gap-2">
        <span class="font-semibold text-pif-green-dark dark:text-pif-gold">{{ formattedPrice }}</span>
        <span v-if="hasDiscount" class="text-sm text-gray-400 line-through">
          {{ formatCurrency(product.compare_at_price!) }}
        </span>
      </div>

      <!-- Weight/Size info -->
      <p v-if="product.weight" class="text-xs text-gray-400 mt-1">
        {{ product.weight }}{{ product.weight_unit }}
      </p>
    </div>
  </article>
</template>
