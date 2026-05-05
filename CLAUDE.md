# CLAUDE.md - Premium Ibrahimic Foods Frontend

## Project Overview

This is the frontend application for **Premium Ibrahimic Foods (PIF)**, a premium halal food e-commerce platform serving both retail (B2C) and wholesale (B2B) customers in the UK.

### Tech Stack

- **Framework**: Nuxt 4 (Vue 3 based)
- **Styling**: Tailwind CSS 4
- **State Management**: Pinia
- **API Communication**: $fetch / useFetch composables
- **Form Handling**: VeeValidate + Zod
- **Icons**: Nuxt Icon (Heroicons, Lucide)
- **Animation**: @vueuse/motion
- **Payment**: Stripe.js (@stripe/stripe-js)

### Backend Integration

- Laravel API at `NUXT_PUBLIC_API_BASE_URL`
- RESTful JSON API with Laravel Sanctum authentication
- Stripe payment intents via backend proxy
- DHL shipping rates/tracking via backend proxy

---

## Brand Guidelines

### Colours

```css
/* Primary Palette */
--pif-green-dark: #1B4332;      /* Primary brand green */
--pif-green: #2D6A4F;           /* Secondary green */
--pif-green-light: #40916C;     /* Accent green */
--pif-gold: #D4A437;            /* Premium accent */
--pif-gold-light: #E8C468;      /* Gold hover state */
--pif-white: #FFFFFF;
--pif-black: #1A1A1A;
--pif-cream: #FAF9F6;           /* Background accent */

/* Semantic Colours */
--pif-success: #22C55E;
--pif-error: #EF4444;
--pif-warning: #F59E0B;
--pif-info: #3B82F6;
```

### Typography

```css
/* Headings */
font-family: 'Ovo', serif;

/* Body */
font-family: 'Inter', sans-serif;
```

### Tailwind Extension (tailwind.config.ts)

```typescript
export default {
  theme: {
    extend: {
      colors: {
        pif: {
          green: {
            dark: '#1B4332',
            DEFAULT: '#2D6A4F',
            light: '#40916C',
          },
          gold: {
            DEFAULT: '#D4A437',
            light: '#E8C468',
          },
          cream: '#FAF9F6',
          black: '#1A1A1A',
        },
      },
      fontFamily: {
        heading: ['Ovo', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
}
```

### Brand Tone

- **Refined** and **trustworthy** — never flashy or gimmicky
- **Halal-assured** — clear certification messaging
- **Premium quality** — emphasise freshness, sourcing, care
- **Family-friendly** — warm, welcoming language
- **Professional** — especially for B2B communications

---

## Directory Structure

