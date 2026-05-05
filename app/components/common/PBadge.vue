<script setup lang="ts">
type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'gold'
type BadgeSize = 'sm' | 'md'

const props = withDefaults(
  defineProps<{
    variant?: BadgeVariant
    size?: BadgeSize
  }>(),
  {
    variant: 'default',
    size: 'sm',
  }
)

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700',
  primary: 'bg-pif-green-dark text-white',
  secondary: 'bg-pif-green text-white',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
  gold: 'bg-pif-gold text-pif-black',
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
}

const badgeClasses = computed(() => [
  'inline-flex items-center font-medium rounded-full',
  variantClasses[props.variant],
  sizeClasses[props.size],
])
</script>

<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>
