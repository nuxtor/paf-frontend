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
        <template v-for="block in blocks" :key="block.id">
          <a
            v-if="block.link_url && isExternal(block.link_url)"
            :href="block.link_url"
            target="_blank"
            rel="noopener noreferrer"
            class="group relative overflow-hidden rounded-xl aspect-[16/9] block"
          >
            <img
              :src="cmsImageUrl(block.image)"
              :alt="block.title || ''"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div class="absolute inset-0 flex flex-col items-start justify-end p-6 text-white">
              <h3 v-if="block.title" class="font-heading text-2xl md:text-3xl mb-2">{{ block.title }}</h3>
              <p v-if="block.subtitle" class="text-sm md:text-base text-white/90 mb-3">{{ block.subtitle }}</p>
              <span
                v-if="block.cta_label"
                class="inline-flex items-center gap-2 px-4 py-2 bg-pif-gold text-pif-black font-medium rounded-lg group-hover:bg-pif-gold-light transition-colors text-sm"
              >
                {{ block.cta_label }}
                <Icon name="heroicons:arrow-right" class="w-4 h-4" />
              </span>
            </div>
          </a>
          <NuxtLink
            v-else-if="block.link_url"
            :to="block.link_url"
            class="group relative overflow-hidden rounded-xl aspect-[16/9] block"
          >
            <img
              :src="cmsImageUrl(block.image)"
              :alt="block.title || ''"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div class="absolute inset-0 flex flex-col items-start justify-end p-6 text-white">
              <h3 v-if="block.title" class="font-heading text-2xl md:text-3xl mb-2">{{ block.title }}</h3>
              <p v-if="block.subtitle" class="text-sm md:text-base text-white/90 mb-3">{{ block.subtitle }}</p>
              <span
                v-if="block.cta_label"
                class="inline-flex items-center gap-2 px-4 py-2 bg-pif-gold text-pif-black font-medium rounded-lg group-hover:bg-pif-gold-light transition-colors text-sm"
              >
                {{ block.cta_label }}
                <Icon name="heroicons:arrow-right" class="w-4 h-4" />
              </span>
            </div>
          </NuxtLink>
          <div
            v-else
            class="group relative overflow-hidden rounded-xl aspect-[16/9] block"
          >
            <img
              :src="cmsImageUrl(block.image)"
              :alt="block.title || ''"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div class="absolute inset-0 flex flex-col items-start justify-end p-6 text-white">
              <h3 v-if="block.title" class="font-heading text-2xl md:text-3xl mb-2">{{ block.title }}</h3>
              <p v-if="block.subtitle" class="text-sm md:text-base text-white/90 mb-3">{{ block.subtitle }}</p>
              <span
                v-if="block.cta_label"
                class="inline-flex items-center gap-2 px-4 py-2 bg-pif-gold text-pif-black font-medium rounded-lg group-hover:bg-pif-gold-light transition-colors text-sm"
              >
                {{ block.cta_label }}
                <Icon name="heroicons:arrow-right" class="w-4 h-4" />
              </span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>
