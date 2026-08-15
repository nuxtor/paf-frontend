<script setup lang="ts">
import type { CmsHeroSlide } from '~/types/cms'

const cmsStore = useCmsStore()
const { getAssetUrl } = useAsset()
const { cmsImageUrl } = useCms()

const fallbackSlides: CmsHeroSlide[] = [
  {
    id: -1,
    heading: 'Premium halal, delivered to your door',
    subheading:
      'Halal certified meat, poultry and groceries — carefully sourced, hand-cut to order and delivered across the UK.',
    image: getAssetUrl('images/meat-slides-01.jpg'),
    cta_label: 'Shop the range',
    cta_url: '/products',
    sort_order: 0,
  },
  {
    id: -2,
    heading: 'Halal certified, without compromise',
    subheading: 'Every product we sell is certified halal and handled with care.',
    image: getAssetUrl('images/meat-slides-02.jpg'),
    cta_label: 'Learn More',
    cta_url: '/pages/halal-promise',
    sort_order: 1,
  },
  {
    id: -3,
    heading: 'Wholesale pricing, built for your business',
    subheading: 'Trade accounts with tiered pricing for restaurants, shops and caterers.',
    image: getAssetUrl('images/meat-slides-03.jpg'),
    cta_label: 'Apply Now',
    cta_url: '/wholesale',
    sort_order: 2,
  },
  {
    id: -4,
    heading: 'Free delivery, on orders over £100',
    subheading: 'Nationwide, in 24–48 hours, for £5.99 below the threshold.',
    image: getAssetUrl('images/meat-slides-04.jpg'),
    cta_label: 'Start Shopping',
    cta_url: '/products',
    sort_order: 3,
  },
]

const slides = computed(() =>
  cmsStore.heroSlides.length > 0 ? cmsStore.heroSlides : fallbackSlides
)

const resolveImage = (slide: CmsHeroSlide) => {
  if (slide.id < 0) return slide.image
  return cmsImageUrl(slide.image)
}

const resolveMobileImage = (slide: CmsHeroSlide) => {
  if (!slide.mobile_image) return ''
  if (slide.id < 0) return slide.mobile_image
  return cmsImageUrl(slide.mobile_image)
}

// The headline sets on two lines, the second one in gold. A newline in the
// heading is the admin's way of choosing the break; a comma is the fallback so
// headings written before this existed still land the way they read aloud.
const splitHeading = (text?: string) => {
  const source = text ?? ''
  const newline = source.indexOf('\n')
  if (newline !== -1) {
    return { lead: source.slice(0, newline).trim(), accent: source.slice(newline + 1).trim() }
  }
  const comma = source.indexOf(',')
  if (comma !== -1) {
    return { lead: source.slice(0, comma + 1).trim(), accent: source.slice(comma + 1).trim() }
  }
  return { lead: source, accent: '' }
}

const assurances = [
  { icon: 'heroicons:check-circle', label: '100% halal certified' },
  { icon: 'heroicons:truck', label: 'Free delivery over £100' },
  { icon: 'heroicons:shield-check', label: 'Delivered in 24–48 hours' },
]

const currentSlide = ref(0)
let slideInterval: ReturnType<typeof setInterval> | null = null

const current = computed(() => slides.value[currentSlide.value] ?? slides.value[0]!)

const nextSlide = () => {
  if (!slides.value.length) return
  currentSlide.value = (currentSlide.value + 1) % slides.value.length
}

const goToSlide = (index: number) => {
  currentSlide.value = index
  resetInterval()
}

const resetInterval = () => {
  if (slideInterval) clearInterval(slideInterval)
  slideInterval = setInterval(nextSlide, 5000)
}

watch(
  () => slides.value.length,
  (len) => {
    if (currentSlide.value >= len) currentSlide.value = 0
  }
)

onMounted(() => {
  resetInterval()
})

onUnmounted(() => {
  if (slideInterval) clearInterval(slideInterval)
})
</script>

