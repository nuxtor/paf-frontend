<script setup lang="ts">
const cmsStore = useCmsStore()
const productsStore = useProductsStore()
const { getAssetUrl } = useAsset()
const { cmsImageUrl } = useCms()

onMounted(() => {
  if (!productsStore.categories.length) {
    productsStore.fetchCategories()
  }
})

const categories = computed(() => {
  if (cmsStore.featuredCategories.length > 0) return cmsStore.featuredCategories
  return productsStore.categories
})

const resolveCategoryImage = (image?: string) => {
  if (!image) return getAssetUrl('images/category-placeholder.jpg')
  return cmsImageUrl(image)
}
</script>

<template>
  <section v-if="categories.length" class="section-padding bg-pif-cream dark:bg-dark-100">
    <div class="container">
      <div class="text-center mb-10">
        <h2 class="font-heading text-3xl md:text-4xl text-pif-black dark:text-white mb-4">
          Shop by Category
        </h2>
        <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Explore our wide range of premium halal products
        </p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        <NuxtLink
          v-for="category in categories"
          :key="category.id"
          :to="`/categories/${category.slug}`"
          class="group relative aspect-square rounded-xl overflow-hidden bg-white dark:bg-dark-200 shadow-sm hover:shadow-lg dark:shadow-black/50 transition-shadow"
        >
          <img
            :src="resolveCategoryImage(category.image)"
            :alt="category.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div class="absolute inset-0 flex flex-col items-center justify-end p-4 text-white">
            <h3 class="font-heading text-xl md:text-2xl text-center">
              {{ category.name }}
            </h3>
          </div>
        </NuxtLink>
      </div>

      <div class="text-center mt-10">
        <NuxtLink
          to="/products"
          class="inline-flex items-center gap-2 px-6 py-3 bg-pif-green-dark dark:bg-pif-gold text-white dark:text-pif-black font-medium rounded-lg hover:bg-pif-green dark:hover:bg-pif-gold-light transition-colors"
        >
          Browse All...
          <Icon name="heroicons:arrow-right" class="w-5 h-5" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
