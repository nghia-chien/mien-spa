import { useRef } from 'react'
import type { ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const BANDS = [
  { name: 'Thân', bg: 'var(--color-clay)', dir: -1 },
  { name: 'Tâm', bg: 'var(--color-amber)', dir: 1 },
  { name: 'Trí', bg: 'var(--color-leaf)', dir: -1 },
] as const

/**
 * Thân · Tâm · Trí curtain (SCR-10 section transition) around a section. Three colour bands cover the top of the
 * section; when it scrolls into view they slide away on a TIMED animation (not pinned, not scrubbed).
 * Scrolling back above closes the curtain. Reduced motion / no JS: no curtain.
 */
export function LayersCurtain({ children, className = '' }: { children: ReactNode; className?: string }) {
  const wrap = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const curtain = wrap.current?.querySelector<HTMLElement>('.lc-curtain')
        if (!curtain) return
        const bands = gsap.utils.toArray<HTMLElement>('.lc-band')
        gsap.set(curtain, { autoAlpha: 1 })
        const tl = gsap.timeline({ paused: true, onComplete: () => { gsap.set(curtain, { autoAlpha: 0 }) } })
        bands.forEach((b, i) => {
          tl.to(b, { xPercent: 102 * BANDS[i].dir, duration: 0.85, ease: 'power3.inOut' }, 0.15 + i * 0.18)
          tl.to(b.querySelector('.lc-word'), { xPercent: -30 * BANDS[i].dir, duration: 0.85, ease: 'power3.inOut' }, 0.15 + i * 0.18)
        })
        ScrollTrigger.create({
          trigger: wrap.current,
          start: 'top 70%',
          // Normal scroll → play the curtain. A jump (nav click, fast fling) that lands past the section's
          // top → open it instantly, so the curtain never sits over content the visitor jumped to.
          onEnter: (self) => {
            const top = wrap.current?.getBoundingClientRect().top ?? 0
            if (top < window.innerHeight * 0.1 || Math.abs(self.getVelocity()) > 2500) tl.progress(1)
            else tl.play()
          },
          onLeaveBack: () => {
            tl.pause(0)
            gsap.set(curtain, { autoAlpha: 1 })
          },
        })
      })
      return () => mm.revert()
    },
    { scope: wrap },
  )

  return (
    <div ref={wrap} className={`relative ${className}`}>
      {children}
      {/* curtain: hidden by default (no-JS / reduced motion), shown only by the motion branch */}
      <div aria-hidden="true" className="lc-curtain pointer-events-none invisible absolute inset-x-0 top-0 z-10 grid h-dvh grid-rows-3 overflow-clip">
        {BANDS.map((b) => (
          <div key={b.name} className="lc-band flex items-center overflow-clip" style={{ background: b.bg }}>
            <span className="lc-word font-display block w-full whitespace-nowrap text-center text-[clamp(4rem,17vh,11rem)] italic leading-none text-[#fff6ea]">
              {b.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
