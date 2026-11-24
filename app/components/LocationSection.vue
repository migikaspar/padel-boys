<script setup lang="ts">
import { gsap } from 'gsap'
import { venue } from '~/data/schedule'

const root = ref<HTMLElement | null>(null)
const mapLoaded = ref(false)
const q = encodeURIComponent(venue.full)
const embedUrl = `https://maps.google.com/maps?q=${q}&z=15&output=embed`
const googleUrl = `https://www.google.com/maps/dir/?api=1&destination=${q}`
const appleUrl = `https://maps.apple.com/?daddr=${q}`

useGsap(root, () => {
  if (prefersReducedMotion()) return
  gsap.from('.loc-line', {
    yPercent: 110,
    stagger: 0.08,
    duration: 1.1,
    ease: 'expo.out',
    scrollTrigger: { trigger: root.value, start: 'top 70%' },
  })
  gsap.from('.loc-map', {
    clipPath: 'inset(20% 20% 20% 20% round 24px)',
    duration: 1.4,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.loc-map', start: 'top 85%' },
  })
  gsap.utils.toArray<HTMLElement>('.loc-dot').forEach((d, i) => {
    gsap.to(d, {
      y: -60 - i * 35,
      ease: 'none',
      scrollTrigger: { trigger: root.value, start: 'top bottom', end: 'bottom top', scrub: true },
    })
  })
})
</script>

<template>
  <section id="ort" ref="root" class="relative overflow-hidden bg-pb-black px-4 py-28 md:px-8 md:py-40">
    <div class="relative mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-12 lg:items-center">
      <div class="lg:col-span-5">
        <p class="eyebrow mb-6 text-pb-lime">Unser Court</p>
        <h2 class="display text-[15vw] text-white lg:text-[5.6vw] xl:text-[6.4rem]">
          <span class="block overflow-hidden"><span class="loc-line block">Padel</span></span>
          <span class="block overflow-hidden"><span class="loc-line block text-pb-lime">Frenkendorf</span></span>
        </h2>
        <address class="mt-8 text-2xl not-italic leading-snug text-white/80 md:text-3xl">
          {{ venue.street }}<br />
          {{ venue.zip }} {{ venue.city }}
        </address>
        <dl class="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 text-white">
          <div class="bg-pb-black p-5">
            <dt class="eyebrow text-white/50">Wann</dt>
            <dd class="display mt-1 text-3xl">Di · 18:30</dd>
          </div>
          <div class="bg-pb-black p-5">
            <dt class="eyebrow text-white/50">Dauer</dt>
            <dd class="display mt-1 text-3xl">90 Min</dd>
          </div>
        </dl>
        <div class="mt-8 flex flex-wrap gap-3">
          <a
            :href="googleUrl"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-2 rounded-full bg-pb-lime px-6 py-3 text-base font-bold uppercase tracking-wider text-pb-black transition-transform hover:scale-[1.03]"
          >
            Route planen ↗
          </a>
          <a
            :href="appleUrl"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-base font-bold uppercase tracking-wider text-white transition-colors hover:border-pb-lime hover:text-pb-lime"
          >
            Apple Karten ↗
          </a>
        </div>
      </div>

      <div class="relative lg:col-span-7">
        <span class="loc-dot absolute -left-6 -top-6 z-10 h-14 w-14 rounded-full bg-pb-lime" aria-hidden="true" />
        <span class="loc-dot absolute -bottom-4 right-10 z-10 h-8 w-8 rounded-full bg-white" aria-hidden="true" />
        <span class="loc-dot absolute -right-3 top-1/3 z-10 h-5 w-5 rounded-full bg-pb-lime" aria-hidden="true" />

        <div class="loc-map relative aspect-[4/3] overflow-hidden rounded-3xl bg-pb-navy md:aspect-[16/11]">
          <iframe
            v-if="mapLoaded"
            :src="embedUrl"
            title="Karte: Padel Frenkendorf"
            class="absolute inset-0 h-full w-full border-0 [filter:grayscale(1)_contrast(1.1)]"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          />
          <div v-else class="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div class="dot-bg absolute inset-0 text-white/10" />
            <!-- stilisierter Court -->
            <svg viewBox="0 0 200 100" class="absolute inset-0 m-auto w-[70%] text-white/20" fill="none" stroke="currentColor" stroke-width="1">
              <rect x="1" y="1" width="198" height="98" />
              <line x1="100" y1="1" x2="100" y2="99" stroke-width="2" />
              <line x1="30" y1="1" x2="30" y2="99" />
              <line x1="170" y1="1" x2="170" y2="99" />
              <line x1="30" y1="50" x2="170" y2="50" />
            </svg>
            <div class="relative">
              <span class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-pb-lime text-pb-black shadow-[0_0_0_12px_rgba(218,255,2,.15)]">
                <svg viewBox="0 0 24 24" class="h-7 w-7" fill="currentColor"><path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" /></svg>
              </span>
              <p class="display text-4xl text-white">{{ venue.name }}</p>
              <button
                class="mt-6 rounded-full border border-white/30 bg-pb-black/40 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white backdrop-blur transition hover:border-pb-lime hover:text-pb-lime"
                @click="mapLoaded = true"
              >
                Karte laden
              </button>
              <p class="mx-auto mt-3 max-w-xs text-sm text-white/50">Beim Laden werden Daten an Google Maps übertragen.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
