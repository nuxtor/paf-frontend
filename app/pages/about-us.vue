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

      <article
        class="max-w-3xl mx-auto prose prose-lg dark:prose-invert prose-headings:font-heading prose-a:text-pif-green-dark dark:prose-a:text-pif-gold"
        v-html="page.body"
      />
    </div>
  </div>
</template>
