<script setup lang="ts">
const { getAssetUrl } = useAsset()

useSeoMeta({
  title: 'Trade Account | B2B Wholesale | Premium Abrahamic Foods',
  description: 'Login or register for a trade account. Wholesale pricing for restaurants, butchers, and retailers.',
})

// The same number the header offers, rather than a second copy that can drift.
const tradePhone = CONTACT_PHONES[0]!
const tradeTelHref = `tel:${tradePhone.number.replace(/\s+/g, '')}`

const backgroundStyle = computed(() => ({
  backgroundImage: `url('${getAssetUrl('images/meat-slides-03.jpg')}')`
}))

// Form state
const activeTab = ref<'login' | 'register'>('login')

// Login form
const loginForm = ref({
  email: '',
  password: '',
  remember: false,
})

// Register form
const registerForm = ref({
  businessName: '',
  businessType: '',
  contactName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  address: '',
  city: '',
  postcode: '',
  vatNumber: '',
  agreeTerms: false,
})

const businessTypes = [
  'Restaurant / Takeaway',
  'Butcher / Meat Shop',
  'Grocery Store / Supermarket',
  'Hotel / Catering',
  'School / Institution',
  'Food Manufacturer',
  'Other',
]

const benefits = [
  {
    icon: 'heroicons:currency-pound',
    title: 'Wholesale Pricing',
    description: 'Exclusive trade prices on all products',
  },
  {
    icon: 'heroicons:truck',
    title: 'Bulk Delivery',
    description: 'Free delivery on orders over £150',
  },
  {
    icon: 'heroicons:clipboard-document-list',
    title: 'Easy Ordering',
    description: 'Repeat orders & order templates',
  },
  {
    icon: 'heroicons:user-group',
    title: 'Account Manager',
    description: 'Dedicated support for your business',
  },
]

const handleLogin = () => {
  // TODO: Implement login API
  console.log('Login:', loginForm.value)
}

