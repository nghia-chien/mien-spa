import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scrollToSection } from './scroll-to-section'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

/** Lenis at Motion 4; never under reduced motion. Returns a cleanup. */
export function startSmooth(): () => void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
  lenis = new Lenis({ lerp: 0.1 })
  lenis.on('scroll', ScrollTrigger.update)
  const tick = (time: number) => lenis?.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return () => {
    gsap.ticker.remove(tick)
    lenis?.destroy()
    lenis = null
  }
}

export function getLenis(): Lenis | null {
  return lenis
}

/** Every nav / CTA click goes through here (rules-core §5). */
export function goTo(id: string) {
  scrollToSection(id, { lenis: lenis ?? undefined })
}
