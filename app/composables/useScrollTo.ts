import { gsap } from 'gsap'
import { ScrollSmoother } from 'gsap/ScrollSmoother'

export function scrollToSection(selector: string) {
  const el = document.querySelector<HTMLElement>(selector)
  if (!el) return
  const smoother = ScrollSmoother.get()
  if (smoother) smoother.scrollTo(el, true, 'top top')
  else gsap.to(window, { scrollTo: { y: el, autoKill: true }, duration: 1.1, ease: 'power3.inOut' })
  history.replaceState(null, '', selector)
}
