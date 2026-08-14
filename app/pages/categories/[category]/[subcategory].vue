<script setup lang="ts">
import { PRODUCT_SORT_OPTIONS, MAIN_CATEGORIES } from '~/utils/constants'

const route = useRoute()
const categorySlug = route.params.category as string
const subcategorySlug = route.params.subcategory as string
const { getAssetUrl } = useAsset()
const productsStore = useProductsStore()

const parentCategory = computed(() =>
  MAIN_CATEGORIES.find(c => c.slug === categorySlug)
)

const subcategory = computed(() =>
  parentCategory.value?.children?.find(c => c.slug === subcategorySlug)
)

const filters = ref({
  category: subcategorySlug,
  sort: (route.query.sort as string) || 'newest',
  page: 1,
})

const fetchData = () => productsStore.fetchProducts(filters.value)

const hasMore = computed(
  () => productsStore.pagination.currentPage < productsStore.pagination.lastPage
)

const loadMore = async () => {
  if (productsStore.isLoading || productsStore.isLoadingMore || !hasMore.value) return
  filters.value.page += 1
  await productsStore.fetchProducts(filters.value, true)
}

watch(
  () => filters.value.sort,
  () => {
    filters.value.page = 1
    fetchData()
  }
)

// Infinite scroll sentinel
const sentinel = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
  fetchData()
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) loadMore()
    },
    { rootMargin: '400px' }
  )
})

// The sentinel only mounts after the initial load, so attach the observer
// whenever it appears/disappears from the DOM.
watch(sentinel, (el) => {
  if (!observer) return
  observer.disconnect()
  if (el) observer.observe(el)
})

onBeforeUnmount(() => {
  observer?.disconnect()
})

useSeoMeta({
  title: () => `${subcategory.value?.name || subcategorySlug} | ${parentCategory.value?.name || categorySlug} | Premium Abrahamic Foods`,
  description: () => `Browse our premium halal ${subcategory.value?.name?.toLowerCase() || subcategorySlug} products. Quality certified, delivered fresh.`,
})

const breadcrumbs = computed(() => [
  { label: 'Products', to: '/products' },
  { label: parentCategory.value?.name || categorySlug, to: `/categories/${categorySlug}` },
  { label: subcategory.value?.name || subcategorySlug },
])
</script>

<template>
  <div class="bg-gray-50 dark:bg-pif-black min-h-screen">
    <!-- Subcategory Hero -->
    <div class="relative h-48 md:h-64 bg-pif-green-dark">
      <div class="absolute inset-0 bg-gradient-to-r from-pif-green-dark to-pif-green opacity-90" />
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-center">
          <p class="text-pif-gold text-sm uppercase tracking-wider mb-2">
            {{ parentCategory?.name }}
          </p>
          <h1 class="font-heading text-4xl md:text-5xl text-white">
            {{ subcategory?.name || subcategorySlug }}
          </h1>
        </div>
      </div>
    </div>

    <div class="container py-8">
      <TheBreadcrumb :items="breadcrumbs" />

      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <p class="text-gray-600 dark:text-gray-400">
          {{ productsStore.pagination.total }} products
        </p>

        <!-- Sort -->
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

      <!-- Loading -->
      <div v-if="productsStore.isLoading" class="flex justify-center py-20">
        <PSpinner size="lg" />
      </div>

      <!-- Empty -->
      <div v-else-if="productsStore.products.length === 0" class="text-center py-20">
        <Icon name="heroicons:shopping-bag" class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h2 class="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No products found</h2>
        <p class="text-gray-500 dark:text-gray-400 mb-6">Check back soon for new arrivals in this category.</p>
        <NuxtLink
          :to="`/categories/${categorySlug}`"
          class="inline-flex items-center gap-2 px-6 py-3 bg-pif-green-dark dark:bg-pif-gold text-white dark:text-pif-black font-medium rounded-lg hover:bg-pif-green dark:hover:bg-pif-gold-light transition-colors"
        >
          <Icon name="heroicons:arrow-left" class="w-5 h-5" />
          Back to {{ parentCategory?.name }}
        </NuxtLink>
      </div>

      <!-- Products -->
      <template v-else>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        <article
          v-for="product in productsStore.products"
          :key="product.id"
          class="group relative bg-white dark:bg-dark-200 rounded-xl shadow-sm hover:shadow-md dark:shadow-black/50 transition-shadow border-[3px] border-pif-green-dark"
        >
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
            <div v-else class="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
              <Icon name="heroicons:photo" class="w-12 h-12" />
            </div>
          </NuxtLink>

          <div class="absolute top-3 left-3 flex flex-col gap-2">
            <PBadge v-if="product.halal_certified" variant="success">
              <Icon name="heroicons:check-badge" class="w-3 h-3 mr-1" />
              Halal
            </PBadge>
          </div>

          <div class="p-4">
            <p class="text-xs text-pif-green dark:text-pif-gold mb-1">
              {{ product.category?.name }}
            </p>
            <NuxtLink :to="`/products/${product.slug}`">
              <h3 class="font-medium text-sm text-pif-black dark:text-white line-clamp-2 hover:text-pif-green-dark dark:hover:text-pif-gold transition-colors">
                {{ product.name }}
              </h3>
            </NuxtLink>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
              {{ product.short_description }}
            </p>
            <p class="text-pif-green-dark dark:text-pif-gold font-semibold mt-2">
              {{ formatCurrency(product.price) }}
            </p>
          </div>
        </article>
      </div>

        <!-- Load-more spinner -->
        <div v-if="productsStore.isLoadingMore" class="flex justify-center py-10">
          <PSpinner size="md" />
        </div>

        <!-- Infinite scroll sentinel -->
        <div ref="sentinel" class="h-px w-full" aria-hidden="true" />
      </template>

      <div class="text-center mt-12">
        <NuxtLink
          :to="`/categories/${categorySlug}`"
          class="inline-flex items-center gap-2 text-pif-green-dark dark:text-pif-gold hover:underline"
        >
          <Icon name="heroicons:arrow-left" class="w-5 h-5" />
          View all {{ parentCategory?.name }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
