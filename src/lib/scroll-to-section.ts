// DUDI phôi helper v1.0.0 — exact nav-anchor scrolling. Copy to src/lib/ in every phôi.
// Why: a smooth scroll can be interrupted by ScrollTrigger.refresh() (lazy images, fonts) and pinned
// sections shift positions, so a one-shot scrollTo often lands off. This re-measures after each scroll ends
// and corrects (max 3 passes). Works with native scroll; with Lenis pass `lenis`.
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface LenisLike {
  scrollTo: (target: number, opts?: { immediate?: boolean; onComplete?: () => void }) => void
}

function headerHeight(): number {
  return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 0
}

function waitScrollEnd(cb: () => void) {
  let t = window.setTimeout(done, 1200)
  function onScroll() {
    window.clearTimeout(t)
    t = window.setTimeout(done, 150)
  }
  function done() {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('scrollend', done)
    window.clearTimeout(t)
    requestAnimationFrame(() => cb())
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('scrollend', done, { once: true })
}

export function scrollToSection(id: string, opts: { lenis?: LenisLike; updateHash?: boolean } = {}) {
  const el = document.getElementById(id)
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let pass = 0
  const run = () => {
    ScrollTrigger.refresh()
    const delta = el.getBoundingClientRect().top - headerHeight()
    if (Math.abs(delta) <= 1 || pass >= 3) return
    pass += 1
    const top = window.scrollY + delta
    const instant = reduce || pass > 1
    if (opts.lenis) {
      opts.lenis.scrollTo(top, { immediate: instant, onComplete: () => requestAnimationFrame(run) })
    } else {
      window.scrollTo({ top, behavior: instant ? 'auto' : 'smooth' })
      waitScrollEnd(run)
    }
  }
  run()
  if (opts.updateHash !== false) history.replaceState(null, '', `#${id}`)
}

/** Call once after mount: lands a hash deep-link (/#contact) after fonts, images and ScrollTriggers settle. */
export function scrollToHashOnLoad(opts: { lenis?: LenisLike } = {}) {
  const id = decodeURIComponent(location.hash.slice(1))
  if (!id) return
  const go = () => setTimeout(() => scrollToSection(id, { ...opts, updateHash: false }), 300)
  const ready = document.fonts ? document.fonts.ready : Promise.resolve()
  ready.then(() => (document.readyState === 'complete' ? go() : window.addEventListener('load', go, { once: true })))
}
