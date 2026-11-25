<script setup lang="ts">
import { gsap } from 'gsap'
import { isInjured, overall, statLabels, type Player, type PlayerStats } from '~/data/team'

const props = defineProps<{ player: Player; now: number }>()

const injured = computed(() => isInjured(props.player, props.now))
const ovr = computed(() => overall(props.player.stats))
const statEntries = computed(() =>
  (Object.keys(statLabels) as (keyof PlayerStats)[]).map((k) => ({ key: k, label: statLabels[k], value: props.player.stats[k] })),
)

const DAY = 86_400_000
const injury = computed(() => {
  const inj = props.player.injury
  if (!inj || !injured.value) return null
  const since = new Date(`${inj.since}T00:00:00`).getTime()
  const until = new Date(`${inj.until}T23:59:59`)
  const daysLeft = Math.max(0, Math.ceil((until.getTime() - props.now) / DAY))
  const weeks = Math.round(daysLeft / 7)
  const progress = gsap.utils.clamp(0, 1, (props.now - since) / (until.getTime() - since))
  return {
    type: inj.type,
    until: until.toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    left: daysLeft > 13 ? `noch ca. ${weeks} Wochen` : `noch ${daysLeft} ${daysLeft === 1 ? 'Tag' : 'Tage'}`,
    progress,
  }
})

/* Hover-Tilt */
const card = ref<HTMLElement | null>(null)
let rx: gsap.QuickToFunc | undefined
let ry: gsap.QuickToFunc | undefined
onMounted(() => {
  if (!window.matchMedia('(pointer: fine)').matches || prefersReducedMotion()) return
  rx = gsap.quickTo(card.value, 'rotationX', { duration: 0.6, ease: 'power3' })
  ry = gsap.quickTo(card.value, 'rotationY', { duration: 0.6, ease: 'power3' })
})
function onMove(e: MouseEvent) {
  if (!rx || !ry || !card.value) return
  const r = card.value.getBoundingClientRect()
  ry(((e.clientX - r.left) / r.width - 0.5) * 10)
  rx(-((e.clientY - r.top) / r.height - 0.5) * 10)
}
function onLeave() {
  rx?.(0)
  ry?.(0)
}
</script>

