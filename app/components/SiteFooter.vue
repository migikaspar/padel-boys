<script setup lang="ts">
import { gsap } from 'gsap'
import { venue } from '~/data/schedule'

const root = ref<HTMLElement | null>(null)
const year = new Date().getFullYear()

useGsap(root, () => {
  if (prefersReducedMotion()) return
  gsap.from('.foot-word', {
    yPercent: 60,
    ease: 'none',
    scrollTrigger: { trigger: root.value, start: 'top bottom', end: 'bottom bottom', scrub: true },
  })
  gsap.from('.foot-logo .pb-dot', {
    scale: 0,
    transformOrigin: '50% 50%',
    stagger: { each: 0.04, from: 'random' },
    duration: 0.8,
    ease: 'back.out(2)',
    scrollTrigger: { trigger: root.value, start: 'top 75%' },
  })
})
</script>

<template>
  <footer ref="root" class="relative overflow-hidden bg-pb-lime px-4 pt-20 text-pb-black md:px-8 md:pt-28">
    <div class="mx-auto grid max-w-[1600px] gap-12 md:grid-cols-12">
      <div class="md:col-span-4">
        <LogoMark class="foot-logo w-40 md:w-52" />
      </div>
      <div class="grid grid-cols-2 gap-8 md:col-span-8 md:grid-cols-3">
        <div>
          <p class="eyebrow mb-3 opacity-60">Spiele</p>
          <p class="text-xl font-semibold leading-snug">Jeden Dienstag<br />18:30 – 20:00</p>
        </div>
        <div>
          <p class="eyebrow mb-3 opacity-60">Ort</p>
          <p class="text-xl font-semibold leading-snug">{{ venue.name }}<br />{{ venue.street }}<br />{{ venue.zip }} {{ venue.city }}</p>
        </div>
        <div>
          <p class="eyebrow mb-3 opacity-60">Navigation</p>
          <ul class="space-y-1 text-xl font-semibold">
            <li><a href="#team" class="hover:underline" @click.prevent="scrollToSection('#team')">Team</a></li>
            <li><a href="#spiele" class="hover:underline" @click.prevent="scrollToSection('#spiele')">Spiele</a></li>
            <li><a href="#ort" class="hover:underline" @click.prevent="scrollToSection('#ort')">Ort</a></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="foot-word display mt-16 select-none whitespace-nowrap text-center text-[25vw] leading-[0.78] md:mt-20" aria-hidden="true">
      Vamos!
    </div>
    <div class="mx-auto flex max-w-[1600px] flex-wrap justify-between gap-2 border-t border-pb-black/20 py-5 text-sm font-semibold uppercase tracking-wider">
      <span>© {{ year }} Padel Boys</span>
      <span>Made with Bandejas in Baselland</span>
    </div>
  </footer>
</template>
