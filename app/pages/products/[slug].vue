<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string
const { getAssetUrl } = useAsset()

// TODO: Fetch product from API
const product = ref({
  id: 1,
  name: 'Marinated Halal Lamb Leg Steak (Boneless) Regular',
  slug: slug,
  sku: 'LAMB-001',
  short_description: 'Premium quality halal lamb leg steak, boneless and marinated',
  description: `
    <p>Our Marinated Halal Lamb Leg Steak is a premium cut that's perfect for grilling, roasting, or pan-frying. Each piece is carefully selected, hand-trimmed, and marinated with our special blend of spices to ensure maximum flavour and tenderness.</p>
    <p>Key features:</p>
    <ul>
      <li>100% Halal certified</li>
      <li>Boneless for easy preparation</li>
      <li>Pre-marinated for convenience</li>
      <li>Premium quality lamb</li>
    </ul>
  `,
  price: 16.99,
  compare_at_price: 19.99,
  featured_image: 'images/products/meat-products-07.jpg',
  images: [
    { id: 1, url: 'images/products/meat-products-07.jpg', alt: 'Product image 1', position: 1 },
    { id: 2, url: 'images/products/meat-products-08.jpg', alt: 'Product image 2', position: 2 },
    { id: 3, url: 'images/products/meat-products-09.jpg', alt: 'Product image 3', position: 3 },
  ],
  category: { id: 1, name: 'Halal Lamb', slug: 'halal-lamb' },
  category_id: 1,
  weight: 500,
  weight_unit: 'g' as const,
  stock_quantity: 50,
  stock_status: 'in_stock' as const,
  is_active: true,
  is_featured: true,
  is_new: true,
  halal_certified: true,
  has_variants: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
})

const selectedImage = ref(0)
const quantity = ref(1)
const cartStore = useCartStore()
const isAdding = ref(false)

const handleAddToCart = async () => {
  isAdding.value = true
  await cartStore.addItem(product.value.id, quantity.value)
  isAdding.value = false
}

const hasDiscount = computed(
  () => product.value.compare_at_price && product.value.compare_at_price > product.value.price
)

const discountPercentage = computed(() => {
  if (!hasDiscount.value) return 0
  return Math.round(
    ((product.value.compare_at_price! - product.value.price) / product.value.compare_at_price!) *
      100
  )
})

useSeoMeta({
  title: () => `${product.value.name} | Premium Abrahimic Foods`,
  description: () => product.value.short_description,
})

const breadcrumbs = computed(() => [
  { label: 'Products', to: '/products' },
  { label: product.value.category?.name || '', to: `/categories/${product.value.category?.slug}` },
  { label: product.value.name },
])
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="container py-8">
      <TheBreadcrumb :items="breadcrumbs" />

      <div class="bg-white rounded-xl shadow-sm p-6 md:p-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Product Images -->
          <div class="space-y-4">
            <!-- Main Image -->
            <div class="aspect-square rounded-xl overflow-hidden bg-gray-100">
              <img
                :src="getAssetUrl(product.images[selectedImage]?.url || product.featured_image)"
                :alt="product.name"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- Thumbnail Gallery -->
            <div v-if="product.images.length > 1" class="flex gap-2">
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
            <div class="flex gap-2">
              <PBadge v-if="product.is_new" variant="gold">New</PBadge>
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
                {{ formatCurrency(product.price) }}
              </span>
              <span v-if="hasDiscount" class="text-xl text-gray-400 line-through">
                {{ formatCurrency(product.compare_at_price!) }}
              </span>
            </div>

            <!-- Short Description -->
            <p class="text-gray-600">{{ product.short_description }}</p>

            <!-- Weight -->
            <p v-if="product.weight" class="text-sm text-gray-500">
              Weight: {{ product.weight }}{{ product.weight_unit }}
            </p>

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
        <div class="mt-12 pt-8 border-t">
          <h2 class="font-heading text-xl text-pif-black mb-4">Product Description</h2>
          <div class="prose prose-gray max-w-none" v-html="product.description" />
        </div>
      </div>
    </div>
  </div>
</template>
