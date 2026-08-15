<script setup lang="ts">
import { FOOTER_POLICIES, FOOTER_INFO, CONTACT_PHONES, SHOP_HOURS } from '~/utils/constants'
import type { CmsMenuItem } from '~/types/cms'

const appConfig = useAppConfig()
const cmsStore = useCmsStore()
const { src: logoSrc, alt: logoAlt } = useSiteLogo()
const currentYear = new Date().getFullYear()

const contactEmail = computed(() => appConfig?.contact?.email ?? '')
const contactAddress = computed(() => appConfig?.contact?.address ?? null)

const socials = computed(() =>
  [
    { icon: 'mdi:facebook', label: 'Facebook', url: appConfig?.social?.facebook ?? '' },
    { icon: 'mdi:instagram', label: 'Instagram', url: appConfig?.social?.instagram ?? '' },
    { icon: 'mdi:twitter', label: 'Twitter', url: appConfig?.social?.twitter ?? '' },
  ].filter((s) => s.url)
)

const toFallbackItems = (links: ReadonlyArray<{ name: string; path: string }>): CmsMenuItem[] =>
  links.map((l, i) => ({
    id: -(i + 1),
    label: l.name,
    link_type: 'url',
    url: l.path,
    target: '_self',
    icon: null,
    sort_order: i,
    children: [],
  }))

const footerColumns = computed<{ heading: string; items: CmsMenuItem[] }[]>(() => {
  const menu = cmsStore.footerMenu
  if (menu?.items?.length) {
    const topLevel = menu.items
    const grouped = topLevel.some((i) => i.children?.length)
    if (grouped) {
      return topLevel.map((i) => ({
        heading: i.label,
        items: i.children ?? [],
      }))
    }
    return [{ heading: 'Quick Links', items: topLevel }]
  }
  return [
    { heading: 'Policies', items: toFallbackItems(FOOTER_POLICIES) },
    { heading: 'Information', items: toFallbackItems(FOOTER_INFO) },
  ]
})

const isExternal = (url?: string) => !!url && /^https?:\/\//i.test(url)
</script>

<template>
  <footer class="bg-dark-100 border-t-[3px] border-pif-green-dark">
    <div class="container py-14 md:py-16">
      <!-- The brand and contact columns are wider than the link columns, and
           how many link columns there are is up to whoever edits the footer
           menu — so the track count comes from the data rather than a fixed
           four. -->
      <div
        class="grid gap-10 md:grid-cols-2 md:gap-12 lg:[grid-template-columns:1.3fr_repeat(var(--footer-link-cols),minmax(0,1fr))_1.5fr]"
        :style="{ '--footer-link-cols': footerColumns.length }"
      >
        <div class="flex flex-col gap-6">
          <NuxtLink to="/" class="block w-full max-w-[300px]">
            <img :src="logoSrc" :alt="logoAlt" class="w-full" />
          </NuxtLink>

          <div v-if="socials.length" class="flex gap-2.5">
            <a
              v-for="social in socials"
              :key="social.label"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="social.label"
              class="w-10 h-10 rounded-lg border border-dark-700 bg-dark-300 flex items-center justify-center text-gray-300 hover:border-pif-green-dark hover:bg-pif-green-dark/15 hover:text-white transition-colors"
            >
              <Icon :name="social.icon" class="w-[18px] h-[18px]" />
            </a>
          </div>

          <div class="flex flex-col gap-3 p-5 rounded-xl bg-dark-300 border border-dark-600 max-w-[300px]">
            <h3 class="font-heading text-base tracking-[0.14em] text-pif-gold">Shop Open Time</h3>
            <div
              v-for="slot in SHOP_HOURS"
              :key="slot.days"
              class="flex justify-between gap-4 text-[15px] text-gray-400"
            >
              <span>{{ slot.days }}</span>
              <span class="text-white">{{ slot.time }}</span>
            </div>
          </div>
        </div>

        <div v-for="column in footerColumns" :key="column.heading" class="flex flex-col gap-4">
          <h3 class="font-heading text-base tracking-[0.14em] text-pif-gold">{{ column.heading }}</h3>
          <template v-for="link in column.items" :key="link.id">
            <a
              v-if="isExternal(link.url)"
              :href="link.url"
              :target="link.target && link.target !== '_self' ? link.target : '_blank'"
              rel="noopener noreferrer"
              class="text-[15px] text-gray-400 hover:text-white transition-colors"
            >
              {{ link.label }}
            </a>
            <NuxtLink
              v-else
              :to="link.url"
              class="text-[15px] text-gray-400 hover:text-white transition-colors"
            >
              {{ link.label }}
            </NuxtLink>
          </template>
        </div>

        <div class="flex flex-col gap-4">
          <h3 class="font-heading text-base tracking-[0.14em] text-pif-gold">Contact Us</h3>

          <a
            v-if="contactEmail"
            :href="`mailto:${contactEmail}`"
            class="flex items-center gap-3 text-[15px] text-gray-400 hover:text-white transition-colors break-all"
          >
            <Icon name="heroicons:envelope" class="w-[17px] h-[17px] text-pif-gold shrink-0" />
            {{ contactEmail }}
          </a>

          <div
            v-for="phone in CONTACT_PHONES"
            :key="phone.number"
            class="flex items-center gap-3 flex-wrap"
          >
            <Icon name="heroicons:phone" class="w-[17px] h-[17px] text-pif-gold shrink-0" />
            <a
              :href="telHref(phone.number)"
              class="text-[15px] text-gray-400 hover:text-white transition-colors"
            >
              {{ phone.number }}
            </a>
            <span class="text-[13px] text-gray-500">- {{ phone.hours }}</span>
            <a
              v-if="phone.whatsapp"
              :href="whatsappHref(phone.number)"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="`Message ${phone.number} on WhatsApp`"
              class="w-[22px] h-[22px] rounded-full bg-[#25D366] text-[#0b2c16] flex items-center justify-center hover:opacity-80 transition-opacity shrink-0"
            >
              <Icon name="mdi:whatsapp" class="w-3.5 h-3.5" />
            </a>
          </div>

          <div v-if="contactAddress" class="flex items-start gap-3">
            <Icon name="heroicons:map-pin" class="w-[17px] h-[17px] mt-1 text-pif-gold shrink-0" />
            <address class="text-[15px] leading-relaxed not-italic text-gray-400">
              {{ contactAddress.line1 }}<br />
              {{ contactAddress.city }}, {{ contactAddress.county }}<br />
              {{ contactAddress.postcode }}
            </address>
          </div>
        </div>
      </div>
    </div>

    <div class="border-t border-dark-500">
      <div class="container py-5">
        <p class="text-center text-[13.5px] text-gray-500">
          &copy; {{ currentYear }} 1StopWEB.co.uk. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>
