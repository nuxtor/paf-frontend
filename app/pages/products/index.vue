<script setup lang="ts">
import { PRODUCT_SORT_OPTIONS } from '~/utils/constants'

const route = useRoute()
const productsStore = useProductsStore()

const filters = ref({
  search: (route.query.search as string) || '',
  sort: (route.query.sort as string) || 'newest',
  page: Number(route.query.page) || 1,
})

useSeoMeta({
  title: () =>
    filters.value.search
      ? `Search: ${filters.value.search} | Premium Abrahimic Foods`
      : 'All Products | Premium Abrahimic Foods',
  description: 'Browse our full range of premium halal meat and food products.',
})

const loadProducts = () => {
  if (filters.value.search.trim()) {
    productsStore.searchProducts(filters.value.search.trim())
  } else {
    productsStore.fetchProducts({
      sort: filters.value.sort as any,
      page: filters.value.page,
    })
  }
}

onMounted(loadProducts)

watch(
  () => route.query.search,
  (q) => {
    filters.value.search = (q as string) || ''
    loadProducts()
  }
)

watch(
  () => filters.value.sort,
  () => {
    filters.value.page = 1
    loadProducts()
  }
)

const breadcrumbs = computed(() =>
  filters.value.search
    ? [{ label: 'Products', to: '/products' }, { label: `Search: ${filters.value.search}` }]
    : [{ label: 'Products' }]
)
</script>

<template>
  <div class="bg-gray-50 dark:bg-pif-black min-h-screen">
    <div class="container py-8">
      <TheBreadcrumb :items="breadcrumbs" />

      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 class="font-heading text-3xl text-pif-black">
          {{ filters.search ? `Search results for "${filters.search}"` : 'All Products' }}
        </h1>

        <!-- Filters -->
        <div class="flex items-center gap-4">
          <select
            v-model="filters.sort"
            class="px-4 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-200 text-pif-black dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pif-green dark:focus:ring-pif-gold"
          >
            <option v-for="option in PRODUCT_SORT_OPTIONS" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- Products Grid -->
      <div v-if="productsStore.isLoading" class="flex justify-center py-20">
        <PSpinner size="lg" />
      </div>

      <div v-else-if="productsStore.products.length === 0" class="text-center py-20">
        <Icon name="heroicons:shopping-bag" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 class="text-xl font-medium text-gray-700 mb-2">No products found</h2>
        <p class="text-gray-500">Try adjusting your filters or search terms.</p>
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        <ProductCard
          v-for="product in productsStore.products"
          :key="product.id"
          :product="product"
        />
      </div>

      <!-- Pagination placeholder -->
      <div v-if="productsStore.pagination.lastPage > 1" class="mt-8 flex justify-center">
        <!-- Pagination component to be added -->
      </div>
    </div>
  </div>
</template>
