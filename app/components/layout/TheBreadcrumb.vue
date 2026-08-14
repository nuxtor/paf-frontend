<script setup lang="ts">
interface BreadcrumbItem {
  label: string
  to?: string
}

defineProps<{
  items: BreadcrumbItem[]
}>()
</script>

<template>
  <nav class="py-4">
    <ol class="flex items-center gap-2 text-sm">
      <li>
        <NuxtLink
          to="/"
          class="text-gray-500 dark:text-gray-400 hover:text-pif-green-dark dark:hover:text-pif-gold transition-colors"
        >
          <Icon name="heroicons:home" class="w-4 h-4" />
        </NuxtLink>
      </li>
      <template v-for="(item, index) in items" :key="index">
        <li class="text-gray-400 dark:text-gray-600">
          <Icon name="heroicons:chevron-right" class="w-4 h-4" />
        </li>
        <li>
          <NuxtLink
            v-if="item.to && index !== items.length - 1"
            :to="item.to"
            class="text-gray-500 dark:text-gray-400 hover:text-pif-green-dark dark:hover:text-pif-gold transition-colors"
          >
            {{ item.label }}
          </NuxtLink>
          <span v-else class="text-pif-black dark:text-white font-medium">
            {{ item.label }}
          </span>
        </li>
      </template>
    </ol>
  </nav>
</template>
