<script setup lang="ts">
import { z } from 'zod'
import type { Stripe, StripeElements, StripePaymentElement } from '@stripe/stripe-js'

definePageMeta({
  layout: 'checkout',
})

const cartStore = useCartStore()
const uiStore = useUiStore()
const { apiFetch, getCartSessionId } = useApi()
const { getAssetUrl } = useAsset()
const { isDark } = useTheme()
const { $stripe } = useNuxtApp() as { $stripe: Stripe | null }

useSeoMeta({
  title: 'Checkout | Premium Abrahimic Foods',
})

// Redirect if cart is empty
if (cartStore.isEmpty) {
  navigateTo('/cart')
}

// Form state
const form = reactive({
  email: '',
  phone: '',
  shipping: {
    first_name: '',
    last_name: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    county: '',
    postcode: '',
    country: 'GB',
  },
  billing_same_as_shipping: true,
  billing: {
    first_name: '',
    last_name: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    county: '',
    postcode: '',
    country: 'GB',
  },
  notes: '',
})

// Validation schema
const addressSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  address_line_1: z.string().min(1, 'Address is required'),
  address_line_2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  county: z.string().optional(),
  postcode: z.string().min(1, 'Postcode is required').regex(
    /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i,
    'Please enter a valid UK postcode'
  ),
  country: z.string().default('GB'),
})

const checkoutSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  phone: z.string().optional(),
  shipping: addressSchema,
})

const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)

// Shipping rates
const postcodeFetched = ref('')

const fetchShippingRates = async () => {
  const postcode = form.shipping.postcode.trim()
  if (!postcode || postcode === postcodeFetched.value) return
  if (!/^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i.test(postcode)) return

  postcodeFetched.value = postcode
  await cartStore.getShippingRates(postcode, form.shipping.country)

  // Auto-select first rate if available
  if (cartStore.shippingRates.length > 0 && !cartStore.selectedShippingRate) {
    cartStore.selectShippingRate(cartStore.shippingRates[0])
  }
}

// Stripe Elements
const stripeElements = ref<StripeElements | null>(null)
const paymentElement = ref<StripePaymentElement | null>(null)
const paymentElementReady = ref(false)
const stripeError = ref('')

const initStripeElements = (clientSecret: string) => {
  if (!$stripe) return

  stripeElements.value = $stripe.elements({
    clientSecret,
    appearance: {
      theme: isDark.value ? 'night' : 'stripe',
      variables: {
        colorPrimary: isDark.value ? '#D4A437' : '#3da052',
        fontFamily: 'Inter, sans-serif',
        borderRadius: '8px',
      },
    },
  })

  const pe = stripeElements.value.create('payment')
  pe.mount('#payment-element')
  pe.on('ready', () => {
    paymentElementReady.value = true
  })
  paymentElement.value = pe
}

// Validate form
const collectIssues = (error: z.ZodError, prefix = '') => {
  for (const issue of error.issues) {
    const path = [prefix, ...issue.path].filter(Boolean).join('.')
    // Keep the first message per field — it's the most specific.
    if (!errors.value[path]) errors.value[path] = issue.message
  }
}

const validateForm = (): boolean => {
  errors.value = {}

  const result = checkoutSchema.safeParse(form)
  if (!result.success) collectIssues(result.error)

  // Billing is only filled in when it differs from shipping.
  if (!form.billing_same_as_shipping) {
    const billingResult = addressSchema.safeParse(form.billing)
    if (!billingResult.success) collectIssues(billingResult.error, 'billing')
  }

  if (!cartStore.selectedShippingRate) {
    errors.value['shipping_method'] = 'Please select a shipping method'
  }

  return Object.keys(errors.value).length === 0
}

// Map Laravel validation paths onto this form's field keys so they render inline.
const applyApiErrors = (apiErrors: Record<string, string[]>): string[] => {
  const unmapped: string[] = []

  for (const [field, messages] of Object.entries(apiErrors)) {
    const message = messages?.[0]
    if (!message) continue

    let path = field
      .replace(/^shipping_address/, 'shipping')
      // With "same as shipping" ticked, a billing complaint is really about shipping.
      .replace(/^billing_address/, form.billing_same_as_shipping ? 'shipping' : 'billing')
      .replace(/^shipping_method_id$/, 'shipping_method')

    if (path === 'notes') path = 'order_notes'

    // Only surface paths that correspond to a rendered field.
    if (/^(email|phone|order_notes|shipping_method|(shipping|billing)\.\w+)$/.test(path)) {
      if (!errors.value[path]) errors.value[path] = message
    } else {
      unmapped.push(message)
    }
  }

  return unmapped
}

// Get field error
const getError = (path: string) => errors.value[path] || ''

