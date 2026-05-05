<script setup lang="ts">
import { MAIN_CATEGORIES } from '~/utils/constants'

const route = useRoute()

const isActive = (slug: string) => {
  return route.path.includes(`/categories/${slug}`)
}
</script>

<template>
  <nav class="hidden lg:block border-t border-gray-100">
    <div class="container">
      <ul class="flex items-center justify-center gap-8">
        <li v-for="category in MAIN_CATEGORIES" :key="category.slug">
          <NuxtLink
            :to="`/categories/${category.slug}`"
            :class="[
              'inline-flex items-center gap-2 py-3 text-sm font-medium transition-colors',
              'hover:text-pif-green-dark border-b-2 border-transparent hover:border-pif-green-dark',
              isActive(category.slug) && 'text-pif-green-dark border-pif-green-dark',
            ]"
          >
            {{ category.name }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </nav>
</template>
