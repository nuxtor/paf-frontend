<script setup lang="ts">
withDefaults(
  defineProps<{
    padding?: 'none' | 'sm' | 'md' | 'lg'
    shadow?: 'none' | 'sm' | 'md' | 'lg'
    hover?: boolean
  }>(),
  {
    padding: 'md',
    shadow: 'sm',
    hover: false,
  }
)

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4 md:p-6',
  lg: 'p-6 md:p-8',
}

const shadowClasses = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
}
</script>

<template>
  <div
    :class="[
      'bg-white dark:bg-dark-200 rounded-xl',
      paddingClasses[padding],
      shadowClasses[shadow],
      hover && 'transition-shadow duration-300 hover:shadow-md',
    ]"
  >
    <slot />
  </div>
</template>
