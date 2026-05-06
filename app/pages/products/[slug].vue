<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string
const { getAssetUrl } = useAsset()
const productsStore = useProductsStore()
const cartStore = useCartStore()

const { data: product, error } = await useAsyncData(`product-${slug}`, () =>
  productsStore.fetchProduct(slug)
)

if (!product.value && !error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Product not found' })
}

const selectedImage = ref(0)
const quantity = ref(1)
const selectedVariantId = ref<number | null>(null)
const isAdding = ref(false)

// Default to first variant if product has variants
watchEffect(() => {
  if (product.value?.has_variants && product.value.variants?.length && !selectedVariantId.value) {
    selectedVariantId.value = product.value.variants[0].id
  }
})

const selectedVariant = computed(() =>
  product.value?.variants?.find(v => v.id === selectedVariantId.value)
)

const displayPrice = computed(() => selectedVariant.value?.price ?? product.value?.price ?? 0)
const displayCompareAt = computed(
  () => selectedVariant.value?.compare_at_price ?? product.value?.compare_at_price
)

const hasDiscount = computed(
  () => !!displayCompareAt.value && displayCompareAt.value > displayPrice.value
)

const discountPercentage = computed(() => {
  if (!hasDiscount.value || !displayCompareAt.value) return 0
  return Math.round(((displayCompareAt.value - displayPrice.value) / displayCompareAt.value) * 100)
})

const handleAddToCart = async () => {
  if (!product.value) return
  isAdding.value = true
  try {
    await cartStore.addItem(product.value.id, quantity.value, selectedVariantId.value ?? undefined)
  } finally {
    isAdding.value = false
  }
}

useSeoMeta({
  title: () => `${product.value?.name ?? 'Product'} | Premium Abrahimic Foods`,
  description: () => product.value?.short_description ?? '',
})

const breadcrumbs = computed(() => [
  { label: 'Products', to: '/products' },
  {
    label: product.value?.category?.name || '',
    to: `/categories/${product.value?.category?.slug}`,
  },
  { label: product.value?.name || '' },
])
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="container py-8">
      <TheBreadcrumb :items="breadcrumbs" />

      <div v-if="!product" class="bg-white rounded-xl shadow-sm p-8 text-center">
        <p class="text-gray-500">Product not found.</p>
      </div>

      <div v-else class="bg-white rounded-xl shadow-sm p-6 md:p-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Product Images -->
          <div class="space-y-4">
            <div class="aspect-square rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
              <img
                v-if="product.images[selectedImage]?.url || product.featured_image"
                :src="getAssetUrl(product.images[selectedImage]?.url || product.featured_image)"
                :alt="product.name"
                class="w-full h-full object-cover"
              />
              <Icon v-else name="heroicons:photo" class="w-24 h-24 text-gray-300" />
            </div>

            <div v-if="product.images.length > 1" class="flex gap-2 flex-wrap">
              <button
                v-for="(image, index) in product.images"
                :key="image.id"
                :class="[
                  'w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors',
                  selectedImage === index ? 'border-pif-green-dark' : 'border-transparent',
                ]"
                @click="selectedImage = index"
              >
                <img :src="getAssetUrl(image.url)" :alt="image.alt" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>

          <!-- Product Info -->
          <div class="space-y-6">
            <!-- Badges -->
            <div class="flex gap-2 flex-wrap">
              <PBadge v-if="hasDiscount" variant="error">{{ discountPercentage }}% Off</PBadge>
              <PBadge v-if="product.halal_certified" variant="success">
                <Icon name="heroicons:check-badge" class="w-3 h-3 mr-1" />
                Halal Certified
              </PBadge>
            </div>

            <!-- Title -->
            <div>
              <p class="text-sm text-pif-green mb-1">{{ product.category?.name }}</p>
              <h1 class="font-heading text-2xl md:text-3xl text-pif-black">
                {{ product.name }}
              </h1>
            </div>

            <!-- Price -->
            <div class="flex items-baseline gap-3">
              <span class="text-3xl font-bold text-pif-green-dark">
                {{ formatCurrency(displayPrice) }}
              </span>
              <span v-if="hasDiscount" class="text-xl text-gray-400 line-through">
                {{ formatCurrency(displayCompareAt!) }}
              </span>
            </div>

            <!-- Short Description -->
            <p class="text-gray-600">{{ product.short_description }}</p>

            <!-- Variant Selector -->
            <div v-if="product.has_variants && product.variants?.length" class="space-y-2">
              <label class="text-sm font-medium text-gray-700">Select option</label>
              <div class="grid grid-cols-1 gap-2">
                <button
                  v-for="variant in product.variants"
                  :key="variant.id"
                  type="button"
                  :class="[
                    'flex items-center justify-between px-4 py-3 border rounded-lg text-left transition-colors',
                    selectedVariantId === variant.id
                      ? 'border-pif-green-dark bg-pif-green-dark/5'
                      : 'border-gray-300 hover:border-pif-green',
                  ]"
                  @click="selectedVariantId = variant.id"
                >
                  <span class="text-sm font-medium">{{ variant.name }}</span>
                  <span class="text-sm font-semibold text-pif-green-dark">
                    {{ formatCurrency(variant.price) }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Stock Status -->
            <div class="flex items-center gap-2">
              <span
                :class="[
                  'w-2 h-2 rounded-full',
                  product.stock_status === 'in_stock' ? 'bg-green-500' : 'bg-red-500',
                ]"
              />
              <span class="text-sm">
                {{ product.stock_status === 'in_stock' ? 'In Stock' : 'Out of Stock' }}
              </span>
            </div>

            <!-- Quantity & Add to Cart -->
            <div class="flex items-center gap-4">
              <div class="flex items-center border border-gray-300 rounded-lg">
                <button
                  class="px-3 py-2 hover:bg-gray-100 transition-colors"
                  :disabled="quantity <= 1"
                  @click="quantity--"
                >
                  <Icon name="heroicons:minus" class="w-4 h-4" />
                </button>
                <input
                  v-model.number="quantity"
                  type="number"
                  min="1"
                  class="w-16 text-center border-x border-gray-300 py-2 focus:outline-none"
                />
                <button
                  class="px-3 py-2 hover:bg-gray-100 transition-colors"
                  @click="quantity++"
                >
                  <Icon name="heroicons:plus" class="w-4 h-4" />
                </button>
              </div>

              <PButton
                variant="primary"
                size="lg"
                :loading="isAdding"
                :disabled="product.stock_status !== 'in_stock'"
                class="flex-1"
                @click="handleAddToCart"
              >
                Add to Cart
              </PButton>
            </div>

            <!-- SKU -->
            <p class="text-xs text-gray-400">SKU: {{ product.sku }}</p>
          </div>
        </div>

        <!-- Product Description -->
        <div v-if="product.description" class="mt-12 pt-8 border-t">
          <h2 class="font-heading text-xl text-pif-black mb-4">Product Description</h2>
          <div class="prose prose-gray max-w-none" v-html="product.description" />
        </div>

        <!-- Ingredients & Allergens -->
        <div v-if="product.ingredients || product.allergens?.length" class="mt-8 pt-8 border-t grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-if="product.ingredients">
            <h3 class="font-heading text-lg text-pif-black mb-2">Ingredients</h3>
            <p class="text-sm text-gray-600">{{ product.ingredients }}</p>
          </div>
          <div v-if="product.allergens?.length">
            <h3 class="font-heading text-lg text-pif-black mb-2">Allergens</h3>
            <p class="text-sm text-gray-600">{{ product.allergens.join(', ') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
