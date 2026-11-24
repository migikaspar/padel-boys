<script setup lang="ts">
import { gsap } from 'gsap'
import { isInjured, sortFitFirst, team } from '~/data/team'
import { venue } from '~/data/schedule'

const root = ref<HTMLElement | null>(null)
const now = useNow(1000)
const mounted = ref(false)
onMounted(() => (mounted.value = true))

/* ---------- Countdown ---------- */
const next = computed(() => nextActiveSession(now.value))
const live = computed(() => now.value >= next.value.start.getTime() && now.value < next.value.end.getTime())
const countdown = computed(() => {
  const target = live.value ? next.value.end : next.value.start
  const diff = Math.max(0, target.getTime() - now.value)
  const s = Math.floor(diff / 1000)
  return [
    { v: Math.floor(s / 86400), l: 'Tage' },
    { v: Math.floor((s % 86400) / 3600), l: 'Std' },
    { v: Math.floor((s % 3600) / 60), l: 'Min' },
    { v: s % 60, l: 'Sek' },
  ]
})
const pad2 = (n: number) => String(n).padStart(2, '0')

/* ---------- Kommende Termine ---------- */
const upcoming = computed(() => upcomingSessions(now.value, 6))
const availability = (start: Date) =>
  sortFitFirst(team, start.getTime()).map((p) => ({ p, out: isInjured(p, start.getTime()) }))

/* ---------- Monatskalender ---------- */
const view = ref(new Date(now.value).getFullYear() * 12 + new Date(now.value).getMonth())
const viewDate = computed(() => new Date(Math.floor(view.value / 12), view.value % 12, 1))
const monthLabel = computed(() => viewDate.value.toLocaleDateString('de-CH', { month: 'long', year: 'numeric' }))
const weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
const todayKey = computed(() => isoDate(new Date(now.value)))
const selectedKey = ref<string | null>(null)

const cells = computed(() => {
  const first = viewDate.value
  const offset = (first.getDay() + 6) % 7
  const start = new Date(first.getFullYear(), first.getMonth(), 1 - offset)
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
    const training = isTrainingDay(d) ? sessionFor(d) : null
    return {
      d,
      key: isoDate(d),
      inMonth: d.getMonth() === first.getMonth(),
      training,
      past: training ? training.end.getTime() < now.value : false,
    }
  })
})

const selected = computed(() => {
  const key = selectedKey.value ?? next.value.key
  const [y, m, d] = key.split('-').map(Number)
  return sessionFor(new Date(y!, m! - 1, d!))
})

function shift(delta: number) {
  view.value += delta
  if (!root.value) return
  gsap.fromTo(
    root.value.querySelectorAll('.cal-cell'),
    { opacity: 0, x: delta * 16 },
    { opacity: 1, x: 0, duration: 0.45, stagger: 0.008, ease: 'power2.out' },
  )
}

const gcal = computed(() => googleCalendarUrl(now.value))

useGsap(root, () => {
  if (prefersReducedMotion()) return
  gsap.from('.sched-title-line', {
    yPercent: 110,
    stagger: 0.1,
    duration: 1.1,
    ease: 'expo.out',
    scrollTrigger: { trigger: root.value, start: 'top 70%' },
  })
  gsap.from('.sched-block', {
    y: 70,
    opacity: 0,
    stagger: 0.12,
    duration: 1,
    scrollTrigger: { trigger: '.sched-grid', start: 'top 80%' },
  })
  gsap.to('.sched-bgnum', {
    yPercent: -30,
    ease: 'none',
    scrollTrigger: { trigger: root.value, start: 'top bottom', end: 'bottom top', scrub: true },
  })
})
</script>