```
pif-frontend/
├── .nuxt/
├── app/
│   ├── components/
│   │   ├── common/           # Shared UI components
│   │   │   ├── PButton.vue
│   │   │   ├── PInput.vue
│   │   │   ├── PModal.vue
│   │   │   ├── PBadge.vue
│   │   │   ├── PCard.vue
│   │   │   └── PSpinner.vue
│   │   ├── layout/           # Layout components
│   │   │   ├── TheHeader.vue
│   │   │   ├── TheFooter.vue
│   │   │   ├── TheMobileMenu.vue
│   │   │   ├── TheNavbar.vue
│   │   │   └── TheBreadcrumb.vue
│   │   ├── product/          # Product-related components
│   │   │   ├── ProductCard.vue
│   │   │   ├── ProductGrid.vue
│   │   │   ├── ProductGallery.vue
│   │   │   ├── ProductVariantSelector.vue
│   │   │   ├── ProductQuantityInput.vue
│   │   │   └── ProductReviews.vue
│   │   ├── cart/             # Cart components
│   │   │   ├── CartDrawer.vue
│   │   │   ├── CartItem.vue
│   │   │   ├── CartSummary.vue
│   │   │   └── CartEmpty.vue
│   │   ├── checkout/         # Checkout components
│   │   │   ├── CheckoutForm.vue
│   │   │   ├── AddressForm.vue
│   │   │   ├── ShippingOptions.vue
│   │   │   ├── PaymentForm.vue
│   │   │   └── OrderSummary.vue
│   │   ├── account/          # Account components
│   │   │   ├── OrderHistory.vue
│   │   │   ├── AddressBook.vue
│   │   │   └── AccountDetails.vue
│   │   ├── wholesale/        # B2B specific components
│   │   │   ├── WholesaleBanner.vue
│   │   │   ├── WholesalePricing.vue
│   │   │   └── BulkOrderForm.vue
│   │   └── home/             # Homepage components
│   │       ├── HeroSection.vue
│   │       ├── FeaturedCategories.vue
│   │       ├── BestSellers.vue
│   │       ├── HalalPromise.vue
│   │       └── Testimonials.vue
│   ├── composables/          # Vue composables
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   ├── useProducts.ts
│   │   ├── useCheckout.ts
│   │   ├── useShipping.ts
│   │   ├── useWholesale.ts
│   │   └── useToast.ts
│   ├── layouts/
│   │   ├── default.vue
│   │   ├── auth.vue
│   │   ├── checkout.vue
│   │   └── account.vue
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── guest.ts
│   │   └── wholesale.ts
│   ├── pages/
│   │   ├── index.vue                    # Homepage
│   │   ├── products/
│   │   │   ├── index.vue                # Product listing
│   │   │   └── [slug].vue               # Product detail
│   │   ├── categories/
│   │   │   └── [slug].vue               # Category listing
│   │   ├── cart.vue                     # Cart page
│   │   ├── checkout/
│   │   │   ├── index.vue                # Checkout flow
│   │   │   └── success.vue              # Order confirmation
│   │   ├── account/
│   │   │   ├── index.vue                # Dashboard
│   │   │   ├── orders/
│   │   │   │   ├── index.vue            # Order history
│   │   │   │   └── [id].vue             # Order detail
│   │   │   ├── addresses.vue            # Address book
│   │   │   └── settings.vue             # Account settings
│   │   ├── auth/
│   │   │   ├── login.vue
│   │   │   ├── register.vue
│   │   │   ├── forgot-password.vue
│   │   │   └── reset-password.vue
│   │   ├── wholesale/
│   │   │   ├── index.vue                # Wholesale landing
│   │   │   └── apply.vue                # Application form
│   │   ├── about.vue
│   │   ├── contact.vue
│   │   ├── halal-promise.vue
│   │   └── [...slug].vue                # CMS pages
│   ├── plugins/
│   │   ├── stripe.client.ts
│   │   └── toast.ts
│   └── utils/
│       ├── formatters.ts
│       ├── validators.ts
│       └── constants.ts
├── public/
│   ├── images/
│   └── fonts/
├── server/
│   ├── api/                  # Server routes (BFF pattern)
│   └── middleware/
├── stores/                   # Pinia stores
│   ├── auth.ts
│   ├── cart.ts
│   ├── products.ts
│   └── ui.ts
├── types/
│   ├── product.ts
│   ├── cart.ts
│   ├── order.ts
│   ├── customer.ts
│   └── api.ts
├── nuxt.config.ts
├── tailwind.config.ts
├── app.config.ts
└── package.json
```

---

## Coding Standards

### Vue Component Structure

Always use `<script setup lang="ts">` with this ordering:

