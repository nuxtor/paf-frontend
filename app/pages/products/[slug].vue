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
const selectedOptions = ref<Record<string, string>>({})
const note = ref('')
const isAdding = ref(false)

// Product-level option definitions (e.g. Size: [Small, Large]). When present we
// render one selector per option and resolve the variant from the chosen values.
const productOptions = computed(() => product.value?.options ?? [])
const hasOptions = computed(() => productOptions.value.length > 0)

// Default each option to its first value / fall back to the first variant.
watchEffect(() => {
  if (!product.value?.has_variants) return
  if (hasOptions.value) {
    for (const option of productOptions.value) {
      if (!selectedOptions.value[option.name] && option.values.length) {
        selectedOptions.value = { ...selectedOptions.value, [option.name]: option.values[0] }
      }
    }
  } else if (product.value.variants?.length && !selectedVariantId.value) {
    selectedVariantId.value = product.value.variants[0].id
  }
})

const selectedVariant = computed(() => {
  const variants = product.value?.variants
  if (!variants?.length) return undefined

  // No structured options: fall back to the explicitly selected variant.
  if (!hasOptions.value) {
    return variants.find(v => v.id === selectedVariantId.value)
  }

  const selected = selectedOptions.value
  const selectedKeys = Object.keys(selected).filter(key => selected[key])

  // Prefer a variant whose attributes exactly match the full selection...
  const exact = variants.find(v => {
    const keys = Object.keys(v.attributes)
    return keys.length === selectedKeys.length && keys.every(k => v.attributes[k] === selected[k])
  })
  if (exact) return exact

  // ...otherwise the best variant whose every attribute matches a chosen value.
  return variants.find(v => {
    const keys = Object.keys(v.attributes)
    return keys.length > 0 && keys.every(k => v.attributes[k] === selected[k])
  })
})

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

// Quantity behaviour depends on whether the product is sold by weight.
const isWeight = computed(() => !!product.value?.sold_by_weight)

// Unit annotation for the price/quantity. A selected variant is a fixed pack,
// so it carries its own label (e.g. "500g") and the product-level per-weight
// unit ("kg" / "Per Kilogram") must not be appended. Only the no-variant,
// sold-by-weight case shows the product-level unit.
const priceUnit = computed(() =>
  selectedVariant.value
    ? selectedVariant.value.unit_label
    : isWeight.value
      ? product.value?.unit
      : undefined
)
const quantityUnitLabel = computed(() =>
  selectedVariant.value
    ? selectedVariant.value.unit_label
    : isWeight.value
      ? product.value?.unit_label
      : undefined
)
const qtyStep = computed(() => product.value?.quantity_step || (isWeight.value ? 0.1 : 1))
const minQty = computed(() => (isWeight.value ? qtyStep.value : 1))
const qtyDecimals = computed(() => {
  const s = String(qtyStep.value)
  return s.includes('.') ? s.split('.')[1]!.length : 0
})
const roundQty = (v: number) => {
  const p = 10 ** qtyDecimals.value
  return Math.round(v * p) / p
}
const incrementQty = () => {
  quantity.value = roundQty(quantity.value + qtyStep.value)
}
const decrementQty = () => {
  quantity.value = roundQty(Math.max(minQty.value, quantity.value - qtyStep.value))
}
const normalizeQty = () => {
  const v = Number(quantity.value)
  quantity.value = !v || v < minQty.value ? minQty.value : roundQty(v)
}

const handleAddToCart = async () => {
  if (!product.value) return
  isAdding.value = true
  try {
    // Omit the note entirely when blank so a re-add doesn't wipe an existing one.
    const trimmedNote = note.value.trim()
    await cartStore.addItem(
      product.value.id,
      quantity.value,
      selectedVariant.value?.id ?? undefined,
      trimmedNote || undefined
    )
    note.value = ''
  } finally {
    isAdding.value = false
  }
}

