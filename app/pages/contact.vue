<script setup lang="ts">
import { CONTACT_PHONES, SHOP_HOURS } from '~/utils/constants'

useSeoMeta({
  title: 'Contact Us | Premium Abrahamic Foods',
  description: 'Get in touch with Premium Abrahamic Foods. We are here to help.',
})

const appConfig = useAppConfig()

// A search link rather than an embedded map: no third-party script, no consent
// banner, and it opens in whichever maps app the visitor already uses.
const mapsHref = computed(() => {
  const a = appConfig.contact.address
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${a.line1}, ${a.city}, ${a.county}, ${a.postcode}`
  )}`
})

const { apiFetch } = useApi()

const form = ref({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  // Honeypot. Hidden from real visitors, so anything in it came from a bot
  // filling in every input on the page; the API drops those silently.
  company_website: '',
})

const isLoading = ref(false)
const isSubmitted = ref(false)
const error = ref('')

const handleSubmit = async () => {
  isLoading.value = true
  error.value = ''

  try {
    await apiFetch('/contact', {
      method: 'POST',
      body: form.value,
    })
    isSubmitted.value = true
  } catch (e: any) {
    const status = e?.response?.status
    const data = e?.response?._data

    if (status === 422 && data?.errors) {
      error.value = Object.values(data.errors).flat().join(' ')
    } else if (status === 429) {
      error.value = 'You have already sent us a few messages. Please wait a little while before sending another.'
    } else {
      error.value =
        'Sorry, we could not send your message just now. Please try again, or call us on 020 8478 0552.'
    }
  } finally {
    isLoading.value = false
  }
}

const breadcrumbs = [{ label: 'Contact Us' }]
</script>

<template>
  <div>
    <!-- Hero -->
    <div class="relative h-48 md:h-64 bg-pif-green-dark">
      <div class="absolute inset-0 flex items-center justify-center px-4">
        <h1 class="font-heading text-3xl md:text-5xl text-white text-center">Contact Us</h1>
      </div>
    </div>

    <div class="container py-8 md:py-12">
      <TheBreadcrumb :items="breadcrumbs" />

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Contact Info -->
        <div class="lg:col-span-1">
          <h2 class="font-heading text-2xl text-pif-black dark:text-white mb-6">Get in Touch</h2>

          <div class="space-y-6">
            <div class="flex items-start gap-4">
              <div class="p-3 bg-pif-cream dark:bg-dark-300 rounded-lg">
                <Icon name="heroicons:envelope" class="w-6 h-6 text-pif-green" />
              </div>
              <div>
                <h3 class="font-medium text-pif-black dark:text-white">Email</h3>
                <a
                  :href="`mailto:${appConfig.contact.email}`"
                  class="text-gray-600 dark:text-gray-300 hover:text-pif-green-dark dark:hover:text-pif-gold"
                >
                  {{ appConfig.contact.email }}
                </a>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="p-3 bg-pif-cream dark:bg-dark-300 rounded-lg">
                <Icon name="heroicons:phone" class="w-6 h-6 text-pif-green" />
              </div>
              <div>
                <h3 class="font-medium text-pif-black dark:text-white">Phone</h3>
                <ul class="space-y-1.5 mt-1">
                  <li
                    v-for="phone in CONTACT_PHONES"
                    :key="phone.number"
                    class="flex items-center flex-wrap gap-x-2 gap-y-0.5"
                  >
                    <a :href="telHref(phone.number)" class="text-gray-700 dark:text-gray-300 hover:text-pif-green-dark dark:hover:text-pif-gold">
                      {{ phone.number }}
                    </a>
                    <span class="text-sm text-gray-500 dark:text-gray-400">- {{ phone.hours }}</span>
                    <a
                      v-if="phone.whatsapp"
                      :href="whatsappHref(phone.number)"
                      target="_blank"
                      rel="noopener noreferrer"
                      :aria-label="`Message ${phone.number} on WhatsApp`"
                      class="text-[#25D366] hover:opacity-80 transition-opacity"
                    >
                      <Icon name="mdi:whatsapp" class="w-5 h-5" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="p-3 bg-pif-cream dark:bg-dark-300 rounded-lg">
                <Icon name="heroicons:map-pin" class="w-6 h-6 text-pif-green" />
              </div>
              <div>
                <h3 class="font-medium text-pif-black dark:text-white">Visit Us</h3>
                <address class="text-gray-600 dark:text-gray-300 not-italic">
                  {{ appConfig.contact.address.line1 }}<br />
                  {{ appConfig.contact.address.city }}, {{ appConfig.contact.address.county }}<br />
                  {{ appConfig.contact.address.postcode }}
                </address>
                <a
                  :href="mapsHref"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mt-1 inline-block text-sm text-pif-green-dark dark:text-pif-gold hover:underline"
                >
                  View on map
                </a>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="p-3 bg-pif-cream dark:bg-dark-300 rounded-lg">
                <Icon name="heroicons:clock" class="w-6 h-6 text-pif-green" />
              </div>
              <div>
                <h3 class="font-medium text-pif-black dark:text-white">Shop Open time</h3>
                <p class="text-gray-600 dark:text-gray-300">
                  <template v-for="(slot, i) in SHOP_HOURS" :key="slot.days">
                    <br v-if="i" />{{ slot.days }}: {{ slot.time }}
                  </template>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="lg:col-span-2">
          <h2 class="font-heading text-2xl text-pif-black dark:text-white mb-6">Send Us a Message</h2>

          <PCard>
            <div v-if="isSubmitted" class="text-center py-8">
              <div class="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="heroicons:check" class="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 class="font-heading text-xl text-pif-black dark:text-white mb-2">Message Sent!</h3>
              <p class="text-gray-600 dark:text-gray-300">Thank you for contacting us. We'll get back to you soon.</p>
            </div>

            <form v-else class="space-y-4" @submit.prevent="handleSubmit">
              <div
                v-if="error"
                class="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm"
              >
                {{ error }}
              </div>

              <!-- Honeypot: display:none, so only a bot ever fills it in. -->
              <input
                v-model="form.company_website"
                type="text"
                name="company_website"
                tabindex="-1"
                autocomplete="off"
                aria-hidden="true"
                class="hidden"
              >

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PInput v-model="form.name" label="Name" placeholder="Your name" required />
                <PInput v-model="form.email" label="Email" type="email" placeholder="your@email.com" required />
                <PInput v-model="form.phone" label="Phone" type="tel" placeholder="+44 123 456 7890" />
                <PInput v-model="form.subject" label="Subject" placeholder="How can we help?" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-pif-black dark:text-white mb-1">Message</label>
                <textarea
                  v-model="form.message"
                  rows="5"
                  required
                  placeholder="Tell us more..."
                  class="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-300 text-pif-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-pif-green dark:focus:ring-pif-gold focus:border-pif-green"
                />
              </div>
              <PButton type="submit" variant="primary" size="lg" :loading="isLoading">
                Send Message
              </PButton>
            </form>
          </PCard>
        </div>
      </div>
    </div>
  </div>
</template>
