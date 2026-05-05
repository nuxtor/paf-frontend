<script setup lang="ts">
const uiStore = useUiStore()

const typeConfig = {
  success: {
    bg: 'bg-green-50 border-green-200',
    text: 'text-green-800',
    icon: 'heroicons:check-circle',
    iconColor: 'text-green-500',
  },
  error: {
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-800',
    icon: 'heroicons:x-circle',
    iconColor: 'text-red-500',
  },
  warning: {
    bg: 'bg-yellow-50 border-yellow-200',
    text: 'text-yellow-800',
    icon: 'heroicons:exclamation-triangle',
    iconColor: 'text-yellow-500',
  },
  info: {
    bg: 'bg-blue-50 border-blue-200',
    text: 'text-blue-800',
    icon: 'heroicons:information-circle',
    iconColor: 'text-blue-500',
  },
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in uiStore.toasts"
          :key="toast.id"
          :class="[
            'pointer-events-auto flex items-start gap-3 p-4 rounded-lg border shadow-lg',
            typeConfig[toast.type].bg,
          ]"
        >
          <Icon
            :name="typeConfig[toast.type].icon"
            :class="['w-5 h-5 flex-shrink-0 mt-0.5', typeConfig[toast.type].iconColor]"
          />
          <p :class="['text-sm flex-1', typeConfig[toast.type].text]">
            {{ toast.message }}
          </p>
          <button
            :class="['flex-shrink-0', typeConfig[toast.type].text, 'opacity-60 hover:opacity-100']"
            @click="uiStore.removeToast(toast.id)"
          >
            <Icon name="heroicons:x-mark" class="w-4 h-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease;
}
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.toast-move {
  transition: transform 0.3s ease;
}
</style>
