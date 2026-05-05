<script setup lang="ts">
useSeoMeta({
  title: 'Contact Us | Premium Abrahimic Foods',
  description: 'Get in touch with Premium Abrahimic Foods. We are here to help.',
})

const appConfig = useAppConfig()

const form = ref({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
})

const isLoading = ref(false)
const isSubmitted = ref(false)

const handleSubmit = async () => {
  isLoading.value = true
  try {
    // TODO: Implement API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    isSubmitted.value = true
  } finally {
    isLoading.value = false
  }
}

const breadcrumbs = [{ label: 'Contact Us' }]
</script>

<template>
  <div>
    <!-- Hero -->
    <div class="relative h-64 md:h-80 bg-pif-green-dark">
      <div class="absolute inset-0 flex items-center justify-center">
        <h1 class="font-heading text-4xl md:text-5xl text-white">Contact Us</h1>
      </div>
    </div>

    <div class="container py-12">
      <TheBreadcrumb :items="breadcrumbs" />

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Contact Info -->
        <div class="lg:col-span-1">
          <h2 class="font-heading text-2xl text-pif-black mb-6">Get in Touch</h2>

          <div class="space-y-6">
            <div class="flex items-start gap-4">
              <div class="p-3 bg-pif-cream rounded-lg">
                <Icon name="heroicons:envelope" class="w-6 h-6 text-pif-green" />
              </div>
              <div>
                <h3 class="font-medium text-pif-black">Email</h3>
                <a
                  :href="`mailto:${appConfig.contact.email}`"
                  class="text-gray-600 hover:text-pif-green-dark"
                >
                  {{ appConfig.contact.email }}
                </a>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="p-3 bg-pif-cream rounded-lg">
                <Icon name="heroicons:phone" class="w-6 h-6 text-pif-green" />
              </div>
              <div>
                <h3 class="font-medium text-pif-black">Phone</h3>
                <a
                  :href="`tel:${appConfig.contact.phone}`"
                  class="text-gray-600 hover:text-pif-green-dark"
                >
                  {{ appConfig.contact.phone }}
                </a>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="p-3 bg-pif-cream rounded-lg">
                <Icon name="heroicons:clock" class="w-6 h-6 text-pif-green" />
              </div>
              <div>
                <h3 class="font-medium text-pif-black">Hours</h3>
                <p class="text-gray-600">
                  Monday - Friday: 9am - 6pm<br />
                  Saturday: 10am - 4pm
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="lg:col-span-2">
          <PCard>
            <div v-if="isSubmitted" class="text-center py-8">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="heroicons:check" class="w-8 h-8 text-green-600" />
              </div>
              <h3 class="font-heading text-xl text-pif-black mb-2">Message Sent!</h3>
              <p class="text-gray-600">Thank you for contacting us. We'll get back to you soon.</p>
            </div>

            <form v-else class="space-y-4" @submit.prevent="handleSubmit">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PInput v-model="form.name" label="Name" placeholder="Your name" required />
                <PInput v-model="form.email" label="Email" type="email" placeholder="your@email.com" required />
                <PInput v-model="form.phone" label="Phone" type="tel" placeholder="+44 123 456 7890" />
                <PInput v-model="form.subject" label="Subject" placeholder="How can we help?" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-pif-black mb-1">Message</label>
                <textarea
                  v-model="form.message"
                  rows="5"
                  required
                  placeholder="Tell us more..."
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pif-green focus:border-pif-green"
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