// Submit checkout
const handleSubmit = async () => {
  if (!validateForm()) {
    uiStore.addToast('error', 'Please fix the form errors before continuing')
    return
  }

  if (!$stripe) {
    uiStore.addToast('error', 'Payment system is not available. Please try again later.')
    return
  }

  isSubmitting.value = true
  stripeError.value = ''

  try {
    // 1. Create order via API
    const billingAddress = form.billing_same_as_shipping ? form.shipping : form.billing

    const response = await apiFetch<{ order: any; client_secret: string }>('/checkout', {
      method: 'POST',
      body: {
        // Guest checkout is keyed by the same session id the cart uses.
        session_id: getCartSessionId(),
        email: form.email,
        phone: form.phone || undefined,
        items: cartStore.items.map((item) => ({
          product_id: item.product_id,
          variant_id: item.variant_id ?? undefined,
          quantity: item.quantity,
          note: item.note || undefined,
        })),
        shipping_address: form.shipping,
        billing_address: billingAddress,
        shipping_method_id: cartStore.selectedShippingRate!.id,
        notes: form.notes || undefined,
      },
    })

    // 2. If we don't have Stripe Elements mounted yet, mount them now
    if (!stripeElements.value) {
      initStripeElements(response.client_secret)
      // Wait for payment element to be ready
      await new Promise<void>((resolve) => {
        const check = setInterval(() => {
          if (paymentElementReady.value) {
            clearInterval(check)
            resolve()
          }
        }, 100)
        // Timeout after 15s
        setTimeout(() => {
          clearInterval(check)
          resolve()
        }, 15000)
      })
    }

    // 3. Confirm payment with Stripe
    const { error } = await $stripe.confirmPayment({
      elements: stripeElements.value!,
      confirmParams: {
        return_url: `${window.location.origin}${useRuntimeConfig().app.baseURL}checkout/success?order=${response.order.order_number}`,
        payment_method_data: {
          billing_details: {
            name: `${billingAddress.first_name} ${billingAddress.last_name}`,
            email: form.email,
            phone: form.phone || undefined,
            address: {
              line1: billingAddress.address_line_1,
              line2: billingAddress.address_line_2 || undefined,
              city: billingAddress.city,
              state: billingAddress.county || undefined,
              postal_code: billingAddress.postcode,
              country: billingAddress.country,
            },
          },
        },
      },
    })

    if (error) {
      stripeError.value = error.message || 'Payment failed. Please try again.'
      uiStore.addToast('error', stripeError.value)
    }
    // If successful, Stripe redirects to the return_url
  } catch (error: any) {
    const apiErrors = error?.data?.errors as Record<string, string[]> | undefined

    const status = error?.statusCode ?? error?.response?.status

    if (status === 422 && apiErrors) {
      const unmapped = applyApiErrors(apiErrors)
      uiStore.addToast(
        'error',
        unmapped[0] || 'Please fix the highlighted fields and try again.'
      )
    } else {
      uiStore.addToast('error', error?.data?.message || 'Something went wrong. Please try again.')
    }
  } finally {
    isSubmitting.value = false
  }
}

// Fetch cart on mount
onMounted(async () => {
  await cartStore.fetchCart()
  if (cartStore.isEmpty) {
    navigateTo('/cart')
  }
})
</script>

