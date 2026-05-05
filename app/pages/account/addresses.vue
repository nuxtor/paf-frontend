<script setup lang="ts">
definePageMeta({
  layout: 'account',
})

const authStore = useAuthStore()

useSeoMeta({
  title: 'Address Book | Premium Abrahimic Foods',
})

const showAddForm = ref(false)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="font-heading text-2xl text-pif-black">Address Book</h1>
      <PButton variant="primary" size="sm" @click="showAddForm = true">
        <Icon name="heroicons:plus" class="w-4 h-4 mr-2" />
        Add Address
      </PButton>
    </div>

    <div v-if="!authStore.user?.addresses?.length" class="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
      <Icon name="heroicons:map-pin" class="w-12 h-12 mx-auto mb-3 text-gray-300" />
      <p>No addresses saved yet.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="address in authStore.user.addresses"
        :key="address.id"
        class="bg-white rounded-xl shadow-sm p-6"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-2">
            <span v-if="address.label" class="font-medium">{{ address.label }}</span>
            <PBadge v-if="address.is_default_shipping" variant="primary" size="sm">
              Default
            </PBadge>
          </div>
          <div class="flex items-center gap-2">
            <button class="text-gray-400 hover:text-pif-green-dark transition-colors">
              <Icon name="heroicons:pencil" class="w-4 h-4" />
            </button>
            <button class="text-gray-400 hover:text-red-500 transition-colors">
              <Icon name="heroicons:trash" class="w-4 h-4" />
            </button>
          </div>
        </div>
        <p class="text-sm text-gray-600">
          {{ address.first_name }} {{ address.last_name }}<br />
          {{ address.address_line_1 }}<br />
          <span v-if="address.address_line_2">{{ address.address_line_2 }}<br /></span>
          {{ address.city }}, {{ address.postcode }}<br />
          {{ address.country }}
        </p>
      </div>
    </div>
  </div>
</template>
