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
    <div class="intro-ball pointer-events-none absolute -right-20 top-1/3 h-64 w-64 rounded-full bg-pb-lime/90 blur-[2px] md:h-96 md:w-96" aria-hidden="true">
      <svg viewBox="0 0 100 100" class="h-full w-full text-pb-black/25" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M18 14 C 45 30, 45 70, 18 86" />
        <path d="M82 14 C 55 30, 55 70, 82 86" />
      </svg>
    </div>
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
