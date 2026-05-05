<script setup lang="ts">
import type { Product } from '~/types/product'

const { getAssetUrl } = useAsset()

// Demo products for display
const demoProducts: Product[] = [
  {
    id: 1,
    name: 'Marinated Halal Lamb Leg Steak (Boneless) Regular',
    slug: 'marinated-halal-lamb-leg-steak-boneless-regular',
    sku: 'LAMB-001',
    short_description: 'Premium quality halal lamb leg steak, boneless and marinated',
    description: '',
    price: 16.99,
    featured_image: 'images/products/meat-products-07.jpg',
    images: [],
    category: { id: 1, name: 'Halal Lamb', slug: 'halal-lamb' },
    category_id: 1,
    stock_quantity: 50,
    stock_status: 'in_stock',
    is_active: true,
    is_featured: true,
    is_new: true,
    halal_certified: true,
    has_variants: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Marinated Halal Lamb Leg Steak (Boneless) Regular',
    slug: 'marinated-halal-lamb-leg-steak-2',
    sku: 'LAMB-002',
    short_description: 'Premium quality halal lamb leg steak, boneless and marinated',
    description: '',
    price: 16.99,
    featured_image: 'images/products/meat-products-08.jpg',
    images: [],
    category: { id: 1, name: 'Halal Lamb', slug: 'halal-lamb' },
    category_id: 1,
    stock_quantity: 50,
    stock_status: 'in_stock',
    is_active: true,
    is_featured: true,
    is_new: false,
    halal_certified: true,
    has_variants: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Marinated Halal Lamb Leg Steak (Boneless) Regular',
    slug: 'marinated-halal-lamb-leg-steak-3',
    sku: 'LAMB-003',
    short_description: 'Premium quality halal lamb leg steak, boneless and marinated',
    description: '',
    price: 16.99,
    featured_image: 'images/products/meat-products-09.jpg',
    images: [],
    category: { id: 1, name: 'Halal Lamb', slug: 'halal-lamb' },
    category_id: 1,
    stock_quantity: 50,
    stock_status: 'in_stock',
    is_active: true,
    is_featured: true,
    is_new: false,
    halal_certified: true,
    has_variants: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'Marinated Halal Lamb Leg Steak (Boneless) Regular',
    slug: 'marinated-halal-lamb-leg-steak-4',
    sku: 'LAMB-004',
    short_description: 'Premium quality halal lamb leg steak, boneless and marinated',
    description: '',
    price: 16.99,
    featured_image: 'images/products/meat-products-10.jpg',
    images: [],
    category: { id: 1, name: 'Halal Lamb', slug: 'halal-lamb' },
    category_id: 1,
    stock_quantity: 50,
    stock_status: 'in_stock',
    is_active: true,
    is_featured: true,
    is_new: false,
    halal_certified: true,
    has_variants: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]
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

      <!-- Products Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <article
          v-for="product in demoProducts"
          :key="product.id"
          class="group bg-white dark:bg-dark-200 rounded-xl shadow-sm hover:shadow-md dark:shadow-black/50 transition-shadow border border-transparent dark:border-dark-600"
        >
          <!-- Image -->
          <NuxtLink
            :to="`/products/${product.slug}`"
            class="block aspect-square overflow-hidden rounded-t-xl"
          >
            <img
              :src="getAssetUrl(product.featured_image)"
              :alt="product.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
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
