import { gsap } from 'gsap'
import type { Ref } from 'vue'

/**
 * Erstellt einen gsap.context, der beim Unmount sauber zurückgesetzt wird.
 * Läuft einen Tick nach onMounted, damit der ScrollSmoother (in app.vue) zuerst existiert.
 */
export function useGsap(root: Ref<HTMLElement | null>, setup: (ctx: gsap.Context) => void) {
  let ctx: gsap.Context | undefined
  onMounted(() => {
    nextTick(() => {
      if (!root.value) return
      ctx = gsap.context((self) => setup(self), root.value)
    })
  })
  onBeforeUnmount(() => ctx?.revert())
}

export const prefersReducedMotion = () =>
  import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches
