<script setup lang="ts">
definePageMeta({
  layout: 'account',
})

useSeoMeta({
  title: 'Order History | Premium Abrahimic Foods',
})
</script>

<template>
  <div>
    <h1 class="font-heading text-2xl text-pif-black mb-6">Order History</h1>

    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="p-8 text-center text-gray-500">
        <Icon name="heroicons:shopping-bag" class="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p class="mb-4">You haven't placed any orders yet.</p>
        <NuxtLink
          to="/products"
          class="inline-flex items-center gap-2 px-6 py-3 bg-pif-green-dark text-white font-medium rounded-lg hover:bg-pif-green transition-colors"
        >
          Start Shopping
          <Icon name="heroicons:arrow-right" class="w-5 h-5" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
