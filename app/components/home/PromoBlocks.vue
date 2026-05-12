<script setup lang="ts">
import type { PromoPlacement } from '~/types/cms'

const props = defineProps<{
  placement: PromoPlacement
}>()

const cmsStore = useCmsStore()
const { cmsImageUrl } = useCms()

const blocks = computed(() => cmsStore.promoBlocks[props.placement] ?? [])

const isExternal = (url?: string | null) => !!url && /^https?:\/\//i.test(url)
</script>

<template>
  <section v-if="blocks.length" class="section-padding">
    <div class="container">
      <div
        :class="[
          'grid gap-4 md:gap-6',
          blocks.length === 1
            ? 'grid-cols-1'
            : blocks.length === 2
              ? 'grid-cols-1 md:grid-cols-2'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        ]"
      >
        <component
          :is="block.link_url ? (isExternal(block.link_url) ? 'a' : resolveComponent('NuxtLink')) : 'div'"
          v-for="block in blocks"
          :key="block.id"
          :to="!isExternal(block.link_url) ? block.link_url : undefined"
          :href="isExternal(block.link_url) ? block.link_url : undefined"
          :target="isExternal(block.link_url) ? '_blank' : undefined"
          :rel="isExternal(block.link_url) ? 'noopener noreferrer' : undefined"
          class="group relative overflow-hidden rounded-xl aspect-[16/9] block"
        >
          <img
            :src="cmsImageUrl(block.image)"
            :alt="block.title || ''"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div class="absolute inset-0 flex flex-col items-start justify-end p-6 text-white">
            <h3 v-if="block.title" class="font-heading text-2xl md:text-3xl mb-2">
              {{ block.title }}
            </h3>
            <p v-if="block.subtitle" class="text-sm md:text-base text-white/90 mb-3">
              {{ block.subtitle }}
            </p>
            <span
              v-if="block.cta_label"
              class="inline-flex items-center gap-2 px-4 py-2 bg-pif-gold text-pif-black font-medium rounded-lg group-hover:bg-pif-gold-light transition-colors text-sm"
            >
              {{ block.cta_label }}
              <Icon name="heroicons:arrow-right" class="w-4 h-4" />
            </span>
          </div>
        </component>
      </div>
    </div>
  </section>
</template>
