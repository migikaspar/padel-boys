<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const now = useNow(30_000)
const next = computed(() => nextActiveSession(now.value))
const scrolled = ref(false)
const open = ref(false)
const root = ref<HTMLElement | null>(null)

const links = [
  { href: '#team', label: 'Team' },
  { href: '#spiele', label: 'Spiele' },
  { href: '#ort', label: 'Ort' },
]

function go(href: string) {
  open.value = false
  scrollToSection(href)
}

let st: ScrollTrigger | undefined
onMounted(() => {
  st = ScrollTrigger.create({
    start: 80,
    end: 'max',
    onToggle: (self) => (scrolled.value = self.isActive),
  })
  gsap.from(root.value, { yPercent: -100, opacity: 0, duration: 1, delay: 1.4, ease: 'power4.out' })
})
onBeforeUnmount(() => st?.kill())
</script>

<template>
  <header
    ref="root"
    class="fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500"
    :class="scrolled || open ? 'bg-pb-navy-deep/80 backdrop-blur-xl border-b border-white/10' : 'border-b border-transparent'"
  >
    <div class="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 md:h-24 md:px-8">
      <a href="#top" class="flex items-center gap-3 text-pb-lime" @click.prevent="go('#top')">
        <LogoMark class="h-16 w-16 md:h-[84px] md:w-[84px]" />
        <span class="sr-only">Padel Boys – nach oben</span>
      </a>

      <nav class="hidden items-center gap-10 md:flex" aria-label="Hauptnavigation">
        <a
          v-for="l in links"
          :key="l.href"
          :href="l.href"
          class="group relative text-lg font-semibold uppercase tracking-[0.14em] text-white/80 transition-colors hover:text-white"
          @click.prevent="go(l.href)"
        >
          {{ l.label }}
          <span class="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 bg-pb-lime transition-transform duration-300 group-hover:scale-x-100" />
        </a>
      </nav>

      <div class="flex items-center gap-3">
        <a
          href="#spiele"
          class="hidden items-center gap-2 rounded-full bg-pb-lime px-4 py-2 text-sm font-bold uppercase tracking-wider text-pb-black transition-transform hover:scale-[1.03] sm:inline-flex"
          @click.prevent="go('#spiele')"
        >
          <span class="relative flex h-2 w-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-pb-black/60" />
            <span class="relative inline-flex h-2 w-2 rounded-full bg-pb-black" />
          </span>
          Nächstes Spiel · {{ fmtDay(next.start) }}
        </a>
        <button
          class="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full border border-white/20 md:hidden"
          :aria-expanded="open"
          aria-controls="mobile-nav"
          aria-label="Menü"
          @click="open = !open"
        >
          <span class="h-[2px] w-5 bg-white transition-transform" :class="open && 'translate-y-[4px] rotate-45'" />
          <span class="h-[2px] w-5 bg-white transition-transform" :class="open && '-translate-y-[4px] -rotate-45'" />
        </button>
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition duration-200 ease-in"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <nav v-if="open" id="mobile-nav" class="border-t border-white/10 px-4 pb-8 pt-4 md:hidden" aria-label="Mobile Navigation">
        <a
          v-for="l in links"
          :key="l.href"
          :href="l.href"
          class="display block py-2 text-6xl text-white"
          @click.prevent="go(l.href)"
        >
          {{ l.label }}
        </a>
        <p class="mt-6 text-lg uppercase tracking-wider text-pb-lime">Nächstes Spiel · {{ fmtDay(next.start) }} · 18:30</p>
      </nav>
    </Transition>
  </header>
</template>
