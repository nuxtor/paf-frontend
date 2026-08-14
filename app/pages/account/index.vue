<script setup lang="ts">
definePageMeta({
  layout: 'account',
})

const authStore = useAuthStore()

useSeoMeta({
  title: 'My Account | Premium Abrahamic Foods',
})

const quickLinks = [
  {
    icon: 'heroicons:shopping-bag',
    title: 'Orders',
    description: 'View your order history',
    to: '/account/orders',
  },
  {
    icon: 'heroicons:map-pin',
    title: 'Addresses',
    description: 'Manage your addresses',
    to: '/account/addresses',
  },
  {
    icon: 'heroicons:cog-6-tooth',
    title: 'Settings',
    description: 'Update your account',
    to: '/account/settings',
  },
]
</script>

<template>
  <div>
    <h1 class="font-heading text-2xl text-pif-black mb-6">
      Welcome back, {{ authStore.user?.first_name || 'Guest' }}!
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <NuxtLink
        v-for="link in quickLinks"
        :key="link.to"
        :to="link.to"
        class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
      >
        <Icon :name="link.icon" class="w-8 h-8 text-pif-green mb-3" />
        <h3 class="font-medium text-pif-black mb-1">{{ link.title }}</h3>
        <p class="text-sm text-gray-500">{{ link.description }}</p>
      </NuxtLink>
    </div>

    <!-- Recent Orders -->
    <div class="mt-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-heading text-xl text-pif-black">Recent Orders</h2>
        <NuxtLink to="/account/orders" class="text-sm text-pif-green-dark hover:underline">
          View All
        </NuxtLink>
      </div>

      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="p-8 text-center text-gray-500">
          <Icon name="heroicons:shopping-bag" class="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No orders yet</p>
          <NuxtLink
            to="/products"
            class="inline-block mt-4 text-pif-green-dark font-medium hover:underline"
          >
            Start Shopping
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
