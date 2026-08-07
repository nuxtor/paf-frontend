<script setup lang="ts">
// Static quality assurances shown on every product detail page.
const assurances = ['grass-fed', 'fresh', 'free-range', 'halal', 'no-hormones'] as const

const labels: Record<(typeof assurances)[number], string> = {
  'grass-fed': 'Grass Fed',
  fresh: 'Fresh',
  'free-range': 'Free-Range',
  halal: 'Halal',
  'no-hormones': 'No hormones',
}
</script>

<template>
  <div class="grid grid-cols-5 gap-1.5 sm:gap-3">
    <div v-for="key in assurances" :key="key" class="flex flex-col items-center text-center">
      <div
        class="flex items-center justify-center rounded-full bg-pif-green-dark ring-2 ring-pif-gold/70 dark:ring-pif-gold shadow-sm w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16"
      >
        <svg
          viewBox="0 0 24 24"
          class="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <!-- Grass Fed: tuft of grass blades -->
          <g v-if="key === 'grass-fed'">
            <path d="M12 21C12 16 12 11 12 5.5" />
            <path d="M12 21C11 16.5 9.5 13 7.5 9.5" />
            <path d="M12 21C13 16.5 14.5 13 16.5 9.5" />
            <path d="M12 21C10 17.5 7 14.8 3.8 13.2" />
            <path d="M12 21C14 17.5 17 14.8 20.2 13.2" />
          </g>

          <!-- Fresh: leaf with midrib -->
          <g v-else-if="key === 'fresh'">
            <path d="M4 20C4 10.5 10.5 4 20 4C20 13.5 13.5 20 4 20Z" />
            <path d="M4.5 19.5C8 15.5 12 12.5 17.5 10.5" />
          </g>

          <!-- Free-Range: FR quality seal -->
          <g v-else-if="key === 'free-range'">
            <path
              d="M12.00 1.00 L13.79 2.98 L16.21 1.84 L17.11 4.35 L19.78 4.22 L19.65 6.89 L22.16 7.79 L21.02 10.21 L23.00 12.00 L21.02 13.79 L22.16 16.21 L19.65 17.11 L19.78 19.78 L17.11 19.65 L16.21 22.16 L13.79 21.02 L12.00 23.00 L10.21 21.02 L7.79 22.16 L6.89 19.65 L4.22 19.78 L4.35 17.11 L1.84 16.21 L2.98 13.79 L1.00 12.00 L2.98 10.21 L1.84 7.79 L4.35 6.89 L4.22 4.22 L6.89 4.35 L7.79 1.84 L10.21 2.98 Z"
              stroke-width="1.3"
              stroke-linejoin="round"
            />
            <text
              x="12"
              y="12"
              text-anchor="middle"
              dominant-baseline="central"
              font-size="8.5"
              font-weight="700"
              font-family="Inter, sans-serif"
              fill="currentColor"
              stroke="none"
            >
              FR
            </text>
          </g>

          <!-- Halal: Arabic حلال -->
          <text
            v-else-if="key === 'halal'"
            x="12"
            y="13"
            text-anchor="middle"
            dominant-baseline="central"
            font-size="11"
            font-family="'Noto Naskh Arabic', 'Amiri', 'Traditional Arabic', serif"
            fill="currentColor"
            stroke="none"
          >
            حلال
          </text>

          <!-- No hormones: syringe, crossed out -->
          <g v-else>
            <path d="M3.5 20.5 L7 17" />
            <path d="M8.41 18.41 L5.59 15.59 L13.09 8.09 L15.91 10.91 Z" stroke-linejoin="round" />
            <path d="M12.73 7.73 L16.27 11.27" />
            <path d="M14.5 9.5 L17.5 6.5" />
            <path d="M16.09 5.09 L18.91 7.91" />
            <path d="M4.6 5.1 L19.4 19.9" stroke-width="2.4" />
          </g>
        </svg>
      </div>

      <p class="mt-2 text-[10px] sm:text-xs font-medium leading-tight text-pif-black dark:text-gray-200">
        {{ labels[key] }}
      </p>
    </div>
  </div>
</template>