```vue
<script setup lang="ts">
// 1. Type imports
import type { Product } from '~/types/product'

// 2. Component imports
import ProductCard from '~/components/product/ProductCard.vue'

// 3. Composable imports
import { useCart } from '~/composables/useCart'

// 4. Props & Emits
const props = defineProps<{
  product: Product
  showBadge?: boolean
}>()

const emit = defineEmits<{
  addToCart: [productId: number, quantity: number]
}>()

// 5. Composables & stores
const { addItem } = useCart()
const route = useRoute()

// 6. Reactive state
const quantity = ref(1)
const isLoading = ref(false)

// 7. Computed properties
const formattedPrice = computed(() => 
  formatCurrency(props.product.price)
)

// 8. Methods
const handleAddToCart = async () => {
  isLoading.value = true
  await addItem(props.product.id, quantity.value)
  isLoading.value = false
}

// 9. Lifecycle hooks
onMounted(() => {
  // ...
})
</script>

<template>
  <!-- Template content -->
</template>

<style scoped>
/* Minimal custom styles - prefer Tailwind */
</style>
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ProductCard.vue` |
| Composables | camelCase with `use` prefix | `useCart.ts` |
| Stores | camelCase | `cart.ts` |
| Types/Interfaces | PascalCase | `Product`, `CartItem` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_CART_QUANTITY` |
| CSS Classes | kebab-case (Tailwind) | `text-pif-green-dark` |
| API Endpoints | kebab-case | `/api/products`, `/api/cart-items` |

### Component Prefixes

- `P` prefix for common/base components: `PButton`, `PInput`, `PModal`
- `The` prefix for singleton layout components: `TheHeader`, `TheFooter`
- Feature prefix for domain components: `ProductCard`, `CartDrawer`

---

## API Integration Patterns

### API Client Configuration

```typescript
// composables/useApi.ts
export const useApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const apiFetch = $fetch.create({
    baseURL: config.public.apiBaseUrl,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    onRequest({ options }) {
      if (authStore.token) {
        options.headers.set('Authorization', `Bearer ${authStore.token}`)
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        authStore.logout()
        navigateTo('/auth/login')
      }
    },
  })

  return { apiFetch }
}
```

### Data Fetching Pattern

```typescript
// composables/useProducts.ts
export const useProducts = () => {
  const { apiFetch } = useApi()

  const getProducts = async (params?: ProductFilters) => {
    return await apiFetch<PaginatedResponse<Product>>('/products', {
      query: params,
    })
  }

  const getProduct = async (slug: string) => {
    return await apiFetch<Product>(`/products/${slug}`)
  }

  return {
    getProducts,
    getProduct,
  }
}
```

### SSR Data Fetching (Pages)

```vue
<script setup lang="ts">
// Always use useAsyncData for SSR-compatible fetching
const route = useRoute()
const { getProduct } = useProducts()

const { data: product, status, error } = await useAsyncData(
  `product-${route.params.slug}`,
  () => getProduct(route.params.slug as string)
)

// Handle 404
if (!product.value && status.value === 'success') {
  throw createError({ statusCode: 404, message: 'Product not found' })
}
</script>
```

---

## State Management (Pinia)

### Cart Store Example

```typescript
// stores/cart.ts
import { defineStore } from 'pinia'
import type { CartItem, Cart } from '~/types/cart'

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref<CartItem[]>([])
  const isLoading = ref(false)

  // Getters
  const itemCount = computed(() => 
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const subtotal = computed(() =>
    items.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  )

  const isEmpty = computed(() => items.value.length === 0)

  // Actions
  const fetchCart = async () => {
    const { apiFetch } = useApi()
    isLoading.value = true
    try {
      const cart = await apiFetch<Cart>('/cart')
      items.value = cart.items
    } finally {
      isLoading.value = false
    }
  }

  const addItem = async (productId: number, quantity: number, variantId?: number) => {
    const { apiFetch } = useApi()
    const cart = await apiFetch<Cart>('/cart/items', {
      method: 'POST',
      body: { product_id: productId, quantity, variant_id: variantId },
    })
    items.value = cart.items
  }

  const updateQuantity = async (itemId: number, quantity: number) => {
    const { apiFetch } = useApi()
    const cart = await apiFetch<Cart>(`/cart/items/${itemId}`, {
      method: 'PATCH',
      body: { quantity },
    })
    items.value = cart.items
  }

  const removeItem = async (itemId: number) => {
    const { apiFetch } = useApi()
    const cart = await apiFetch<Cart>(`/cart/items/${itemId}`, {
      method: 'DELETE',
    })
    items.value = cart.items
  }

  const clearCart = async () => {
    const { apiFetch } = useApi()
    await apiFetch('/cart', { method: 'DELETE' })
    items.value = []
  }

  return {
    // State
    items,
    isLoading,
    // Getters
    itemCount,
    subtotal,
    isEmpty,
    // Actions
    fetchCart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  }
})
```

---

## Component Examples

### Base Button Component

```vue
<!-- components/common/PButton.vue -->
<script setup lang="ts">
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold'
type ButtonSize = 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  disabled?: boolean
  block?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  block: false,
})

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-pif-green-dark text-white hover:bg-pif-green active:bg-pif-green-dark',
  secondary: 'bg-pif-green text-white hover:bg-pif-green-light active:bg-pif-green',
  outline: 'border-2 border-pif-green-dark text-pif-green-dark hover:bg-pif-green-dark hover:text-white',
  ghost: 'text-pif-green-dark hover:bg-pif-green-dark/10',
  gold: 'bg-pif-gold text-pif-black hover:bg-pif-gold-light active:bg-pif-gold',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3 text-lg',
}

