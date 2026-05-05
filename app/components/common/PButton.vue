<script setup lang="ts">
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold'
type ButtonSize = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
    size?: ButtonSize
    loading?: boolean
    disabled?: boolean
    block?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    block: false,
    type: 'button',
  }
)

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-pif-green-dark dark:bg-pif-gold text-white dark:text-pif-black hover:bg-pif-green dark:hover:bg-pif-gold-light active:bg-pif-green-dark dark:active:bg-pif-gold',
  secondary: 'bg-pif-green text-white hover:bg-pif-green-light active:bg-pif-green',
  outline:
    'border-2 border-pif-green-dark dark:border-pif-gold text-pif-green-dark dark:text-pif-gold hover:bg-pif-green-dark dark:hover:bg-pif-gold hover:text-white dark:hover:text-pif-black',
  ghost: 'text-pif-green-dark dark:text-pif-gold hover:bg-pif-green-dark/10 dark:hover:bg-pif-gold/10',
  gold: 'bg-pif-gold text-pif-black hover:bg-pif-gold-light active:bg-pif-gold',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3 text-lg',
}

const buttonClasses = computed(() => [
  'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200',
  'focus:outline-none focus:ring-2 focus:ring-pif-green dark:focus:ring-pif-gold focus:ring-offset-2 dark:focus:ring-offset-dark-200',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  variantClasses[props.variant],
  sizeClasses[props.size],
  props.block && 'w-full',
])
</script>

<template>
  <button :class="buttonClasses" :disabled="disabled || loading" :type="type">
    <svg
      v-if="loading"
      class="-ml-1 mr-2 h-4 w-4 animate-spin"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
    <slot />
  </button>
</template>
