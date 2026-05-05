<script setup lang="ts">
import { PRODUCT_SORT_OPTIONS, MAIN_CATEGORIES } from '~/utils/constants'

const route = useRoute()
const slug = route.params.slug as string
const productsStore = useProductsStore()
const { getAssetUrl } = useAsset()

const category = computed(() => productsStore.getCategoryBySlug(slug))

// Get subcategories from MAIN_CATEGORIES
const mainCategory = computed(() => MAIN_CATEGORIES.find(c => c.slug === slug))
const subcategories = computed(() => mainCategory.value?.children || [])

const filters = ref({
  category: slug,
  sort: (route.query.sort as string) || 'newest',
  page: Number(route.query.page) || 1,
})

useSeoMeta({
  title: () => `${category.value?.name || 'Category'} | Premium Abrahimic Foods`,
  description: () => category.value?.description || 'Browse our premium halal products.',
})

onMounted(() => {
  productsStore.fetchCategories()
  productsStore.fetchProducts(filters.value)
})

const breadcrumbs = computed(() => [
  { label: 'Products', to: '/products' },
  { label: category.value?.name || slug },
])
</script>

<template>
  <div class="bg-gray-50 dark:bg-pif-black min-h-screen">
    <!-- Category Hero -->
    <div
      v-if="category?.image"
      class="relative h-48 md:h-64 bg-pif-green-dark"
    >
      <img
        :src="getAssetUrl(category.image || '')"
        :alt="category.name"
        class="w-full h-full object-cover opacity-50"
      />
      <div class="absolute inset-0 flex items-center justify-center">
        <h1 class="font-heading text-4xl md:text-5xl text-white">
          {{ category?.name }}
        </h1>
      </div>
    </div>

    <div class="container py-8">
      <TheBreadcrumb :items="breadcrumbs" />

      <div v-if="!category?.image" class="mb-8">
        <h1 class="font-heading text-3xl text-pif-black dark:text-white">{{ category?.name || slug }}</h1>
        <p v-if="category?.description" class="text-gray-600 dark:text-gray-400 mt-2">
          {{ category.description }}
        </p>
      </div>

      <!-- Subcategories -->
      <div v-if="subcategories.length > 0" class="mb-10">
        <h2 class="font-heading text-xl text-pif-black dark:text-white mb-4">Browse by Type</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NuxtLink
            v-for="sub in subcategories"
            :key="sub.slug"
            :to="`/categories/${slug}/${sub.slug}`"
            class="group bg-white dark:bg-dark-200 rounded-xl shadow-sm hover:shadow-md dark:shadow-black/50 transition-all p-4 text-center border border-gray-100 dark:border-dark-600 hover:border-pif-green dark:hover:border-pif-gold"
          >
            <div class="w-12 h-12 mx-auto mb-3 bg-pif-cream dark:bg-dark-300 rounded-full flex items-center justify-center group-hover:bg-pif-green-dark dark:group-hover:bg-pif-gold transition-colors">
              <Icon name="heroicons:tag" class="w-6 h-6 text-pif-green dark:text-pif-gold group-hover:text-white dark:group-hover:text-pif-black transition-colors" />
            </div>
            <h3 class="font-medium text-pif-black dark:text-white group-hover:text-pif-green-dark dark:group-hover:text-pif-gold transition-colors">
              {{ sub.name }}
            </h3>
          </NuxtLink>
        </div>
      </div>

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

      <!-- Products Grid -->
      <div v-if="productsStore.isLoading" class="flex justify-center py-20">
        <PSpinner size="lg" />
      </div>

      <div v-else-if="productsStore.products.length === 0" class="text-center py-20">
        <Icon name="heroicons:shopping-bag" class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h2 class="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No products found</h2>
        <p class="text-gray-500 dark:text-gray-400">Check back soon for new arrivals.</p>
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        <ProductCard
          v-for="product in productsStore.products"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </div>
</template>
