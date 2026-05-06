<script setup lang="ts">
import type { Address } from '~/types/customer'

definePageMeta({
  layout: 'account',
})

const authStore = useAuthStore()
const { apiFetch } = useApi()
const uiStore = useUiStore()

useSeoMeta({
  title: 'Address Book | Premium Abrahimic Foods',
})

const showForm = ref(false)
const editingAddress = ref<Address | null>(null)
const isSaving = ref(false)

const blankAddress = (): Partial<Address> & { type: 'shipping' | 'billing' } => ({
  type: 'shipping',
  label: '',
  first_name: '',
  last_name: '',
  company: '',
  address_line_1: '',
  address_line_2: '',
  city: '',
  county: '',
  postcode: '',
  country: 'GB',
  phone: '',
  is_default_shipping: false,
  is_default_billing: false,
})

const form = ref<Partial<Address> & { type: 'shipping' | 'billing' }>(blankAddress())

const openAdd = () => {
  editingAddress.value = null
  form.value = blankAddress()
  showForm.value = true
}

const openEdit = (address: Address) => {
  editingAddress.value = address
  form.value = { ...address, type: address.is_default_billing ? 'billing' : 'shipping' }
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  editingAddress.value = null
}

const handleSubmit = async () => {
  isSaving.value = true
  try {
    if (editingAddress.value) {
      await apiFetch<{ address: Address }>(`/addresses/${editingAddress.value.id}`, {
        method: 'PUT',
        body: form.value,
      })
      uiStore.addToast('success', 'Address updated')
    } else {
      await apiFetch<{ address: Address }>('/addresses', {
        method: 'POST',
        body: form.value,
      })
      uiStore.addToast('success', 'Address added')
    }
    await authStore.fetchUser()
    closeForm()
  } catch (error: any) {
    uiStore.addToast('error', error?.data?.message || 'Failed to save address')
  } finally {
    isSaving.value = false
  }
}

const deleteAddress = async (address: Address) => {
  if (!confirm('Delete this address?')) return
  try {
    await apiFetch(`/addresses/${address.id}`, { method: 'DELETE' })
    uiStore.addToast('success', 'Address removed')
    await authStore.fetchUser()
  } catch (error: any) {
    uiStore.addToast('error', error?.data?.message || 'Failed to delete address')
  }
}

const setDefault = async (address: Address) => {
  try {
    await apiFetch(`/addresses/${address.id}/default`, { method: 'POST' })
    await authStore.fetchUser()
    uiStore.addToast('success', 'Default address updated')
  } catch (error: any) {
    uiStore.addToast('error', error?.data?.message || 'Failed to set default')
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="font-heading text-2xl text-pif-black">Address Book</h1>
      <PButton variant="primary" size="sm" @click="openAdd">
        <Icon name="heroicons:plus" class="w-4 h-4 mr-2" />
        Add Address
      </PButton>
    </div>

    <!-- Add/Edit Form -->
    <PCard v-if="showForm" class="mb-6">
      <h2 class="font-heading text-lg text-pif-black mb-4">
        {{ editingAddress ? 'Edit Address' : 'Add Address' }}
      </h2>
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PInput v-model="form.label" label="Label" placeholder="Home, Work, etc." />
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              v-model="form.type"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pif-green"
            >
              <option value="shipping">Shipping</option>
              <option value="billing">Billing</option>
            </select>
          </div>
          <PInput v-model="form.first_name" label="First Name" required />
          <PInput v-model="form.last_name" label="Last Name" required />
          <div class="md:col-span-2">
            <PInput v-model="form.company" label="Company (optional)" />
          </div>
          <div class="md:col-span-2">
            <PInput v-model="form.address_line_1" label="Address Line 1" required />
          </div>
          <div class="md:col-span-2">
            <PInput v-model="form.address_line_2" label="Address Line 2" />
          </div>
          <PInput v-model="form.city" label="City" required />
          <PInput v-model="form.county" label="County" />
          <PInput v-model="form.postcode" label="Postcode" required />
          <PInput v-model="form.phone" label="Phone" type="tel" />
        </div>

        <label class="flex items-center gap-2">
          <input
            v-model="form.is_default_shipping"
            type="checkbox"
            class="rounded text-pif-green-dark"
          />
          <span class="text-sm text-gray-700">Set as default address</span>
        </label>

        <div class="flex gap-3">
          <PButton type="submit" variant="primary" :loading="isSaving">
            {{ editingAddress ? 'Save Changes' : 'Add Address' }}
          </PButton>
          <PButton type="button" variant="ghost" @click="closeForm">
            Cancel
          </PButton>
        </div>
      </form>
    </PCard>

    <!-- Empty -->
    <div
      v-if="!authStore.user?.addresses?.length"
      class="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500"
    >
      <Icon name="heroicons:map-pin" class="w-12 h-12 mx-auto mb-3 text-gray-300" />
      <p>No addresses saved yet.</p>
    </div>

    <!-- List -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="address in authStore.user.addresses"
        :key="address.id"
        class="bg-white rounded-xl shadow-sm p-6"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-2 flex-wrap">
            <span v-if="address.label" class="font-medium">{{ address.label }}</span>
            <PBadge v-if="address.is_default_shipping" variant="primary" size="sm">
              Default Shipping
            </PBadge>
            <PBadge v-if="address.is_default_billing" variant="primary" size="sm">
              Default Billing
            </PBadge>
          </div>
          <div class="flex items-center gap-2">
            <button
              class="text-gray-400 hover:text-pif-green-dark transition-colors"
              :aria-label="`Edit ${address.label || 'address'}`"
              @click="openEdit(address)"
            >
              <Icon name="heroicons:pencil" class="w-4 h-4" />
            </button>
            <button
              class="text-gray-400 hover:text-red-500 transition-colors"
              :aria-label="`Delete ${address.label || 'address'}`"
              @click="deleteAddress(address)"
            >
              <Icon name="heroicons:trash" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <p class="text-sm text-gray-600">
          {{ address.first_name }} {{ address.last_name }}<br />
          <template v-if="address.company">{{ address.company }}<br /></template>
          {{ address.address_line_1 }}<br />
          <template v-if="address.address_line_2">{{ address.address_line_2 }}<br /></template>
          {{ address.city }}<template v-if="address.county">, {{ address.county }}</template><br />
          {{ address.postcode }}<br />
          {{ address.country }}
        </p>

        <button
          v-if="!address.is_default_shipping"
          class="mt-3 text-xs text-pif-green-dark hover:underline"
          @click="setDefault(address)"
        >
          Set as default
        </button>
      </div>
    </div>
  </div>
</template>
