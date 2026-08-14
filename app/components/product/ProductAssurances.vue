<script setup lang="ts">
// Static quality assurances shown on every product detail page.
const assurances = ['grass-fed', 'fresh', 'halal', 'no-hormones'] as const

const labels: Record<(typeof assurances)[number], string> = {
  'grass-fed': 'Grass Fed',
  fresh: 'Fresh',
  halal: 'Halal',
  'no-hormones': 'No hormones',
}
</script>

<template>
  <div class="grid grid-cols-4 gap-1.5 sm:gap-3">
    <div v-for="key in assurances" :key="key" class="flex flex-col items-center text-center">
      <img
        :src="`/images/assurances/${key}.png`"
        :alt="labels[key]"
        width="64"
        height="64"
        loading="lazy"
        class="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 object-contain"
      />

      <p class="mt-2 text-[10px] sm:text-xs font-medium leading-tight text-pif-black dark:text-gray-200">
        {{ labels[key] }}
      </p>
    </div>
  </div>
</template>
