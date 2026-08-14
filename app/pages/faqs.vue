<script setup lang="ts">
const cmsStore = useCmsStore()

await useAsyncData('cms-faqs', async () => {
  await cmsStore.fetchFaqs()
  return true
})

useSeoMeta({
  title: 'Frequently Asked Questions | Premium Abrahamic Foods',
  description:
    'Find answers to common questions about our halal certification, delivery, returns and wholesale services.',
})

const breadcrumbs = [{ label: 'FAQs' }]
const openId = ref<number | null>(null)
const toggle = (id: number) => {
  openId.value = openId.value === id ? null : id
}
</script>

<template>
  <div>
    <div class="relative h-48 md:h-64 bg-pif-green-dark">
      <div class="absolute inset-0 flex items-center justify-center px-4">
        <h1 class="font-heading text-3xl md:text-5xl text-white text-center">
          Frequently Asked Questions
        </h1>
      </div>
    </div>

    <div class="container py-8 md:py-12">
      <TheBreadcrumb :items="breadcrumbs" />

      <div class="max-w-3xl mx-auto">
        <div
          v-if="!cmsStore.faqs.length"
          class="text-center py-12 text-gray-500 dark:text-gray-400"
        >
          No FAQs available right now.
        </div>

        <ul v-else class="space-y-3">
          <li
            v-for="faq in cmsStore.faqs"
            :key="faq.id"
            class="bg-white dark:bg-dark-200 rounded-xl border border-gray-200 dark:border-dark-600 overflow-hidden"
          >
            <button
              class="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
              :aria-expanded="openId === faq.id"
              @click="toggle(faq.id)"
            >
              <span class="font-medium text-pif-black dark:text-white">
                {{ faq.question }}
              </span>
              <Icon
                name="heroicons:chevron-down"
                :class="['w-5 h-5 text-pif-green-dark dark:text-pif-gold transition-transform flex-shrink-0', openId === faq.id && 'rotate-180']"
              />
            </button>
            <div
              v-if="openId === faq.id"
              class="px-5 pb-5 prose dark:prose-invert max-w-none prose-a:text-pif-green-dark dark:prose-a:text-pif-gold"
              v-html="faq.answer"
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
