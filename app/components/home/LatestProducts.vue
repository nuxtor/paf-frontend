<script setup lang="ts">
const productsStore = useProductsStore()
const { getAssetUrl } = useAsset()

onMounted(() => {
  if (productsStore.latestProducts.length === 0) {
    productsStore.fetchLatestProducts()
  }
})
</script>

<template>
  <section class="section-padding bg-white dark:bg-pif-black">
    <div class="container">
      <!-- Header -->
      <div class="flex items-center justify-between mb-10">
        <h2 class="font-heading text-3xl md:text-4xl text-pif-black dark:text-white">
          Latest Products
        </h2>
        <NuxtLink
          to="/products"
          class="inline-flex items-center gap-2 px-4 py-2 bg-pif-green-dark dark:bg-pif-gold text-white dark:text-pif-black text-sm font-medium rounded-lg hover:bg-pif-green dark:hover:bg-pif-gold-light transition-colors"
        >
          View All...
        </NuxtLink>
      </div>

      <!-- Loading -->
      <div
        v-if="productsStore.isLoading && productsStore.latestProducts.length === 0"
        class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
      >
        <div
          v-for="i in 4"
          :key="i"
          class="aspect-square bg-gray-100 dark:bg-dark-200 rounded-xl animate-pulse"
        />
      </div>

      <!-- Empty -->
      <div
        v-else-if="productsStore.latestProducts.length === 0"
        class="text-center py-12 text-gray-500 dark:text-gray-400"
      >
        No products available right now.
      </div>

      <!-- Products Grid -->
      <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <article
          v-for="product in productsStore.latestProducts"
          :key="product.id"
          class="group bg-white dark:bg-dark-200 rounded-xl shadow-sm hover:shadow-md dark:shadow-black/50 transition-shadow border border-transparent dark:border-dark-600"
        >
          <!-- Image -->
          <NuxtLink
            :to="`/products/${product.slug}`"
            class="block aspect-square overflow-hidden rounded-t-xl bg-gray-100 dark:bg-dark-300"
          >
            <img
              v-if="product.featured_image"
              :src="getAssetUrl(product.featured_image)"
              :alt="product.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600"
            >
              <Icon name="heroicons:photo" class="w-12 h-12" />
            </div>
          </NuxtLink>

          <!-- Content -->
          <div class="p-4">
            <p class="text-xs text-pif-green dark:text-pif-gold mb-1">
              {{ product.category?.name }}
            </p>
            <NuxtLink :to="`/products/${product.slug}`">
              <h3 class="font-medium text-sm text-pif-black dark:text-white line-clamp-2 hover:text-pif-green-dark dark:hover:text-pif-gold transition-colors">
                {{ product.name }}
              </h3>
            </NuxtLink>
            <p class="text-pif-green-dark dark:text-pif-gold font-semibold mt-2">
              {{ formatCurrency(product.price) }}
            </p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