<template>
  <div class="player-card-wrap [perspective:1200px]">
    <article
      ref="card"
      class="player-card group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-pb-black will-change-transform [transform-style:preserve-3d]"
      :class="injured ? 'border-pb-signal/40' : 'border-white/10'"
      :aria-label="`${player.firstName} ${player.lastName}${injured ? ', verletzt' : ''}`"
      @mousemove="onMove"
      @mouseleave="onLeave"
    >
      <!-- Foto -->
      <div class="relative aspect-[4/5] overflow-hidden bg-pb-navy lg:aspect-[16/11] short:aspect-auto short:h-[28vh]" :title="player.photo ? undefined : 'Foto folgt'">
        <img
          v-if="player.photo"
          :src="player.photo"
          :alt="`${player.firstName} ${player.lastName}`"
          class="player-photo absolute inset-0 h-full w-full object-cover transition-[filter,transform] duration-700 group-hover:scale-[1.04]"
          :class="injured ? 'grayscale' : 'saturate-[.85] group-hover:saturate-100'"
          :style="{ objectPosition: player.photoPosition ?? '50% 20%' }"
          width="1080"
          height="1350"
          loading="lazy"
          decoding="async"
        />
        <div v-else class="player-photo absolute inset-0" :class="injured && 'grayscale'">
          <div class="dot-bg absolute inset-0 text-white/[0.09]" />
          <span class="display absolute -right-4 top-6 text-[15rem] text-outline-lime leading-none opacity-50 lg:text-[12rem]">{{ player.number }}</span>
          <!-- Silhouette -->
          <svg viewBox="0 0 200 250" class="absolute bottom-0 left-1/2 h-[82%] -translate-x-1/2 text-white/[0.13]" fill="currentColor" aria-hidden="true">
            <circle cx="100" cy="70" r="38" />
            <path d="M20 250 C 20 160, 55 125, 100 125 C 145 125, 180 160, 180 250 Z" />
          </svg>
        </div>

        <div class="absolute inset-0 bg-gradient-to-t from-pb-black via-pb-black/10 to-transparent" />

        <!-- Top-Leiste -->
        <div class="absolute inset-x-0 top-0 flex items-start justify-between p-5">
          <span class="display text-3xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,.5)]">#{{ String(player.number).padStart(2, '0') }}</span>
          <div v-if="!injury" class="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-pb-lime text-pb-black">
            <span class="display text-3xl leading-none">{{ ovr }}</span>
            <span class="text-xs font-bold uppercase tracking-widest">OVR</span>
          </div>
        </div>

        <!-- Verletzt: Schärpe in der Ecke (lässt das Gesicht frei) -->
        <div v-if="injury" class="pointer-events-none absolute right-0 top-0 h-36 w-36 overflow-hidden">
          <div class="absolute right-[-52px] top-[30px] w-[200px] rotate-45 bg-pb-signal py-1.5 text-center shadow-xl">
            <span class="display text-xl tracking-wide text-white">Out</span>
          </div>
        </div>

        <!-- Name -->
        <div class="absolute inset-x-0 bottom-0 p-5">
          <p class="display inline-block -rotate-2 rounded-sm bg-pb-lime px-2.5 pb-0.5 pt-1 text-2xl tracking-wide text-pb-black shadow-lg short:text-xl">„{{ player.nickname }}“</p>
          <h3 class="display mt-2text-5xl text-white xl:text-6xl short:text-4xl">
            {{ player.firstName }}<br /><span class="text-white/60">{{ player.lastName }}</span>
          </h3>
        </div>
      </div>

      <!-- Infos -->
      <div class="flex flex-1 flex-col gap-5 p-5 short:gap-3 short:p-4">
        <div class="flex flex-wrap gap-2">
          <span class="inline-flex items-center gap-2 rounded-full border border-white/15 py-1 pl-1 pr-3 text-sm font-semibold uppercase tracking-wider">
            <span class="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-extrabold text-pb-black">
              {{ player.hand === 'rechts' ? 'R' : 'L' }}
            </span>
            {{ player.hand === 'rechts' ? 'Rechtshänder' : 'Linkshänder' }}
          </span>
          <span class="rounded-full border border-white/15 px-3 py-1 text-sm font-semibold uppercase tracking-wider">{{ player.side }}</span>
          <span class="rounded-full border border-white/15 px-3 py-1 text-sm font-semibold uppercase tracking-wider text-white/70">
            ★ {{ player.signatureShot }}
          </span>
        </div>

        <!-- Status -->
        <div
          v-if="injury"
          class="rounded-2xl border border-pb-signal/40 bg-pb-signal/10 p-4 short:p-3"
          role="status"
        >
          <div class="flex items-center justify-between gap-3">
            <p class="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-pb-signal">
              <span class="h-2 w-2 rounded-full bg-pb-signal" /> Verletzt
            </p>
            <p class="text-sm font-semibold uppercase tracking-wider text-white/70">{{ injury.left }}</p>
          </div>
          <p class="display mt-2 text-3xl text-white short:mt-1 short:text-2xl">{{ injury.type }}</p>
          <p class="mt-1 text-white/70">Comeback voraussichtlich am <strong class="text-white">{{ injury.until }}</strong></p>
          <div class="mt-3 h-[6px] overflow-hidden rounded-full bg-white/10" :aria-label="`Genesung ${Math.round(injury.progress * 100)} %`">
            <div class="injury-fill h-full origin-left rounded-full bg-gradient-to-r from-pb-signal to-pb-lime" :style="{ width: `${injury.progress * 100}%` }" />
          </div>
          <p class="mt-1 text-right text-xs uppercase tracking-widest text-white/50 short:hidden">Genesung {{ Math.round(injury.progress * 100) }} %</p>
        </div>
        <p v-else class="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-pb-lime">
          <span class="h-2 w-2 rounded-full bg-pb-lime shadow-[0_0_12px_var(--color-pb-lime)]" /> Fit & spielbereit
        </p>

        <div class="grid gap-3 lg:grid-cols-2 lg:gap-x-5">
          <StatBar v-for="s in statEntries" :key="s.key" :label="s.label" :value="s.value" :muted="!!injury" />
        </div>
        <p class="mt-auto pt-2 text-xs uppercase tracking-[0.2em] text-white/40 short:hidden">Padel Boy seit {{ player.since }}</p>
      </div>
    </article>
  </div>
</template>
