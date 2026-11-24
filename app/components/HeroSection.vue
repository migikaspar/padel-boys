<script setup lang="ts">
import { gsap } from 'gsap'
import { venue } from '~/data/schedule'

const root = ref<HTMLElement | null>(null)

useGsap(root, () => {
  const reduced = prefersReducedMotion()
  const dots = gsap.utils.toArray<SVGCircleElement>('.hero-logo .pb-dot')
  const letters = gsap.utils.toArray<SVGElement>('.hero-logo .pb-letter:not(.pb-ball)')

  // Intro
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
  tl.from(dots, {
    scale: 0,
    transformOrigin: '50% 50%',
    duration: 1.1,
    stagger: { each: 0.05, from: 'center' },
    ease: 'back.out(2.4)',
  })
    .from(letters, { yPercent: 120, opacity: 0, duration: 0.9, stagger: 0.05 }, '-=0.7')
    .from('.hero-logo .pb-ball', { x: 120, rotation: 540, opacity: 0, transformOrigin: '50% 50%', duration: 1.3 }, '<0.2')
    .from('.hero-word', { xPercent: (i) => (i ? 30 : -30), opacity: 0, duration: 1.6, ease: 'power4.out' }, 0.1)
    .from('.hero-meta > *', { y: 30, opacity: 0, duration: 0.8, stagger: 0.08 }, '-=1')

  if (reduced) return

  // Scroll-Parallax: Wörter gegenläufig, Punkte fliegen auseinander
  const scrub = { trigger: root.value, start: 'top top', end: 'bottom top', scrub: true }
  gsap.to('.hero-word-1', { xPercent: -18, ease: 'none', scrollTrigger: scrub })
  gsap.to('.hero-word-2', { xPercent: 14, ease: 'none', scrollTrigger: scrub })
  gsap.to('.hero-logo-wrap', { yPercent: 30, scale: 0.86, ease: 'none', scrollTrigger: scrub })
  gsap.to('.hero-logo .pb-word', { opacity: 0, y: -20, ease: 'none', scrollTrigger: { ...scrub, end: '60% top' } })

  const cx = 141
  const cy = 120
  dots.forEach((d, i) => {
    const dx = Number(d.getAttribute('cx')) - cx
    const dy = Number(d.getAttribute('cy')) - cy
    const f = 2.2 + (i % 4) * 0.9
    gsap.fromTo(d, { x: 0, y: 0, scale: 1 }, {
      immediateRender: false,
      x: dx * f,
      y: dy * f - 80 - (i % 3) * 40,
      scale: 1 + (i % 5) * 0.35,
      transformOrigin: '50% 50%',
      ease: 'none',
      scrollTrigger: scrub,
    })
  })

  gsap.to('.hero-bgdots', { yPercent: 25, ease: 'none', scrollTrigger: scrub })

  // Maus-Parallax
  if (window.matchMedia('(pointer: fine)').matches) {
    const lx = gsap.quickTo('.hero-logo', 'x', { duration: 1.2, ease: 'power3' })
    const ly = gsap.quickTo('.hero-logo', 'y', { duration: 1.2, ease: 'power3' })
    const wx = gsap.quickTo('.hero-words', 'x', { duration: 1.6, ease: 'power3' })
    const wy = gsap.quickTo('.hero-words', 'y', { duration: 1.6, ease: 'power3' })
    const move = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5
      const ny = e.clientY / window.innerHeight - 0.5
      lx(nx * 30)
      ly(ny * 24)
      wx(nx * -50)
      wy(ny * -30)
    }
    root.value!.addEventListener('mousemove', move)
  }
})
</script>

<template>
  <section id="top" ref="root" class="grain relative flex h-[100svh] min-h-[620px] items-center justify-center overflow-hidden bg-pb-navy">
    <!-- Hintergrund-Raster -->
    <div class="hero-bgdots dot-bg pointer-events-none absolute -inset-x-0 -top-[10%] h-[120%] text-white/[0.07] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />

    <!-- Riesige Outline-Wörter -->
    <div class="hero-words pointer-events-none absolute inset-0 flex select-none flex-col justify-center gap-[2vw]" aria-hidden="true">
      <div class="hero-word hero-word-1 display text-outline-lime whitespace-nowrap text-[30vw] opacity-60 md:text-[24vw]">
        Padel Padel Padel
      </div>
      <div class="hero-word hero-word-2 display text-outline -ml-[60vw] whitespace-nowrap text-[30vw] text-white/25 md:text-[24vw]">
        Boys Boys Boys Boys
      </div>
    </div>

    <!-- Logo -->
    <div class="hero-logo-wrap relative z-10">
      <h1 class="hero-logo w-[min(84vw,58vh)] text-pb-lime drop-shadow-[0_30px_60px_rgba(0,0,0,.35)] [&_.pb-ball]:fill-pb-white">
        <LogoMark title="Padel Boys" />
      </h1>
    </div>

    <!-- Meta-Zeile -->
    <div class="hero-meta absolute inset-x-0 bottom-0 z-20 mx-auto flex max-w-[1600px] items-end justify-between gap-4 px-4 pb-20 text-white md:px-8 md:pb-24">
      <p class="leading-none">
        <span class="eyebrow block text-white/80">Jeden Dienstag · {{ venue.name }}</span>
        <span class="display mt-2 block whitespace-nowrap text-[15vw] text-pb-lime sm:text-7xl md:text-8xl">18:30 – 20:00</span>
      </p>
      <button
        class="group mb-2 hidden shrink-0 items-center gap-3 text-right sm:flex"
        aria-label="Zum Team scrollen"
        @click="scrollToSection('#team')"
      >
        <span class="eyebrow text-white/70 group-hover:text-white">Scroll</span>
        <span class="relative flex h-12 w-7 justify-center rounded-full border border-white/40">
          <span class="mt-2 h-2 w-1 animate-bounce rounded-full bg-pb-lime" />
        </span>
      </button>
    </div>
  </section>
</template>