<template>
  <div class="container py-8">
    <h1 class="font-heading text-3xl text-pif-black dark:text-white mb-8 text-center">Checkout</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Checkout Form -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Contact Information -->
        <PCard>
          <h2 class="font-heading text-xl text-pif-black dark:text-white mb-4">Contact Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PInput
              v-model="form.email"
              label="Email"
              type="email"
              placeholder="your@email.com"
              required
              :error="getError('email')"
            />
            <PInput
              v-model="form.phone"
              label="Phone"
              type="tel"
              placeholder="+44 123 456 7890"
              :error="getError('phone')"
            />
          </div>
        </PCard>

        <!-- Shipping Address -->
        <PCard>
          <h2 class="font-heading text-xl text-pif-black dark:text-white mb-4">Shipping Address</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PInput
              v-model="form.shipping.first_name"
              label="First Name"
              placeholder="John"
              required
              :error="getError('shipping.first_name')"
            />
            <PInput
              v-model="form.shipping.last_name"
              label="Last Name"
              placeholder="Doe"
              required
              :error="getError('shipping.last_name')"
            />
            <div class="md:col-span-2">
              <PInput
                v-model="form.shipping.address_line_1"
                label="Address Line 1"
                placeholder="123 Main Street"
                required
                :error="getError('shipping.address_line_1')"
              />
            </div>
            <div class="md:col-span-2">
              <PInput
                v-model="form.shipping.address_line_2"
                label="Address Line 2"
                placeholder="Apartment, suite, etc. (optional)"
              />
            </div>
            <PInput
              v-model="form.shipping.city"
              label="City"
              placeholder="London"
              required
              :error="getError('shipping.city')"
            />
            <PInput
              v-model="form.shipping.county"
              label="County"
              placeholder="Greater London"
            />
            <PInput
              v-model="form.shipping.postcode"
              label="Postcode"
              placeholder="SW1A 1AA"
              required
              :error="getError('shipping.postcode')"
              @blur="fetchShippingRates"
            />
          </div>
        </PCard>

        <!-- Billing Address -->
        <PCard>
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-heading text-xl text-pif-black dark:text-white">Billing Address</h2>
          </div>
          <label class="flex items-center gap-3 cursor-pointer mb-4">
            <input
              v-model="form.billing_same_as_shipping"
              type="checkbox"
              class="w-4 h-4 rounded border-gray-300 dark:border-dark-600 text-pif-green-dark dark:text-pif-gold focus:ring-pif-green dark:focus:ring-pif-gold"
            />
            <span class="text-sm text-gray-700 dark:text-gray-300">Same as shipping address</span>
          </label>

          <div v-if="!form.billing_same_as_shipping" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PInput
              v-model="form.billing.first_name"
              label="First Name"
              placeholder="John"
              required
              :error="getError('billing.first_name')"
            />
            <PInput
              v-model="form.billing.last_name"
              label="Last Name"
              placeholder="Doe"
              required
              :error="getError('billing.last_name')"
            />
            <div class="md:col-span-2">
              <PInput
                v-model="form.billing.address_line_1"
                label="Address Line 1"
                placeholder="123 Main Street"
                required
                :error="getError('billing.address_line_1')"
              />
            </div>
            <div class="md:col-span-2">
              <PInput
                v-model="form.billing.address_line_2"
                label="Address Line 2"
                placeholder="Apartment, suite, etc. (optional)"
              />
            </div>
            <PInput
              v-model="form.billing.city"
              label="City"
              placeholder="London"
              required
              :error="getError('billing.city')"
            />
            <PInput
              v-model="form.billing.county"
              label="County"
              placeholder="Greater London"
            />
            <PInput
              v-model="form.billing.postcode"
              label="Postcode"
              placeholder="SW1A 1AA"
              required
              :error="getError('billing.postcode')"
            />
          </div>
        </PCard>

        <!-- Shipping Method -->
        <PCard>
          <h2 class="font-heading text-xl text-pif-black dark:text-white mb-4">Shipping Method</h2>

          <div v-if="cartStore.isFetchingRates" class="flex items-center gap-3 p-4 text-gray-500 dark:text-gray-400">
            <div class="animate-spin w-5 h-5 border-2 border-pif-green-dark dark:border-pif-gold border-t-transparent rounded-full" />
            <span class="text-sm">Fetching shipping rates...</span>
          </div>

          <div v-else-if="cartStore.shippingRates.length === 0" class="p-4 bg-gray-50 dark:bg-dark-300 rounded-lg">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Enter your postcode above to see available shipping options.
            </p>
          </div>

          <div v-else class="space-y-3">
            <label
              v-for="rate in cartStore.shippingRates"
              :key="rate.id"
              :class="[
                'flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors',
                cartStore.selectedShippingRate?.id === rate.id
                  ? 'border-pif-green-dark dark:border-pif-gold bg-pif-green-dark/5 dark:bg-pif-gold/10'
                  : 'border-gray-200 dark:border-dark-600 hover:border-pif-green dark:hover:border-pif-gold',
              ]"
            >
              <input
                type="radio"
                name="shipping"
                :value="rate.id"
                :checked="cartStore.selectedShippingRate?.id === rate.id"
                class="text-pif-green-dark dark:text-pif-gold focus:ring-pif-green dark:focus:ring-pif-gold"
                @change="cartStore.selectShippingRate(rate)"
              />
              <div class="flex-1">
                <p class="font-medium text-pif-black dark:text-white">{{ rate.name }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ rate.delivery_estimate }}</p>
                <p v-if="rate.description" class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{{ rate.description }}</p>
              </div>
              <span class="font-medium text-pif-black dark:text-white">
                {{ rate.free_shipping ? 'FREE' : formatCurrency(rate.rate) }}
              </span>
            </label>
          </div>
          <p v-if="getError('shipping_method')" class="text-sm text-red-500 dark:text-red-400 mt-2">
            {{ getError('shipping_method') }}
          </p>
        </PCard>

        <!-- Payment -->
        <PCard>
          <h2 class="font-heading text-xl text-pif-black dark:text-white mb-4">Payment</h2>

          <div v-if="!$stripe" class="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p class="text-sm text-yellow-700 dark:text-yellow-300">
              Payment system is loading. Please wait...
            </p>
          </div>

          <div id="payment-element" class="min-h-[100px]" />

          <p v-if="stripeError" class="text-sm text-red-500 dark:text-red-400 mt-3">
            {{ stripeError }}
          </p>

          <div class="flex items-center gap-2 mt-4 text-xs text-gray-400 dark:text-gray-500">
            <Icon name="heroicons:lock-closed" class="w-3.5 h-3.5" />
            <span>Your payment information is encrypted and secure</span>
          </div>
        </PCard>

        <!-- Order Notes -->
        <PCard>
          <h2 class="font-heading text-xl text-pif-black dark:text-white mb-4">Order Notes (Optional)</h2>
          <textarea
            v-model="form.notes"
            rows="3"
            placeholder="Any special instructions for your order..."
            class="w-full rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-300 text-pif-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pif-green dark:focus:ring-pif-gold focus:border-pif-green dark:focus:border-pif-gold"
          />
          <p v-if="getError('order_notes')" class="text-sm text-red-500 dark:text-red-400 mt-2">
            {{ getError('order_notes') }}
          </p>
        </PCard>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white dark:bg-dark-200 rounded-xl shadow-sm dark:shadow-black/50 p-6 sticky top-24">
          <h2 class="font-heading text-xl text-pif-black dark:text-white mb-4">Order Summary</h2>

          <!-- Cart Items Preview -->
          <div class="space-y-3 mb-4">
            <div
              v-for="item in cartStore.items"
              :key="item.key"
              class="flex gap-3 text-sm"
            >
              <div class="relative flex-shrink-0">
                <img
                  v-if="item.image"
                  :src="getAssetUrl(item.image)"
                  :alt="item.name"
                  class="w-12 h-12 object-cover rounded"
                />
                <div
                  v-else
                  class="w-12 h-12 bg-gray-100 dark:bg-dark-300 rounded flex items-center justify-center"
                >
                  <Icon name="heroicons:photo" class="w-4 h-4 text-gray-300 dark:text-gray-600" />
                </div>
                <span class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-500 dark:bg-dark-600 text-white text-xs rounded-full flex items-center justify-center">
                  {{ item.quantity }}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-pif-black dark:text-white line-clamp-1">{{ item.name }}</p>
                <p v-if="item.variant_name" class="text-gray-500 dark:text-gray-400 text-xs">{{ item.variant_name }}</p>
              </div>
              <span class="font-medium text-pif-black dark:text-white">{{ formatCurrency(item.total) }}</span>
            </div>
          </div>

          <div class="border-t border-gray-200 dark:border-dark-600 pt-4 space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Subtotal</span>
              <span class="font-medium text-pif-black dark:text-white">{{ formatCurrency(cartStore.subtotal) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Shipping</span>
              <span class="font-medium text-pif-black dark:text-white">
                {{ cartStore.selectedShippingRate
                  ? (cartStore.selectedShippingRate.free_shipping ? 'FREE' : formatCurrency(cartStore.shippingTotal))
                  : 'Not selected' }}
              </span>
            </div>
            <div v-if="cartStore.discountTotal > 0" class="flex justify-between text-green-600 dark:text-green-400">
              <span>Discount</span>
              <span>-{{ formatCurrency(cartStore.discountTotal) }}</span>
            </div>
            <div v-if="cartStore.couponCode" class="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
              <Icon name="heroicons:tag" class="w-3 h-3" />
              <span>{{ cartStore.couponCode }}</span>
            </div>
          </div>

          <div class="mt-4">
            <CartFreeDeliveryProgress :subtotal="cartStore.subtotal" />
          </div>

          <div class="border-t border-gray-200 dark:border-dark-600 my-4 pt-4">
            <div class="flex justify-between text-lg font-semibold">
              <span class="text-pif-black dark:text-white">Total</span>
              <span class="text-pif-green-dark dark:text-pif-gold">{{ formatCurrency(cartStore.total) }}</span>
            </div>
          </div>

          <PButton
            variant="gold"
            size="lg"
            block
            :loading="isSubmitting"
            :disabled="isSubmitting || cartStore.isEmpty"
            @click="handleSubmit"
          >
            Place Order
          </PButton>

          <p class="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
            By placing your order, you agree to our
            <NuxtLink to="/terms" class="underline hover:text-pif-green-dark dark:hover:text-pif-gold">Terms and Conditions</NuxtLink>
            and
            <NuxtLink to="/policies/privacy" class="underline hover:text-pif-green-dark dark:hover:text-pif-gold">Privacy Policy</NuxtLink>.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
