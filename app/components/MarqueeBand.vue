<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const props = withDefaults(defineProps<{ words?: string[]; tone?: 'lime' | 'navy' }>(), {
  words: () => ['Bandeja', 'Víbora', 'Chiquita', 'Por Tres', 'Globo', 'Bajada', 'Vamos', 'Dienstag 18:30'],
  tone: 'lime',
})
const root = ref<HTMLElement | null>(null)

useGsap(root, () => {
  if (prefersReducedMotion()) return
  const loop = gsap.to('.marquee-track', { xPercent: -50, ease: 'none', duration: 28, repeat: -1 })
  let dir = 1
  ScrollTrigger.create({
    trigger: root.value,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate(self) {
      const v = self.getVelocity()
      if (self.direction !== dir) {
        dir = self.direction
      }
      const speed = gsap.utils.clamp(1, 6, Math.abs(v) / 300)
      gsap.to(loop, { timeScale: speed * dir, duration: 0.2, overwrite: true })
      gsap.to(loop, { timeScale: dir, duration: 1.2, delay: 0.25, overwrite: false })
    },
  })
})
</script>

<template>
  <div
    ref="root"
    class="relative z-20 -my-6 overflow-hidden py-5 md:-my-8 md:py-7"
    :class="props.tone === 'lime' ? 'bg-pb-lime text-pb-black -rotate-2' : 'bg-pb-navy text-white rotate-1'"
    aria-hidden="true"
  >
    <div class="marquee-track flex w-max whitespace-nowrap">
      <div v-for="n in 2" :key="n" class="flex shrink-0 items-center">
        <span v-for="w in props.words" :key="w + n" class="display flex items-center text-5xl md:text-7xl">
          <span class="px-6 md:px-10">{{ w }}</span>
          <svg viewBox="0 0 20 20" class="h-4 w-4 md:h-6 md:w-6" fill="currentColor"><circle cx="10" cy="10" r="10" /></svg>
        </span>
      </div>
    </div>
  </div>
</template>
