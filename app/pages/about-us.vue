<script setup lang="ts">
const { getPage } = useCms()

const { data, error } = await useAsyncData('cms-page-about-us', async () => {
  try {
    const res = await getPage('about-us')
    return res.page
  } catch (err: any) {
    if (err?.response?.status === 404 || err?.statusCode === 404) {
      throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
    }
    throw err
  }
})

if (error.value) {
  throw createError({ statusCode: 500, statusMessage: 'Failed to load page', fatal: true })
}

if (!data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const page = computed(() => data.value!)

useSeoMeta({
  title: () => page.value.meta_title || `${page.value.title} | Premium Abrahimic Foods`,
  description: () => page.value.meta_description || undefined,
  ogTitle: () => page.value.meta_title || page.value.title,
  ogDescription: () => page.value.meta_description || undefined,
})

const breadcrumbs = computed(() => [{ label: page.value.title }])

const features = [
  {
    icon: 'heroicons:shield-check',
    title: '100% Halal Certified',
    description: 'Every product is verified by recognised halal certification bodies.',
  },
  {
    icon: 'heroicons:sparkles',
    title: 'Premium Quality',
    description: 'Ethically sourced, fresh, and held to the highest standards.',
  },
  {
    icon: 'heroicons:truck',
    title: 'UK-Wide Delivery',
    description: 'Reliable, temperature-controlled delivery to your door.',
  },
]
</script>

<template>
  <div>
    <div class="relative h-64 md:h-80 bg-pif-green-dark">
      <div class="absolute inset-0 flex items-center justify-center px-4">
        <h1 class="font-heading text-4xl md:text-5xl text-white text-center">
          {{ page.title }}
        </h1>
      </div>
    </div>

    <div class="container py-12">
      <TheBreadcrumb :items="breadcrumbs" />

      <section class="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="text-center p-6 rounded-xl bg-pif-cream dark:bg-dark-200 border border-gray-100 dark:border-dark-600"
        >
          <div
            class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-pif-green-dark/10 text-pif-green-dark dark:bg-pif-gold/10 dark:text-pif-gold mb-4"
          >
            <Icon :name="feature.icon" class="w-7 h-7" />
          </div>
          <h3 class="font-heading text-xl text-pif-black dark:text-white mb-2">
            {{ feature.title }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ feature.description }}
          </p>
        </div>
      </section>

      <article
        class="max-w-3xl mx-auto prose prose-lg dark:prose-invert prose-headings:font-heading prose-a:text-pif-green-dark dark:prose-a:text-pif-gold"
        v-html="page.body"
      />
    </div>
  </div>
</template>