<template>
  <section id="training" ref="root" class="relative overflow-hidden bg-pb-navy px-4 py-28 md:px-8 md:py-40">
    <div
      class="sched-bgnum display text-outline pointer-events-none absolute -right-[4vw] top-10 select-none text-[38vw] leading-none text-white/[0.05]"
      aria-hidden="true"
    >
      18:30
    </div>

    <div class="relative mx-auto max-w-[1600px]">
      <div class="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <p class="eyebrow mb-6 text-pb-lime">Spielplan</p>
          <h2 class="display text-[20vw] text-white md:text-[10vw] xl:text-[10rem]">
            <span class="block overflow-hidden"><span class="sched-title-line block">Jeden</span></span>
            <span class="block overflow-hidden"><span class="sched-title-line block text-pb-lime">Dienstag</span></span>
          </h2>
        </div>
        <div class="max-w-sm text-xl text-white/70">
          <p class="display text-5xl text-white">18:30 – 20:00</p>
          <p class="mt-2">{{ venue.name }}, {{ venue.street }}, {{ venue.zip }} {{ venue.city }}</p>
        </div>
      </div>

      <div class="sched-grid mt-16 grid gap-6 lg:grid-cols-12">
        <!-- Countdown -->
        <div class="sched-block flex flex-col rounded-3xl bg-pb-lime p-6 text-pb-black md:p-10 lg:col-span-5">
          <div class="flex items-center justify-between">
            <p class="eyebrow">{{ live ? 'Gerade am Spielen' : 'Nächstes Spiel' }}</p>
            <span v-if="live" class="inline-flex items-center gap-2 rounded-full bg-pb-black px-3 py-1 text-sm font-bold uppercase text-pb-lime">
              <span class="h-2 w-2 animate-pulse rounded-full bg-pb-lime" /> Live
            </span>
          </div>
          <p class="display mt-4 text-5xl md:text-6xl">{{ fmtLong(next.start) }}</p>
          <p class="mt-1 text-xl font-semibold">{{ fmtTime(next.start) }} – {{ fmtTime(next.end) }} Uhr · {{ venue.name }}</p>

          <p v-if="live" class="eyebrow mt-8">Restzeit auf dem Court</p>
          <div class="mt-3 grid grid-cols-4 gap-2 md:gap-3" :aria-label="live ? 'Restzeit des laufenden Spiels' : 'Countdown bis zum nächsten Spiel'" role="timer">
            <div v-for="c in countdown" :key="c.l" class="rounded-2xl bg-pb-black/[0.07] px-2 py-4 text-center">
              <p class="display text-5xl tabular-nums md:text-7xl">
                <ClientOnly fallback="--">{{ pad2(c.v) }}</ClientOnly>
              </p>
              <p class="eyebrow mt-1 text-[0.65rem]">{{ c.l }}</p>
            </div>
          </div>

          <div class="mt-auto flex flex-wrap gap-3 pt-8">
            <button
              class="inline-flex items-center gap-2 rounded-full bg-pb-black px-5 py-3 text-base font-bold uppercase tracking-wider text-white transition-transform hover:scale-[1.03]"
              @click="downloadIcs"
            >
              <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>
              Kalender (.ics)
            </button>
            <a
              :href="gcal"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-2 rounded-full border-2 border-pb-black px-5 py-3 text-base font-bold uppercase tracking-wider transition-colors hover:bg-pb-black hover:text-pb-lime"
            >
              Google Kalender ↗
            </a>
          </div>
        </div>

        <!-- Monatskalender -->
        <div class="sched-block rounded-3xl border border-white/10 bg-pb-navy-deep/60 p-5 md:p-8 lg:col-span-7">
          <div class="flex items-center justify-between">
            <p class="display text-4xl capitalize text-white md:text-5xl">{{ monthLabel }}</p>
            <div class="flex gap-2">
              <button class="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-pb-lime hover:text-pb-lime" aria-label="Vorheriger Monat" @click="shift(-1)">←</button>
              <button class="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-pb-lime hover:text-pb-lime" aria-label="Nächster Monat" @click="shift(1)">→</button>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-7 gap-1 md:gap-2">
            <div
              v-for="w in weekdays"
              :key="w"
              class="eyebrow pb-2 text-center text-[0.7rem]"
              :class="w === 'Di' ? 'text-pb-lime' : 'text-white/40'"
            >
              {{ w }}
            </div>
            <component
              :is="c.training ? 'button' : 'div'"
              v-for="c in cells"
              :key="c.key"
              class="cal-cell relative flex aspect-square md:aspect-[16/10] flex-col items-center justify-center rounded-xl text-lg font-semibold transition md:text-2xl"
              :class="[
                !c.inMonth && 'opacity-30',
                c.training && !c.training.cancelled && !c.past && 'bg-pb-lime text-pb-black hover:scale-105',
                c.training && !c.training.cancelled && c.past && 'bg-white/10 text-white/50',
                c.training?.cancelled && 'bg-[repeating-linear-gradient(135deg,transparent_0_6px,rgba(255,77,61,.25)_6px_8px)] text-pb-signal line-through',
                !c.training && 'text-white/60',
                mounted && c.key === todayKey && 'ring-2 ring-white ring-offset-2 ring-offset-pb-navy',
                c.training && selected.key === c.key && 'outline outline-2 outline-offset-2 outline-pb-lime',
              ]"
              :aria-label="c.training ? `${fmtLong(c.d)}${c.training.cancelled ? ', fällt aus: ' + c.training.cancelled : ', Training 18:30'}` : undefined"
              @click="c.training && (selectedKey = c.key)"
            >
              <span class="display">{{ c.d.getDate() }}</span>
              <span v-if="c.training && !c.training.cancelled" class="hidden text-[0.6rem] font-bold uppercase tracking-wider md:block">18:30</span>
            </component>
          </div>

          <!-- Detail -->
          <div class="mt-6 flex flex-col gap-4 rounded-2xl bg-white/5 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p class="eyebrow text-white/50">Ausgewählt</p>
              <p class="display mt-1 text-3xl text-white">{{ fmtLong(selected.start) }}</p>
              <p v-if="selected.cancelled" class="font-semibold uppercase tracking-wider text-pb-signal">Fällt aus · {{ selected.cancelled }}</p>
              <p v-else class="text-white/70">18:30 – 20:00 · {{ venue.name }}</p>
            </div>
            <div v-if="!selected.cancelled" class="flex -space-x-2">
              <span
                v-for="a in availability(selected.start)"
                :key="a.p.id"
                class="relative flex h-11 w-11 items-center justify-center rounded-full border-2 border-pb-navy-deep text-sm font-extrabold"
                :class="a.out ? 'bg-pb-signal/30 text-white/60' : 'bg-pb-lime text-pb-black'"
                :title="`${a.p.firstName}${a.out ? ' – verletzt' : ''}`"
              >
                {{ a.p.firstName[0] }}{{ a.p.lastName[0] }}
                <span v-if="a.out" class="absolute inset-0 m-auto h-[2px] w-8 rotate-45 bg-pb-signal" />
              </span>
            </div>
          </div>

          <div class="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm uppercase tracking-wider text-white/50">
            <span class="flex items-center gap-2"><span class="h-3 w-3 rounded bg-pb-lime" /> Training</span>
            <span class="flex items-center gap-2"><span class="h-3 w-3 rounded bg-white/15" /> Gespielt</span>
            <span class="flex items-center gap-2"><span class="h-3 w-3 rounded bg-pb-signal/50" /> Fällt aus</span>
            <span class="flex items-center gap-2"><span class="h-3 w-3 rounded ring-2 ring-white" /> Heute</span>
          </div>
        </div>

        <!-- Nächste Termine -->
        <div class="sched-block lg:col-span-12">
          <p class="eyebrow mb-4 text-white/50">Die nächsten Termine</p>
          <ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <li
              v-for="(s, i) in upcoming"
              :key="s.key"
              class="group relative overflow-hidden rounded-2xl border p-5 transition"
              :class="s.cancelled ? 'border-pb-signal/30 bg-pb-signal/5' : i === 0 ? 'border-pb-lime bg-pb-lime/10' : 'border-white/10 hover:border-white/30'"
            >
              <p class="eyebrow text-[0.7rem]" :class="s.cancelled ? 'text-pb-signal' : 'text-pb-lime'">
                {{ s.cancelled ? 'Fällt aus' : i === 0 ? 'Next up' : `In ${Math.round((s.start.getTime() - upcoming[0]!.start.getTime()) / 604800000)} Wo.` }}
              </p>
              <p class="display mt-2 text-4xl" :class="s.cancelled ? 'text-white/40 line-through' : 'text-white'">
                {{ s.start.toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit' }) }}
              </p>
              <p class="text-white/60">{{ s.cancelled ?? 'Di · 18:30 – 20:00' }}</p>
              <p v-if="!s.cancelled" class="mt-3 text-sm uppercase tracking-wider text-white/50">
                {{ availability(s.start).filter((a) => !a.out).length }}/{{ team.length }} verfügbar
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
