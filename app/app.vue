<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'

const config = useRuntimeConfig()
const typekitId = config.public.typekitId as string

useHead({
  link: typekitId ? [{ rel: 'stylesheet', href: `https://use.typekit.net/${typekitId}.css` }] : [],
})

let smoother: ScrollSmoother | undefined

onMounted(() => {
  const fine = window.matchMedia('(pointer: fine)').matches
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (fine && !reduced) {
    smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.1,
      effects: true,
      normalizeScroll: false,
    })
  }
  document.fonts?.ready.then(() => ScrollTrigger.refresh())
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true })
})

onBeforeUnmount(() => {
  smoother?.kill()
  gsap.killTweensOf(window)
})
</script>

<template>
  <div>
    <SiteHeader />
    <div id="smooth-wrapper">
      <div id="smooth-content">
        <main>
          <HeroSection />
          <MarqueeBand />
          <IntroSection />
          <TeamSection />
          <ScheduleSection />
          <LocationSection />
        </main>
        <SiteFooter />
      </div>
    </div>
  </div>
</template>
