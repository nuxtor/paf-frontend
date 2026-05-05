<script setup lang="ts">
import { FOOTER_POLICIES, FOOTER_INFO } from '~/utils/constants'

const appConfig = useAppConfig()
const { getAssetUrl } = useAsset()
const currentYear = new Date().getFullYear()

// Safe computed properties for SSR
const contactEmail = computed(() => appConfig?.contact?.email ?? '')
const contactPhone = computed(() => appConfig?.contact?.phone ?? '')
const socialFacebook = computed(() => appConfig?.social?.facebook ?? '')
const socialInstagram = computed(() => appConfig?.social?.instagram ?? '')
const socialTwitter = computed(() => appConfig?.social?.twitter ?? '')
</script>

<template>
  <footer class="bg-pif-cream dark:bg-dark-100 border-t border-gray-200 dark:border-dark-600">
    <div class="container py-8 md:py-12 lg:py-16">
      <!-- Brand Section - Mobile First -->
      <div class="text-center mb-8 md:hidden">
        <NuxtLink to="/" class="inline-block mb-3">
          <img
            :src="getAssetUrl('images/paf-logo-main.png')"
            alt="Premium Abrahimic Foods"
            class="h-10 mx-auto dark:brightness-110"
          />
        </NuxtLink>
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest">
          The Premium Halal Food
        </p>
        <!-- Social Links Mobile -->
        <div class="flex justify-center gap-3 mt-4">
          <a
            v-if="socialFacebook"
            :href="socialFacebook"
            target="_blank"
            rel="noopener noreferrer"
            class="p-2 bg-white dark:bg-dark-300 rounded-lg text-gray-600 dark:text-gray-400 hover:text-pif-green-dark dark:hover:text-pif-gold hover:shadow-md transition-all"
          >
            <Icon name="mdi:facebook" class="w-5 h-5" />
          </a>
          <a
            v-if="socialInstagram"
            :href="socialInstagram"
            target="_blank"
            rel="noopener noreferrer"
            class="p-2 bg-white dark:bg-dark-300 rounded-lg text-gray-600 dark:text-gray-400 hover:text-pif-green-dark dark:hover:text-pif-gold hover:shadow-md transition-all"
          >
            <Icon name="mdi:instagram" class="w-5 h-5" />
          </a>
          <a
            v-if="socialTwitter"
            :href="socialTwitter"
            target="_blank"
            rel="noopener noreferrer"
            class="p-2 bg-white dark:bg-dark-300 rounded-lg text-gray-600 dark:text-gray-400 hover:text-pif-green-dark dark:hover:text-pif-gold hover:shadow-md transition-all"
          >
            <Icon name="mdi:twitter" class="w-5 h-5" />
          </a>
        </div>
      </div>

      <!-- Links Grid -->
      <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        <!-- Policies -->
        <div class="text-center md:text-left">
          <h4 class="font-heading text-base md:text-lg text-pif-black dark:text-white mb-3 md:mb-4">Policies</h4>
          <ul class="space-y-2">
            <li v-for="link in FOOTER_POLICIES" :key="link.path">
              <NuxtLink
                :to="link.path"
                class="text-sm md:text-base text-gray-600 dark:text-gray-400 hover:text-pif-green-dark dark:hover:text-pif-gold transition-colors"
              >
                {{ link.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Information -->
        <div class="text-center md:text-left">
          <h4 class="font-heading text-base md:text-lg text-pif-black dark:text-white mb-3 md:mb-4">Information</h4>
          <ul class="space-y-2">
            <li v-for="link in FOOTER_INFO" :key="link.path">
              <NuxtLink
                :to="link.path"
                class="text-sm md:text-base text-gray-600 dark:text-gray-400 hover:text-pif-green-dark dark:hover:text-pif-gold transition-colors"
              >
                {{ link.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="col-span-2 md:col-span-1 text-center md:text-left mt-4 md:mt-0">
          <h4 class="font-heading text-base md:text-lg text-pif-black dark:text-white mb-3 md:mb-4">Contact Us</h4>
          <ul class="space-y-2 text-gray-600 dark:text-gray-400">
            <li v-if="contactEmail" class="flex items-center justify-center md:justify-start gap-2">
              <Icon name="heroicons:envelope" class="w-4 h-4 md:w-5 md:h-5 text-pif-green dark:text-pif-gold flex-shrink-0" />
              <a
                :href="`mailto:${contactEmail}`"
                class="text-sm md:text-base hover:text-pif-green-dark dark:hover:text-pif-gold transition-colors break-all"
              >
                {{ contactEmail }}
              </a>
            </li>
            <li v-if="contactPhone" class="flex items-center justify-center md:justify-start gap-2">
              <Icon name="heroicons:phone" class="w-4 h-4 md:w-5 md:h-5 text-pif-green dark:text-pif-gold flex-shrink-0" />
              <a
                :href="`tel:${contactPhone}`"
                class="text-sm md:text-base hover:text-pif-green-dark dark:hover:text-pif-gold transition-colors"
              >
                {{ contactPhone }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Brand - Desktop Only -->
        <div class="hidden md:block lg:text-right">
          <NuxtLink to="/" class="inline-block mb-4">
            <img
              :src="getAssetUrl('images/paf-logo-main.png')"
              alt="Premium Abrahimic Foods"
              class="h-12 dark:brightness-110"
            />
          </NuxtLink>
          <p class="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest">
            The Premium Halal Food
          </p>
          <!-- Social Links Desktop -->
          <div class="flex gap-3 mt-4 lg:justify-end">
            <a
              v-if="socialFacebook"
              :href="socialFacebook"
              target="_blank"
              rel="noopener noreferrer"
              class="p-2 bg-white dark:bg-dark-300 rounded-lg text-gray-600 dark:text-gray-400 hover:text-pif-green-dark dark:hover:text-pif-gold hover:shadow-md transition-all"
            >
              <Icon name="mdi:facebook" class="w-5 h-5" />
            </a>
            <a
              v-if="socialInstagram"
              :href="socialInstagram"
              target="_blank"
              rel="noopener noreferrer"
              class="p-2 bg-white dark:bg-dark-300 rounded-lg text-gray-600 dark:text-gray-400 hover:text-pif-green-dark dark:hover:text-pif-gold hover:shadow-md transition-all"
            >
              <Icon name="mdi:instagram" class="w-5 h-5" />
            </a>
            <a
              v-if="socialTwitter"
              :href="socialTwitter"
              target="_blank"
              rel="noopener noreferrer"
              class="p-2 bg-white dark:bg-dark-300 rounded-lg text-gray-600 dark:text-gray-400 hover:text-pif-green-dark dark:hover:text-pif-gold hover:shadow-md transition-all"
            >
              <Icon name="mdi:twitter" class="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Copyright -->
    <div class="border-t border-gray-200 dark:border-dark-600">
      <div class="container py-4">
        <p class="text-center text-xs md:text-sm text-gray-500 dark:text-gray-400">
          &copy; {{ currentYear }} 1StopWEB.co.uk. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>