<template>
  <section
    v-if="slides.length"
    class="relative overflow-hidden bg-pif-black min-h-[520px] lg:min-h-[600px] flex items-center"
  >
    <div class="absolute inset-0">
      <TransitionGroup
        enter-active-class="transition-opacity duration-1000 ease-in-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-1000 ease-in-out absolute inset-0"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-for="(slide, index) in slides"
          v-show="currentSlide === index"
          :key="slide.id"
          class="absolute inset-0"
        >
          <picture>
            <source
              v-if="resolveMobileImage(slide)"
              :srcset="resolveMobileImage(slide)"
              media="(max-width: 767px)"
            />
            <img
              :src="resolveImage(slide)"
              :alt="slide.heading"
              class="w-full h-full object-cover object-[50%_40%]"
            />
          </picture>
          <!-- Only when the admin has picked one. The two scrims below are what
               makes the copy readable, so the old rgba(0,0,0,0.4) default would
               now just flatten the picture a second time. -->
          <div
            v-if="slide.overlay_color"
            class="absolute inset-0"
            :style="{ backgroundColor: slide.overlay_color }"
          />
        </div>
      </TransitionGroup>
    </div>

    <div
      class="absolute inset-0 pointer-events-none"
      style="background: linear-gradient(90deg, rgba(0, 0, 0, 0.92) 0%, rgba(0, 0, 0, 0.72) 42%, rgba(0, 0, 0, 0.25) 78%, rgba(0, 0, 0, 0.45) 100%)"
    />
    <div
      class="absolute inset-0 pointer-events-none"
      style="background: linear-gradient(180deg, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0.75) 100%)"
    />

    <div class="container relative w-full">
      <div class="max-w-2xl py-16 md:py-20 lg:py-24" :style="{ color: current.text_color || '#ffffff' }">
        <div class="flex flex-wrap items-center gap-3 mb-6">
          <span
            class="inline-flex items-center px-3.5 py-1.5 rounded-full border border-pif-gold/60 bg-black/40 text-pif-gold text-xs uppercase tracking-[0.18em]"
          >
            100% Halal Certified
          </span>
          <span class="text-sm text-white/70">Delivering nationwide</span>
        </div>

        <Transition
          mode="out-in"
          enter-active-class="transition-opacity duration-500 ease-out"
          enter-from-class="opacity-0"
          leave-active-class="transition-opacity duration-300 ease-in"
          leave-to-class="opacity-0"
        >
          <div :key="current.id">
            <h1 class="font-heading text-5xl md:text-6xl lg:text-7xl leading-[0.98] text-balance mb-5">
              {{ splitHeading(current.heading).lead }}
              <template v-if="splitHeading(current.heading).accent">
                <br />
                <span
                  class="bg-gradient-to-b from-pif-gold-light to-pif-gold bg-clip-text text-transparent"
                >
                  {{ splitHeading(current.heading).accent }}
                </span>
              </template>
            </h1>

            <p v-if="current.subheading" class="text-lg md:text-xl leading-relaxed text-white/80 max-w-xl mb-8">
              {{ current.subheading }}
            </p>

            <div class="flex flex-wrap items-center gap-3.5">
              <NuxtLink
                v-if="current.cta_label && current.cta_url"
                :to="current.cta_url"
                class="inline-flex items-center gap-3 px-7 py-4 rounded-lg bg-gradient-to-b from-pif-gold-light to-pif-gold text-pif-black font-semibold shadow-lg shadow-black/40 hover:brightness-110 transition-[filter]"
              >
                {{ current.cta_label }}
                <Icon name="heroicons:arrow-right" class="w-5 h-5" />
              </NuxtLink>
              <NuxtLink
                to="/wholesale"
                class="inline-flex items-center gap-2 px-6 py-4 rounded-lg border border-white/45 text-white hover:border-pif-green-dark hover:bg-pif-green-dark/20 transition-colors"
              >
                Wholesale enquiries
              </NuxtLink>
            </div>
          </div>
        </Transition>

        <ul class="flex flex-wrap gap-x-10 gap-y-3.5 pt-7 mt-11 border-t border-white/15">
          <li v-for="item in assurances" :key="item.label" class="flex items-center gap-2.5">
            <Icon :name="item.icon" class="w-5 h-5 text-pif-green-dark shrink-0" />
            <span class="text-sm text-white/85">{{ item.label }}</span>
          </li>
        </ul>

        <div v-if="slides.length > 1" class="flex gap-2 mt-10">
          <button
            v-for="(slide, index) in slides"
            :key="slide.id"
            :class="[
              'h-1 w-8 rounded-full transition-colors',
              currentSlide === index ? 'bg-pif-gold' : 'bg-white/30 hover:bg-white/60',
            ]"
            :aria-label="`Go to slide ${index + 1}`"
            @click="goToSlide(index)"
          />
        </div>
      </div>
    </div>
  </section>
</template>