const buttonClasses = computed(() => [
  'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200',
  'focus:outline-none focus:ring-2 focus:ring-pif-green focus:ring-offset-2',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  variantClasses[props.variant],
  sizeClasses[props.size],
  props.block && 'w-full',
])
</script>

<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
  >
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
    <slot />
  </button>
</template>
```

### Product Card Component

```vue
<!-- components/product/ProductCard.vue -->
<script setup lang="ts">
import type { Product } from '~/types/product'

const props = defineProps<{
  product: Product
}>()

const { addItem } = useCartStore()
const isAdding = ref(false)

const handleQuickAdd = async () => {
  isAdding.value = true
  await addItem(props.product.id, 1)
  isAdding.value = false
}

const formattedPrice = computed(() => 
  formatCurrency(props.product.price)
)

const hasDiscount = computed(() => 
  props.product.compare_at_price && props.product.compare_at_price > props.product.price
)
</script>

<template>
  <article class="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
    <!-- Image -->
    <NuxtLink :to="`/products/${product.slug}`" class="block aspect-square overflow-hidden rounded-t-xl">
      <NuxtImg
        :src="product.featured_image"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
        width="400"
        height="400"
      />
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
      class="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-pif-green-dark hover:text-white"
      :disabled="isAdding"
      @click.prevent="handleQuickAdd"
    >
      <Icon name="heroicons:plus" class="w-5 h-5" />
    </button>

    <!-- Content -->
    <div class="p-4">
      <p class="text-sm text-pif-green mb-1">{{ product.category?.name }}</p>
      
      <NuxtLink :to="`/products/${product.slug}`">
        <h3 class="font-heading text-lg text-pif-black hover:text-pif-green-dark transition-colors">
          {{ product.name }}
        </h3>
      </NuxtLink>

      <p class="text-sm text-gray-500 mt-1 line-clamp-2">
        {{ product.short_description }}
      </p>

      <!-- Price -->
      <div class="mt-3 flex items-baseline gap-2">
        <span class="font-semibold text-pif-green-dark">{{ formattedPrice }}</span>
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
```

---

## Type Definitions

```typescript
// types/product.ts
export interface Product {
  id: number
  name: string
  slug: string
  sku: string
  short_description: string
  description: string
  price: number
  compare_at_price?: number
  cost_price?: number
  featured_image: string
  images: ProductImage[]
  category?: Category
  category_id: number
  weight?: number
  weight_unit?: 'g' | 'kg'
  stock_quantity: number
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock'
  is_active: boolean
  is_featured: boolean
  is_new: boolean
  halal_certified: boolean
  halal_certificate_url?: string
  ingredients?: string
  allergens?: string[]
  nutritional_info?: NutritionalInfo
  has_variants: boolean
  variants?: ProductVariant[]
  meta_title?: string
  meta_description?: string
  created_at: string
  updated_at: string
}

export interface ProductVariant {
  id: number
  product_id: number
  name: string
  sku: string
  price: number
  compare_at_price?: number
  weight?: number
  weight_unit?: 'g' | 'kg'
  stock_quantity: number
  options: VariantOption[]
  image?: ProductImage
}

export interface VariantOption {
  name: string    // e.g., "Size", "Pack"
  value: string   // e.g., "500g", "Family Pack"
}

export interface ProductImage {
  id: number
  url: string
  alt?: string
  position: number
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  image?: string
  parent_id?: number
  children?: Category[]
  product_count?: number
}

