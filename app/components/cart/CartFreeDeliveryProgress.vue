<script setup lang="ts">
import { FREE_DELIVERY_THRESHOLD } from '~/utils/constants'

const props = defineProps<{
  subtotal: number
}>()

const remaining = computed(() => Math.max(0, FREE_DELIVERY_THRESHOLD - props.subtotal))
const qualified = computed(() => remaining.value <= 0)
const progress = computed(() =>
  Math.min(100, Math.round((props.subtotal / FREE_DELIVERY_THRESHOLD) * 100))
)
</script>

<template>
  <div class="rounded-lg bg-pif-green-dark/5 dark:bg-pif-gold/10 p-3">
    <p
      v-if="qualified"
      class="flex items-center gap-1.5 text-sm font-medium text-pif-green-dark dark:text-pif-gold"
    >
      <Icon name="heroicons:truck" class="w-4 h-4" />
      You've unlocked FREE delivery!
    </p>
    <template v-else>
      <p class="text-sm text-gray-700 dark:text-gray-300 mb-2">
        Add
        <span class="font-semibold text-pif-green-dark dark:text-pif-gold">
          {{ formatCurrency(remaining) }}
        </span>
        more for FREE delivery
      </p>
      <div class="h-1.5 rounded-full bg-gray-200 dark:bg-dark-600 overflow-hidden">
        <div
          class="h-full bg-pif-green-dark dark:bg-pif-gold transition-all duration-300"
          :style="{ width: `${progress}%` }"
        />
      </div>
    </template>
  </div>
</template>
