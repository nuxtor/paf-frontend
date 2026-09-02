<script setup lang="ts">
// Listeners and stray attributes belong on the <input>, not on the wrapper
// <div>. Focus events in particular do not bubble, so an @blur left to fall
// through to the wrapper would simply never fire.
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    type?: string
    label?: string
    placeholder?: string
    error?: string
    hint?: string
    disabled?: boolean
    required?: boolean
    id?: string
  }>(),
  {
    modelValue: '',
    type: 'text',
    disabled: false,
    required: false,
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const inputId = computed(() => props.id || `input-${Math.random().toString(36).slice(2, 9)}`)

const inputClasses = computed(() => [
  'block w-full rounded-lg border px-4 py-2.5 text-pif-black dark:text-white bg-white dark:bg-dark-300 placeholder-gray-400 dark:placeholder-gray-500',
  'transition-colors duration-200',
  'focus:outline-none focus:ring-2 focus:ring-pif-green dark:focus:ring-pif-gold focus:border-pif-green dark:focus:border-pif-gold',
  'disabled:bg-gray-100 dark:disabled:bg-dark-200 disabled:cursor-not-allowed',
  props.error
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300 dark:border-dark-600',
])

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', props.type === 'number' ? Number(target.value) : target.value)
}
</script>

<template>
  <div class="space-y-1">
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-pif-black dark:text-white">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :class="inputClasses"
      v-bind="$attrs"
      @input="handleInput"
    />
    <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
    <p v-else-if="hint" class="text-sm text-gray-500 dark:text-gray-400">{{ hint }}</p>
  </div>
</template>