export interface ProductFilters {
  category?: string
  search?: string
  min_price?: number
  max_price?: number
  in_stock?: boolean
  halal_certified?: boolean
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'bestselling'
  page?: number
  per_page?: number
}

// types/cart.ts
export interface Cart {
  id: string
  items: CartItem[]
  subtotal: number
  shipping_total: number
  tax_total: number
  discount_total: number
  total: number
  coupon_code?: string
  customer_type: 'retail' | 'wholesale'
}

export interface CartItem {
  id: number
  product_id: number
  variant_id?: number
  product: Product
  variant?: ProductVariant
  quantity: number
  price: number
  line_total: number
}

// types/order.ts
export interface Order {
  id: number
  order_number: string
  status: OrderStatus
  customer_id: number
  billing_address: Address
  shipping_address: Address
  items: OrderItem[]
  subtotal: number
  shipping_total: number
  tax_total: number
  discount_total: number
  total: number
  payment_status: PaymentStatus
  payment_method: string
  shipping_method: string
  tracking_number?: string
  tracking_url?: string
  notes?: string
  created_at: string
  updated_at: string
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded'

export type PaymentStatus = 
  | 'pending' 
  | 'paid' 
  | 'failed' 
  | 'refunded' 
  | 'partially_refunded'

// types/customer.ts
export interface Customer {
  id: number
  email: string
  first_name: string
  last_name: string
  phone?: string
  customer_type: 'retail' | 'wholesale'
  wholesale_status?: 'pending' | 'approved' | 'rejected'
  company_name?: string
  vat_number?: string
  default_billing_address_id?: number
  default_shipping_address_id?: number
  addresses: Address[]
  created_at: string
}

export interface Address {
  id: number
  label?: string
  first_name: string
  last_name: string
  company?: string
  address_line_1: string
  address_line_2?: string
  city: string
  county?: string
  postcode: string
  country: string
  phone?: string
  is_default_billing: boolean
  is_default_shipping: boolean
}

// types/api.ts
export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
  }
  links: {
    first: string
    last: string
    prev?: string
    next?: string
  }
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}
```

---

## Utility Functions

```typescript
// utils/formatters.ts
export const formatCurrency = (amount: number, currency = 'GBP'): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
  }).format(amount)
}

export const formatDate = (date: string, options?: Intl.DateTimeFormatOptions): string => {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    ...options,
  }).format(new Date(date))
}

export const formatWeight = (weight: number, unit: 'g' | 'kg'): string => {
  if (unit === 'g' && weight >= 1000) {
    return `${(weight / 1000).toFixed(1)}kg`
  }
  return `${weight}${unit}`
}

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const truncate = (text: string, length: number): string => {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '...'
}

// utils/validators.ts
import { z } from 'zod'

export const emailSchema = z.string().email('Please enter a valid email address')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

export const postcodeSchema = z
  .string()
  .regex(/^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i, 'Please enter a valid UK postcode')

export const phoneSchema = z
  .string()
  .regex(/^(\+44|0)[0-9]{10,11}$/, 'Please enter a valid UK phone number')

export const addressSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  address_line_1: z.string().min(1, 'Address is required'),
  address_line_2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  county: z.string().optional(),
  postcode: postcodeSchema,
  country: z.string().default('GB'),
  phone: phoneSchema.optional(),
})

// utils/constants.ts
export const ORDER_STATUSES: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'warning' },
  confirmed: { label: 'Confirmed', color: 'info' },
  processing: { label: 'Processing', color: 'info' },
  shipped: { label: 'Shipped', color: 'primary' },
  delivered: { label: 'Delivered', color: 'success' },
  cancelled: { label: 'Cancelled', color: 'error' },
  refunded: { label: 'Refunded', color: 'gray' },
}

export const MAX_CART_QUANTITY = 99
export const MIN_WHOLESALE_ORDER = 150 // GBP