const handleRegister = () => {
  // TODO: Implement register API
  console.log('Register:', registerForm.value)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-pif-black">
    <!-- Hero Section -->
    <div class="relative h-64 md:h-80 overflow-hidden">
      <div
        class="absolute inset-0 bg-cover bg-center opacity-30 dark:opacity-15"
        :style="backgroundStyle"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-pif-green-dark via-pif-green-dark/90 to-pif-green-dark dark:from-pif-black dark:via-pif-green-dark/90 dark:to-pif-black" />
      <div class="relative h-full flex items-center">
        <div class="container">
          <div class="max-w-2xl">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 bg-pif-gold rounded-full flex items-center justify-center">
                <Icon name="heroicons:building-storefront" class="w-6 h-6 text-pif-black" />
              </div>
              <span class="text-pif-gold font-medium uppercase tracking-wider text-sm">Trade Account</span>
            </div>
            <h1 class="font-heading text-3xl md:text-4xl lg:text-5xl text-white mb-3">
              B2B Wholesale Portal
            </h1>
            <p class="text-lg text-white/80 dark:text-gray-400">
              Access exclusive wholesale pricing for your business
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="container py-10 md:py-16">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        <!-- Left Column: Benefits & Info -->
        <div>
          <h2 class="font-heading text-2xl text-pif-black dark:text-white mb-6">
            Why Open a Trade Account?
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div
              v-for="benefit in benefits"
              :key="benefit.title"
              class="bg-white dark:bg-dark-200/50 dark:backdrop-blur rounded-xl p-5 border border-gray-200 dark:border-dark-600 shadow-sm"
            >
              <div class="w-10 h-10 bg-pif-green-dark rounded-lg flex items-center justify-center mb-3">
                <Icon :name="benefit.icon" class="w-5 h-5 text-pif-gold" />
              </div>
              <h3 class="font-medium text-pif-black dark:text-white mb-1">{{ benefit.title }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ benefit.description }}</p>
            </div>
          </div>

          <!-- Eligible Businesses -->
          <div class="bg-pif-cream dark:bg-pif-green-dark/30 dark:backdrop-blur rounded-xl p-6 border border-gray-200 dark:border-pif-green-dark/50">
            <h3 class="font-heading text-lg text-pif-black dark:text-white mb-4">Eligible Businesses</h3>
            <ul class="space-y-3">
              <li class="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                <Icon name="heroicons:check-circle" class="w-5 h-5 text-pif-green dark:text-pif-gold flex-shrink-0" />
                <span>Restaurants, takeaways & cafes</span>
              </li>
              <li class="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                <Icon name="heroicons:check-circle" class="w-5 h-5 text-pif-green dark:text-pif-gold flex-shrink-0" />
                <span>Halal butchers & meat shops</span>
              </li>
              <li class="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                <Icon name="heroicons:check-circle" class="w-5 h-5 text-pif-green dark:text-pif-gold flex-shrink-0" />
                <span>Grocery stores & supermarkets</span>
              </li>
              <li class="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                <Icon name="heroicons:check-circle" class="w-5 h-5 text-pif-green dark:text-pif-gold flex-shrink-0" />
                <span>Hotels & catering companies</span>
              </li>
              <li class="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                <Icon name="heroicons:check-circle" class="w-5 h-5 text-pif-green dark:text-pif-gold flex-shrink-0" />
                <span>Schools & institutions</span>
              </li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div class="mt-6 p-4 bg-white dark:bg-dark-200/50 rounded-xl border border-gray-200 dark:border-dark-600">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Need help with your trade account?</p>
            <div class="flex items-center gap-2 text-pif-green-dark dark:text-pif-gold font-medium">
              <Icon name="heroicons:phone" class="w-4 h-4" />
              <a :href="tradeTelHref">{{ tradePhone.number }}</a>
            </div>
          </div>
        </div>

        <!-- Right Column: Login/Register Forms -->
        <div>
          <div class="bg-white dark:bg-dark-100 rounded-2xl shadow-lg dark:shadow-2xl overflow-hidden border border-gray-200 dark:border-dark-600">
            <!-- Tabs -->
            <div class="flex border-b border-gray-200 dark:border-dark-600">
              <button
                :class="[
                  'flex-1 py-4 px-6 text-center font-medium transition-colors',
                  activeTab === 'login'
                    ? 'text-pif-green-dark dark:text-pif-gold border-b-2 border-pif-green-dark dark:border-pif-gold bg-white dark:bg-dark-100'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 bg-gray-50 dark:bg-dark-50'
                ]"
                @click="activeTab = 'login'"
              >
                <Icon name="heroicons:arrow-right-on-rectangle" class="w-5 h-5 inline mr-2" />
                Sign In
              </button>
              <button
                :class="[
                  'flex-1 py-4 px-6 text-center font-medium transition-colors',
                  activeTab === 'register'
                    ? 'text-pif-green-dark dark:text-pif-gold border-b-2 border-pif-green-dark dark:border-pif-gold bg-white dark:bg-dark-100'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 bg-gray-50 dark:bg-dark-50'
                ]"
                @click="activeTab = 'register'"
              >
                <Icon name="heroicons:user-plus" class="w-5 h-5 inline mr-2" />
                Register
              </button>
            </div>

            <!-- Login Form -->
            <div v-if="activeTab === 'login'" class="p-6 md:p-8">
              <h3 class="font-heading text-xl text-pif-black dark:text-white mb-2">Trade Account Login</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">Sign in to access wholesale pricing</p>

              <form @submit.prevent="handleLogin" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                  <input
                    v-model="loginForm.email"
                    type="email"
                    required
                    class="w-full px-4 py-3 bg-white dark:bg-dark-300 border border-gray-300 dark:border-dark-600 rounded-lg text-pif-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pif-green dark:focus:ring-pif-gold focus:border-transparent"
                    placeholder="your@business.com"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                  <input
                    v-model="loginForm.password"
                    type="password"
                    required
                    class="w-full px-4 py-3 bg-white dark:bg-dark-300 border border-gray-300 dark:border-dark-600 rounded-lg text-pif-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pif-green dark:focus:ring-pif-gold focus:border-transparent"
                    placeholder="Enter your password"
                  />
                </div>

                <div class="flex items-center justify-between">
                  <label class="flex items-center gap-2">
                    <input
                      v-model="loginForm.remember"
                      type="checkbox"
                      class="w-4 h-4 bg-white dark:bg-dark-300 border-gray-300 dark:border-dark-600 text-pif-green dark:text-pif-gold rounded focus:ring-pif-green dark:focus:ring-pif-gold focus:ring-offset-white dark:focus:ring-offset-dark-100"
                    />
                    <span class="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                  </label>
                  <NuxtLink to="/auth/forgot-password" class="text-sm text-pif-green-dark dark:text-pif-gold hover:underline">
                    Forgot password?
                  </NuxtLink>
                </div>

                <button
                  type="submit"
                  class="w-full py-3 px-6 bg-pif-green-dark dark:bg-pif-gold text-white dark:text-pif-black font-medium rounded-lg hover:bg-pif-green dark:hover:bg-pif-gold-light transition-colors"
                >
                  Sign In to Trade Account
                </button>
              </form>

              <div class="mt-6 pt-6 border-t border-gray-200 dark:border-dark-600 text-center">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Don't have a trade account?
                  <button @click="activeTab = 'register'" class="text-pif-green-dark dark:text-pif-gold font-medium hover:underline">
                    Register now
                  </button>
                </p>
              </div>
            </div>

            <!-- Register Form -->
            <div v-if="activeTab === 'register'" class="p-6 md:p-8">
              <h3 class="font-heading text-xl text-pif-black dark:text-white mb-2">Register for Trade Account</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">Complete the form below to apply for wholesale access</p>

              <form @submit.prevent="handleRegister" class="space-y-4">
                <!-- Business Details -->
                <div class="pb-4 border-b border-gray-200 dark:border-dark-600">
                  <h4 class="text-sm font-semibold text-pif-green-dark dark:text-pif-gold uppercase tracking-wider mb-3">Business Details</h4>

                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Name *</label>
                      <input
                        v-model="registerForm.businessName"
                        type="text"
                        required
                        class="w-full px-4 py-3 bg-white dark:bg-dark-300 border border-gray-300 dark:border-dark-600 rounded-lg text-pif-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pif-green dark:focus:ring-pif-gold focus:border-transparent"
                        placeholder="Your Business Ltd"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Type *</label>
                      <select
                        v-model="registerForm.businessType"
                        required
                        class="w-full px-4 py-3 bg-white dark:bg-dark-300 border border-gray-300 dark:border-dark-600 rounded-lg text-pif-black dark:text-white focus:outline-none focus:ring-2 focus:ring-pif-green dark:focus:ring-pif-gold focus:border-transparent"
                      >
                        <option value="" class="text-gray-400">Select business type</option>
                        <option v-for="type in businessTypes" :key="type" :value="type">
                          {{ type }}
                        </option>
                      </select>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">VAT Number (optional)</label>
                      <input
                        v-model="registerForm.vatNumber"
                        type="text"
                        class="w-full px-4 py-3 bg-white dark:bg-dark-300 border border-gray-300 dark:border-dark-600 rounded-lg text-pif-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pif-green dark:focus:ring-pif-gold focus:border-transparent"
                        placeholder="GB123456789"
                      />
                    </div>
                  </div>
                </div>

                <!-- Contact Details -->
                <div class="pb-4 border-b border-gray-200 dark:border-dark-600">
                  <h4 class="text-sm font-semibold text-pif-green-dark dark:text-pif-gold uppercase tracking-wider mb-3">Contact Details</h4>

                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Name *</label>
                      <input
                        v-model="registerForm.contactName"
                        type="text"
                        required
                        class="w-full px-4 py-3 bg-white dark:bg-dark-300 border border-gray-300 dark:border-dark-600 rounded-lg text-pif-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pif-green dark:focus:ring-pif-gold focus:border-transparent"
                        placeholder="John Smith"
                      />
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address *</label>
                        <input
                          v-model="registerForm.email"
                          type="email"
                          required
                          class="w-full px-4 py-3 bg-white dark:bg-dark-300 border border-gray-300 dark:border-dark-600 rounded-lg text-pif-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pif-green dark:focus:ring-pif-gold focus:border-transparent"
                          placeholder="your@business.com"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number *</label>
                        <input
                          v-model="registerForm.phone"
                          type="tel"
                          required
                          class="w-full px-4 py-3 bg-white dark:bg-dark-300 border border-gray-300 dark:border-dark-600 rounded-lg text-pif-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pif-green dark:focus:ring-pif-gold focus:border-transparent"
                          placeholder="01234 567 890"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Address -->
                <div class="pb-4 border-b border-gray-200 dark:border-dark-600">
                  <h4 class="text-sm font-semibold text-pif-green-dark dark:text-pif-gold uppercase tracking-wider mb-3">Business Address</h4>

                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address *</label>
                      <input
                        v-model="registerForm.address"
                        type="text"
                        required
                        class="w-full px-4 py-3 bg-white dark:bg-dark-300 border border-gray-300 dark:border-dark-600 rounded-lg text-pif-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pif-green dark:focus:ring-pif-gold focus:border-transparent"
                        placeholder="123 Business Street"
                      />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City *</label>
                        <input
                          v-model="registerForm.city"
                          type="text"
                          required
                          class="w-full px-4 py-3 bg-white dark:bg-dark-300 border border-gray-300 dark:border-dark-600 rounded-lg text-pif-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pif-green dark:focus:ring-pif-gold focus:border-transparent"
                          placeholder="London"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Postcode *</label>
                        <input
                          v-model="registerForm.postcode"
                          type="text"
                          required
                          class="w-full px-4 py-3 bg-white dark:bg-dark-300 border border-gray-300 dark:border-dark-600 rounded-lg text-pif-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pif-green dark:focus:ring-pif-gold focus:border-transparent"
                          placeholder="SW1A 1AA"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Password -->
                <div class="pb-4">
                  <h4 class="text-sm font-semibold text-pif-green-dark dark:text-pif-gold uppercase tracking-wider mb-3">Account Security</h4>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password *</label>
                      <input
                        v-model="registerForm.password"
                        type="password"
                        required
                        class="w-full px-4 py-3 bg-white dark:bg-dark-300 border border-gray-300 dark:border-dark-600 rounded-lg text-pif-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pif-green dark:focus:ring-pif-gold focus:border-transparent"
                        placeholder="Min 8 characters"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password *</label>
                      <input
                        v-model="registerForm.confirmPassword"
                        type="password"
                        required
                        class="w-full px-4 py-3 bg-white dark:bg-dark-300 border border-gray-300 dark:border-dark-600 rounded-lg text-pif-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pif-green dark:focus:ring-pif-gold focus:border-transparent"
                        placeholder="Confirm password"
                      />
                    </div>
                  </div>
                </div>

                <!-- Terms -->
                <div>
                  <label class="flex items-start gap-3">
                    <input
                      v-model="registerForm.agreeTerms"
                      type="checkbox"
                      required
                      class="w-4 h-4 mt-1 bg-white dark:bg-dark-300 border-gray-300 dark:border-dark-600 text-pif-green dark:text-pif-gold rounded focus:ring-pif-green dark:focus:ring-pif-gold focus:ring-offset-white dark:focus:ring-offset-dark-100"
                    />
                    <span class="text-sm text-gray-600 dark:text-gray-400">
                      I agree to the <NuxtLink to="/terms" class="text-pif-green-dark dark:text-pif-gold hover:underline">Terms & Conditions</NuxtLink>
                      and <NuxtLink to="/policies/privacy" class="text-pif-green-dark dark:text-pif-gold hover:underline">Privacy Policy</NuxtLink>
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  class="w-full py-3 px-6 bg-pif-green-dark dark:bg-pif-gold text-white dark:text-pif-black font-medium rounded-lg hover:bg-pif-green dark:hover:bg-pif-gold-light transition-colors"
                >
                  Submit Application
                </button>

                <p class="text-xs text-gray-500 dark:text-gray-500 text-center">
                  Applications are typically reviewed within 24-48 hours
                </p>
              </form>

              <div class="mt-6 pt-6 border-t border-gray-200 dark:border-dark-600 text-center">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Already have a trade account?
                  <button @click="activeTab = 'login'" class="text-pif-green-dark dark:text-pif-gold font-medium hover:underline">
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