useSeoMeta({
  title: () => `${product.value?.name ?? 'Product'} | Premium Abrahamic Foods`,
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
  <div class="bg-gray-50 dark:bg-pif-black min-h-screen">
    <div class="container py-8">
      <TheBreadcrumb :items="breadcrumbs" />

      <div v-if="!product" class="bg-white dark:bg-dark-200 rounded-xl shadow-sm dark:shadow-black/50 p-8 text-center">
        <p class="text-gray-500 dark:text-gray-400">Product not found.</p>
      </div>

      <div v-else class="bg-white dark:bg-dark-200 rounded-xl shadow-sm dark:shadow-black/50 p-6 md:p-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Product Images -->
          <div class="space-y-4">
            <div class="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-dark-300 flex items-center justify-center">
              <img
                v-if="product.images[selectedImage]?.url || product.featured_image"
                :src="getAssetUrl(product.images[selectedImage]?.url || product.featured_image)"
                :alt="product.name"
                class="w-full h-full object-contain"
              />
              <Icon v-else name="heroicons:photo" class="w-24 h-24 text-gray-300 dark:text-gray-600" />
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

            <!-- Preparation weight-loss notice -->
            <p
              class="rounded-lg bg-pif-cream dark:bg-dark-300 border border-gray-200 dark:border-dark-600 px-4 py-3 text-sm text-gray-600 dark:text-gray-400"
            >
              <span class="font-medium text-pif-black dark:text-white">Please note:</span>
              The final meat weight will be lower after cleaning, de-fatting, trimming and cutting.
              All preparation is carried out free of charge.
            </p>
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
              <p class="text-sm text-pif-green dark:text-pif-gold mb-1">{{ product.category?.name }}</p>
              <h1 class="font-heading text-2xl md:text-3xl text-pif-black dark:text-white">
                {{ product.name }}
              </h1>
            </div>

            <!-- Price -->
            <div class="flex items-baseline gap-3">
              <span class="text-3xl font-bold text-pif-green-dark dark:text-pif-gold">
                {{ formatCurrency(displayPrice) }}
                <small v-if="priceUnit" class="text-lg font-normal text-gray-500 dark:text-gray-400">
                  / {{ priceUnit }}
                </small>
              </span>
              <span v-if="hasDiscount" class="text-xl text-gray-400 dark:text-gray-500 line-through">
                {{ formatCurrency(displayCompareAt!) }}
              </span>
            </div>

            <!-- Short Description -->
            <p class="text-gray-600 dark:text-gray-400">{{ product.short_description }}</p>

            <!-- Option-based Variant Selector -->
            <div v-if="hasOptions" class="space-y-4">
              <div v-for="option in productOptions" :key="option.name" class="space-y-2">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ option.name }}
                </label>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="value in option.values"
                    :key="value"
                    type="button"
                    :class="[
                      'px-4 py-2 border rounded-lg text-sm font-medium transition-colors text-pif-black dark:text-white',
                      selectedOptions[option.name] === value
                        ? 'border-pif-green-dark dark:border-pif-gold bg-pif-green-dark/5 dark:bg-pif-gold/10'
                        : 'border-gray-300 dark:border-dark-600 hover:border-pif-green dark:hover:border-pif-gold',
                    ]"
                    @click="selectedOptions = { ...selectedOptions, [option.name]: value }"
                  >
                    {{ value }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Fallback: variants without structured options -->
            <div
              v-else-if="product.has_variants && product.variants?.length"
              class="space-y-2"
            >
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Select option</label>
              <div class="grid grid-cols-1 gap-2">
                <button
                  v-for="variant in product.variants"
                  :key="variant.id"
                  type="button"
                  :class="[
                    'flex items-center justify-between px-4 py-3 border rounded-lg text-left transition-colors text-pif-black dark:text-white',
                    selectedVariantId === variant.id
                      ? 'border-pif-green-dark dark:border-pif-gold bg-pif-green-dark/5 dark:bg-pif-gold/10'
                      : 'border-gray-300 dark:border-dark-600 hover:border-pif-green dark:hover:border-pif-gold',
                  ]"
                  @click="selectedVariantId = variant.id"
                >
                  <span class="text-sm font-medium">{{ variant.name }}</span>
                  <span class="text-sm font-semibold text-pif-green-dark dark:text-pif-gold">
                    {{ formatCurrency(variant.price) }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Stock Status -->
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-green-500" />
              <span class="text-sm text-gray-700 dark:text-gray-300">In Stock</span>
            </div>

            <!-- Per-item note -->
            <div>
              <label
                for="product-note"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Preparation note <span class="text-gray-400 dark:text-gray-500">(optional)</span>
              </label>
              <textarea
                id="product-note"
                v-model="note"
                rows="2"
                maxlength="500"
                placeholder="e.g. cut into small pieces"
                class="w-full rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-300 text-pif-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-pif-green dark:focus:ring-pif-gold"
              />
              <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">
                We'll pass this to our butchers when packing your order.
              </p>
            </div>

            <!-- Quantity & Add to Cart -->
            <div class="flex items-center gap-4">
              <div class="flex items-center border border-gray-300 dark:border-dark-600 rounded-lg text-pif-black dark:text-white">
                <button
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors disabled:opacity-50"
                  :disabled="quantity <= minQty"
                  @click="decrementQty"
                >
                  <Icon name="heroicons:minus" class="w-4 h-4" />
                </button>
                <input
                  v-model.number="quantity"
                  type="number"
                  :min="minQty"
                  :step="qtyStep"
                  class="w-20 text-center border-x border-gray-300 dark:border-dark-600 bg-transparent py-2 focus:outline-none"
                  @change="normalizeQty"
                />
                <button
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors"
                  @click="incrementQty"
                >
                  <Icon name="heroicons:plus" class="w-4 h-4" />
                </button>
              </div>

              <span v-if="quantityUnitLabel" class="text-sm text-gray-500 dark:text-gray-400">
                {{ quantityUnitLabel }}
              </span>

              <PButton
                variant="primary"
                size="lg"
                :loading="isAdding"
                class="flex-1"
                @click="handleAddToCart"
              >
                Add to Cart
              </PButton>
            </div>

            <!-- SKU -->
            <p class="text-xs text-gray-400 dark:text-gray-500">SKU: {{ product.sku }}</p>

            <!-- Quality assurances -->
            <ProductAssurances class="pt-4 border-t border-gray-200 dark:border-dark-600" />
          </div>
        </div>

        <!-- Product Description -->
        <div v-if="product.description" class="mt-12 pt-8 border-t border-gray-200 dark:border-dark-600">
          <h2 class="font-heading text-xl text-pif-black dark:text-white mb-4">Product Description</h2>
          <div class="prose prose-gray dark:prose-invert max-w-none" v-html="product.description" />
        </div>

        <!-- Ingredients & Allergens -->
        <div v-if="product.ingredients || product.allergens?.length" class="mt-8 pt-8 border-t border-gray-200 dark:border-dark-600 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-if="product.ingredients">
            <h3 class="font-heading text-lg text-pif-black dark:text-white mb-2">Ingredients</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ product.ingredients }}</p>
          </div>
          <div v-if="product.allergens?.length">
            <h3 class="font-heading text-lg text-pif-black dark:text-white mb-2">Allergens</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ product.allergens.join(', ') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