export const ALLERGENS = [
  'Celery',
  'Cereals containing gluten',
  'Crustaceans',
  'Eggs',
  'Fish',
  'Lupin',
  'Milk',
  'Molluscs',
  'Mustard',
  'Nuts',
  'Peanuts',
  'Sesame seeds',
  'Soya',
  'Sulphur dioxide',
] as const
```

---

## SEO Configuration

```typescript
// nuxt.config.ts (partial)
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: { lang: 'en-GB' },
      title: 'Premium Ibrahimic Foods | Quality Halal Meat & Food Delivery UK',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          name: 'description', 
          content: 'Premium halal meat and food delivered to your door. Quality certified halal beef, lamb, chicken & more. Serving UK households and wholesale buyers.' 
        },
        { name: 'theme-color', content: '#1B4332' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { 
          rel: 'stylesheet', 
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Ovo&display=swap' 
        },
      ],
    },
  },
})
```

### Page-Level SEO

```vue
<script setup lang="ts">
const product = await getProduct(slug)

useSeoMeta({
  title: () => product.value?.meta_title || `${product.value?.name} | PIF`,
  description: () => product.value?.meta_description || product.value?.short_description,
  ogTitle: () => product.value?.name,
  ogDescription: () => product.value?.short_description,
  ogImage: () => product.value?.featured_image,
  ogType: 'product',
})

useSchemaOrg([
  defineProduct({
    name: product.value?.name,
    description: product.value?.short_description,
    image: product.value?.featured_image,
    offers: {
      price: product.value?.price,
      priceCurrency: 'GBP',
      availability: product.value?.stock_status === 'in_stock' 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
    },
  }),
])
</script>
```

---

## Testing Approach

### Component Testing (Vitest + Vue Test Utils)

```typescript
// components/product/__tests__/ProductCard.spec.ts
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ProductCard from '../ProductCard.vue'
import { mockProduct } from '~/tests/mocks/product'

describe('ProductCard', () => {
  it('renders product name and price', async () => {
    const wrapper = await mountSuspended(ProductCard, {
      props: { product: mockProduct },
    })

    expect(wrapper.text()).toContain(mockProduct.name)
    expect(wrapper.text()).toContain('£12.99')
  })

  it('shows sale badge when discounted', async () => {
    const discountedProduct = { 
      ...mockProduct, 
      compare_at_price: 15.99 
    }
    const wrapper = await mountSuspended(ProductCard, {
      props: { product: discountedProduct },
    })

    expect(wrapper.text()).toContain('Sale')
  })

  it('shows halal badge when certified', async () => {
    const halalProduct = { 
      ...mockProduct, 
      halal_certified: true 
    }
    const wrapper = await mountSuspended(ProductCard, {
      props: { product: halalProduct },
    })

    expect(wrapper.text()).toContain('Halal')
  })
})
```

---

## Environment Variables

```env
# .env.example

# API
NUXT_PUBLIC_API_BASE_URL=https://api.premiumibrahimicfoods.co.uk/api/v1
NUXT_API_SECRET=your-backend-api-secret

# Stripe
NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
NUXT_STRIPE_SECRET_KEY=sk_live_xxx

# Site
NUXT_PUBLIC_SITE_URL=https://premiumibrahimicfoods.co.uk
NUXT_PUBLIC_SITE_NAME="Premium Ibrahimic Foods"

# Features
NUXT_PUBLIC_ENABLE_WHOLESALE=true
NUXT_PUBLIC_ENABLE_REVIEWS=true
```

---

## Key Reminders for Claude Code

1. **Always use TypeScript** with strict typing
2. **Prefer composition API** with `<script setup>`
3. **Use Tailwind classes** — avoid custom CSS unless necessary
4. **Follow the brand palette** — `pif-green-dark`, `pif-gold`, etc.
5. **SSR-safe code** — use `useAsyncData` for data fetching in pages
6. **Accessibility matters** — proper ARIA labels, keyboard navigation
7. **Mobile-first** — design from small screens up
8. **Performance** — lazy load images, optimise bundles
9. **B2B consideration** — wholesale pricing logic, bulk orders
10. **Halal messaging** — always visible, trustworthy

---

## Quick Commands

```bash
# Development
pnpm dev

# Build
pnpm build

# Preview production build
pnpm preview

# Type check
pnpm typecheck

# Lint
pnpm lint

# Test
pnpm test

# Generate types
pnpm postinstall
```

---

*© 2025 Premium Ibrahimic Foods. Development by 1StopWEB.*