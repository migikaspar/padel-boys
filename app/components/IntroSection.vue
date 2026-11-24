<script setup lang="ts">
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { team } from '~/data/team'

const root = ref<HTMLElement | null>(null)

const facts = [
  { value: team.length, label: 'Spieler', suffix: '' },
  { value: 90, label: 'Minuten pro Spiel', suffix: '′' },
  { value: 1, label: 'Court in Frenkendorf', suffix: '' },
  { value: 52, label: 'Dienstage im Jahr', suffix: '×' },
]

useGsap(root, () => {
  const split = SplitText.create('.intro-text', { type: 'words', wordsClass: 'intro-w' })
  if (prefersReducedMotion()) return
  gsap.fromTo(
    split.words,
    { opacity: 0.12 },
    {
      opacity: 1,
      stagger: 0.1,
      ease: 'none',
      scrollTrigger: { trigger: '.intro-text', start: 'top 80%', end: 'bottom 45%', scrub: true },
    },
  )
  gsap.utils.toArray<HTMLElement>('.fact-num').forEach((el) => {
    const target = Number(el.dataset.value)
    const obj = { v: 0 }
    gsap.to(obj, {
      v: target,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => (el.textContent = String(Math.round(obj.v))),
    })
  })
  gsap.from('.fact', {
    y: 60,
    opacity: 0,
    stagger: 0.1,
    scrollTrigger: { trigger: '.facts', start: 'top 85%' },
  })
  gsap.to('.intro-ball', {
    yPercent: -120,
    rotation: 220,
    ease: 'none',
    scrollTrigger: { trigger: root.value, start: 'top bottom', end: 'bottom top', scrub: true },
  })
})
</script>

<template>
  <section ref="root" class="relative overflow-hidden bg-pb-black px-4 pb-28 pt-40 md:px-8 md:pb-40 md:pt-56">
    <!-- Ball aus dem Logo -->
    <svg
      class="intro-ball pointer-events-none absolute -right-16 top-1/3 h-64 w-64 text-pb-lime md:-right-20 md:h-96 md:w-96"
      viewBox="181.5 107.5 33 35"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M198.05,135.09c-2.84,2.14-5.53,1.7-7.5.72-1.85-.91-3.31-2.5-4.39-4.37-1.56-2.69-1.94-5.44-1.83-7.79.16-3.35,1.39-6.54,3.43-9.06,4.2-5.19,9.12-5.78,9.99-5.84-.16,0-.31,0-.46,0-8.34,0-15.09,7.18-15.09,16.05s6.75,16.05,15.09,16.05,14.46-6.53,15.04-14.83h0C210.57,119.96,203.73,130.81,198.05,135.09Z" />
      <path d="M200.4,108.91s-7.48.85-11.58,8.14c-1.51,2.68-2.07,5.66-1.51,8.77.32,1.81,1.06,3.79,2.56,5.56,0,0,4.75,5.76,10.25-.46,5.94-6.72,10.6-11.32,12.26-6.76C212.38,116.41,207.17,110,200.4,108.91Z" />
    </svg>
    <div class="relative mx-auto max-w-[1600px]">
      <p class="eyebrow mb-8 text-pb-lime">Wer wir sind</p>
      <p class="intro-text display max-w-6xl text-[13vw] leading-[0.92] text-white md:text-[7.2vw] xl:text-[7rem]">
        Fünf Jungs. Ein Court. Jeden Dienstag. Keine Ausreden – nur Bandejas, Víboras und die Frage, wer das Bier zahlt.
      </p>

      <div class="facts mt-24 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 md:mt-32 md:grid-cols-4">
        <div v-for="f in facts" :key="f.label" class="fact bg-pb-black p-6 md:p-10">
          <p class="display text-7xl text-white md:text-9xl">
            <span class="fact-num" :data-value="f.value">{{ f.value }}</span><span class="text-pb-lime">{{ f.suffix }}</span>
          </p>
          <p class="eyebrow mt-3 text-white/60">{{ f.label }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
