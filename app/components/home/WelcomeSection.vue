<script setup lang="ts">
const appConfig = useAppConfig()

const videoSrc = computed(() => appConfig?.home?.welcomeVideo || '')
const videoPoster = computed(() => appConfig?.home?.welcomeVideoPoster || undefined)
const hasVideo = computed(() => Boolean(videoSrc.value))

const videoEl = ref<HTMLVideoElement | null>(null)

// Started here rather than with the autoplay attribute so a visitor who has
// asked their system for less motion is not given a looping clip. The controls
// stay either way — anything that loops indefinitely needs a way to stop it.
onMounted(() => {
  if (!videoEl.value) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  videoEl.value.play().catch(() => {
    // Some browsers refuse to autoplay regardless. The poster and controls
    // are still there, so there is nothing to recover from.
  })
})
</script>

<template>
  <section class="section-padding">
    <div class="container">
      <div
        :class="[
          hasVideo
            ? 'grid items-center gap-10 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16'
            : 'max-w-3xl mx-auto text-center',
        ]"
      >
        <div v-if="hasVideo" class="mx-auto w-full max-w-[17rem] lg:max-w-none">
          <div
            class="relative aspect-[9/16] overflow-hidden rounded-2xl bg-gray-100 dark:bg-dark-300 ring-1 ring-pif-gold/40 shadow-xl shadow-black/10 dark:shadow-black/40"
          >
            <video
              ref="videoEl"
              :src="videoSrc"
              :poster="videoPoster"
              class="absolute inset-0 h-full w-full object-cover"
              muted
              loop
              playsinline
              controls
              preload="metadata"
            />
          </div>
        </div>

        <div :class="hasVideo ? 'text-center lg:text-left' : ''">
          <p
            class="text-xs uppercase tracking-[0.25em] text-pif-green dark:text-pif-gold mb-3"
          >
            Welcome to Premium Abrahamic Foods
          </p>

          <h2
            class="font-heading text-3xl md:text-4xl lg:text-5xl text-pif-black dark:text-white text-balance"
          >
            The UK's No.&nbsp;1 Affordable Online Halal Meat One-Stop Shop
          </h2>

          <div
            class="h-[2px] w-24 bg-pif-gold my-5"
            :class="hasVideo ? 'mx-auto lg:mx-0' : 'mx-auto'"
          />

          <p class="text-lg md:text-xl text-pif-green-dark dark:text-pif-gold mb-6">
            Freshness from Farm to Fork
          </p>

          <div class="space-y-4 text-gray-600 dark:text-gray-400">
            <p>
              At Premium Abrahamic Foods, we are dedicated to providing the finest quality halal meat
              and food products to families and businesses across the UK. Our commitment to excellence
              means every product we offer is carefully sourced, certified halal, and handled with the
              utmost care to ensure freshness and quality.
            </p>
            <p>
              Whether you're preparing a family meal or stocking your restaurant, we deliver premium
              products straight to your door with nationwide delivery. Experience the difference that
              quality makes with Premium Abrahamic Foods.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
