<script setup lang="ts">
import { gsap } from 'gsap'
import { isInjured, sortFitFirst, team } from '~/data/team'

const root = ref<HTMLElement | null>(null)
const now = useNow(60_000)
const injuredCount = computed(() => team.filter((p) => isInjured(p, now.value)).length)
const players = computed(() => sortFitFirst(team, now.value))

useGsap(root, () => {
  const reduced = prefersReducedMotion()
  const mm = gsap.matchMedia()

  const animateCard = (card: Element, trigger: gsap.DOMTarget, extra: ScrollTrigger.Vars = {}) => {
    const fills = card.querySelectorAll('.stat-fill, .injury-fill')
    gsap.from(fills, {
      scaleX: 0,
      duration: 1.2,
      stagger: 0.07,
      ease: 'power3.out',
      scrollTrigger: { trigger, start: 'top 75%', ...extra },
    })
  }

  // Desktop: Section pinnen, Karten horizontal durchziehen
  mm.add('(min-width: 1024px)', () => {
    const track = root.value!.querySelector<HTMLElement>('.team-track')!
    const distance = () => track.scrollWidth - window.innerWidth
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: '.team-pin',
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    })
    gsap.to('.team-progress', {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { trigger: '.team-pin', start: 'top top', end: () => `+=${distance()}`, scrub: true },
    })
    if (reduced) return
    gsap.utils.toArray<HTMLElement>('.player-card-wrap').forEach((card) => {
      animateCard(card, card, { containerAnimation: tween, start: 'left 85%' })
      gsap.from(card, {
        y: 80,
        rotate: 3,
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 100%', end: 'left 65%', scrub: true },
      })
    })
    gsap.to('.team-bigword', {
      xPercent: -30,
      ease: 'none',
      scrollTrigger: { trigger: '.team-pin', start: 'top top', end: () => `+=${distance()}`, scrub: true },
    })
  })

  // Mobile / Tablet: vertikal
  mm.add('(max-width: 1023px)', () => {
    if (reduced) return
    gsap.utils.toArray<HTMLElement>('.player-card-wrap').forEach((card) => {
      gsap.from(card, { y: 80, opacity: 0, duration: 1, scrollTrigger: { trigger: card, start: 'top 90%' } })
      animateCard(card, card)
    })
  })

  if (!reduced) {
    gsap.from('.team-title-line', {
      yPercent: 110,
      stagger: 0.1,
      duration: 1.1,
      ease: 'expo.out',
      scrollTrigger: { trigger: root.value, start: 'top 70%' },
    })
  }
})
</script>

<template>
  <section id="team" ref="root" class="relative bg-pb-black">
    <div class="team-pin relative overflow-hidden lg:h-screen">
      <!-- Riesiges Hintergrundwort -->
      <div
        class="team-bigword display text-outline pointer-events-none absolute bottom-[-4vw] left-0 hidden select-none whitespace-nowrap text-[26vw] text-white/[0.06] lg:block"
        aria-hidden="true"
      >
        The Squad · The Squad
      </div>

      <div
        class="team-track relative flex flex-col gap-8 px-4 pb-24 pt-28 md:px-8 lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-10 lg:pb-0 lg:pt-16 lg:pl-8 lg:pr-[8vw]"
      >
        <!-- Intro-Panel -->
        <div class="flex shrink-0 flex-col justify-center lg:w-[34vw] lg:max-w-[560px] lg:pr-6">
          <p class="eyebrow mb-6 text-pb-lime">Das Team · {{ team.length }} Spieler</p>
          <h2 class="display text-[22vw] text-white lg:text-[9.5vw] xl:text-[10rem]">
            <span class="block overflow-hidden"><span class="team-title-line block">The</span></span>
            <span class="block overflow-hidden"><span class="team-title-line block text-pb-lime">Squad</span></span>
          </h2>
          <p class="mt-6 max-w-md text-xl leading-snug text-white/70">
            Drive oder Revés, Power oder Köpfchen – jeder bringt etwas anderes auf den Court. Hier sind die Werte, ganz objektiv
            von uns selbst bewertet.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <span class="inline-flex items-center gap-2 rounded-full bg-pb-lime/10 px-4 py-2 text-sm font-bold uppercase tracking-wider text-pb-lime">
              <span class="h-2 w-2 rounded-full bg-pb-lime" /> {{ team.length - injuredCount }} fit
            </span>
            <span
              v-if="injuredCount"
              class="inline-flex items-center gap-2 rounded-full bg-pb-signal/15 px-4 py-2 text-sm font-bold uppercase tracking-wider text-pb-signal"
            >
              <span class="h-2 w-2 rounded-full bg-pb-signal" /> {{ injuredCount }} verletzt
            </span>
          </div>
          <p class="eyebrow mt-10 hidden items-center gap-3 text-white/50 lg:flex">
            Scroll
            <svg viewBox="0 0 40 12" class="h-3 w-10" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 6h38M33 1l5 5-5 5" /></svg>
          </p>
        </div>

        <!-- Karten -->
        <div class="grid gap-6 sm:grid-cols-2 lg:flex lg:gap-8">
          <PlayerCard
            v-for="p in players"
            :key="p.id"
            :player="p"
            :now="now"
            class="lg:w-[min(26vw,400px)] lg:min-w-[340px]"
          />
        </div>
      </div>

      <!-- Fortschritt -->
      <div class="absolute inset-x-8 bottom-8 hidden h-[2px] bg-white/10 lg:block">
        <div class="team-progress h-full origin-left scale-x-0 bg-pb-lime" />
      </div>
    </div>
  </section>
</template>
