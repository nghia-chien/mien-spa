import { useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { combo, primaryCta } from '../data/site'
import { Cta } from './ui/Cta'

gsap.registerPlugin(ScrollTrigger)

type Pt = { x: number; y: number }
/** Step anchor points on the stage, in %. Offer text = top-right (x 62–100, y 4–~45); photo = bottom-left (x 0–26, y 56–96). */
const PTS: Pt[] = [
  { x: 8, y: 22 },
  { x: 33, y: 44 },
  { x: 37, y: 80 },
  { x: 92, y: 66 },
]
/** Bezier controls between consecutive points (%), shaped so each step's text sits in a free quadrant:
 *  0–2 have their text ABOVE the dot (line passes under), 3 has its text LEFT of the dot (line arrives from below). */
const CTRL: [Pt, Pt][] = [
  [{ x: 17, y: 23 }, { x: 24, y: 44 }],
  [{ x: 42, y: 50 }, { x: 25, y: 80 }],
  [{ x: 58, y: 80 }, { x: 94, y: 100 }],
]
const bez = (a: number, b: number, c: number, d: number, t: number) =>
  (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t ** 2 * c + t ** 3 * d

/**
 * Combo Chuyên Sâu — desktop: a sticky stage (pin/scrub). Offer text sits top-right; one large photo sits
 * bottom-left and changes at each stage; the four steps sit along a winding path whose amber stroke draws
 * with scroll. The path is built in pixels from the stage size, so dots, curve and dash fill always align.
 * Mobile / reduced motion: offer, photo, then a plain vertical list.
 * Section transition (timed): the dark section opens from an inset rounded card to full bleed.
 */
export function ComboPath() {
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })

  useLayoutEffect(() => {
    const el = stage.current
    if (!el) return
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const { w, h } = size
  const px = (p: Pt) => `${(p.x / 100) * w},${(p.y / 100) * h}`
  const d = w ? `M${px(PTS[0])}` + CTRL.map(([c1, c2], i) => ` C${px(c1)} ${px(c2)} ${px(PTS[i + 1])}`).join('') : ''

  // where each step sits along the path (0–1), measured in screen pixels
  const fractions = (() => {
    if (!w) return PTS.map((_, i) => i / (PTS.length - 1))
    const lens = CTRL.map(([c1, c2], i) => {
      const a = PTS[i], z = PTS[i + 1]
      let len = 0, prev = a
      for (let s = 1; s <= 40; s++) {
        const t = s / 40
        const p = { x: bez(a.x, c1.x, c2.x, z.x, t), y: bez(a.y, c1.y, c2.y, z.y, t) }
        len += Math.hypot(((p.x - prev.x) / 100) * w, ((p.y - prev.y) / 100) * h)
        prev = p
      }
      return len
    })
    const total = lens.reduce((s, l) => s + l, 0)
    let acc = 0
    return [0, ...lens.map((l) => (acc += l) / total)]
  })()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          root.current,
          { clipPath: 'inset(0% 3% 0% 3% round 2rem)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 0rem)',
            duration: 0.9,
            ease: 'power3.inOut',
            scrollTrigger: { trigger: root.current, start: 'top 85%', toggleActions: 'play none none reverse' },
            onComplete: () => { root.current?.style.removeProperty('clip-path') },
          },
        )
      })
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const fill = root.current?.querySelector<SVGPathElement>('.cp-fill')
        if (!fill || !w) return
        const steps = gsap.utils.toArray<HTMLElement>('.cp-step')
        const dots = gsap.utils.toArray<HTMLElement>('.cp-ddot')
        const imgs = gsap.utils.toArray<HTMLElement>('.cp-img')
        const L = fill.getTotalLength()
        gsap.set(fill, { strokeDasharray: L, strokeDashoffset: L })
        gsap.set(steps.slice(1), { opacity: 0.35 })
        gsap.set(dots.slice(1), { backgroundColor: 'transparent' })
        gsap.set(imgs.slice(1), { clipPath: 'inset(100% 0% 0% 0%)' })
        const T = 3
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.5 },
        })
        tl.to(fill, { strokeDashoffset: 0, duration: T }, 0)
        for (let i = 1; i < PTS.length; i++) {
          const at = Math.max(0, fractions[i] * T - 0.1)
          tl.to(steps[i], { opacity: 1, duration: 0.2 }, at)
          tl.to(steps[i - 1], { opacity: 0.55, duration: 0.2 }, at)
          tl.to(dots[i], { backgroundColor: 'var(--color-amber)', duration: 0.1 }, at)
          tl.to(imgs[i], { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.35, ease: 'power2.inOut' }, Math.max(0, at - 0.15))
        }
      })
      return () => mm.revert()
    },
    { scope: root, dependencies: [w, h], revertOnUpdate: true },
  )

  return (
    <section ref={root} id="combo" aria-labelledby="combo-title" className="relative bg-night text-ink lg:h-[220dvh]">
      <div className="lg:sticky lg:top-[var(--header-h)] lg:h-[calc(100dvh-var(--header-h))]">
        <div ref={stage} className="wrap relative flex h-full flex-col gap-8 py-[var(--section-y)] lg:block lg:py-0">
          {/* offer — top right, wide and short so it only takes the upper band */}
          <div className="lg:absolute lg:right-[var(--page-x)] lg:top-[4%] lg:w-[min(36rem,36%)]">
            <h2 id="combo-title" className="h2">{combo.name}</h2>
            <p className="mt-3 text-[1.05rem] text-ink/90 lg:text-[1rem]">{combo.duration}, bốn bước đi trọn từ chân lên đầu: thân được thả lỏng, tâm được xoa dịu, trí được làm mới.</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
              <p className="flex items-baseline gap-2">
                <span className="font-display text-[2.75rem] font-semibold leading-none text-amber">{combo.price}</span>
                <span className="text-ink/85">/ {combo.duration}</span>
              </p>
              <Cta target={primaryCta.target}>Đặt Combo Chuyên Sâu</Cta>
            </div>
          </div>

          {/* one photo — bottom left, changes per stage */}
          <div className="frame relative aspect-[4/3] w-full lg:absolute lg:bottom-[4%] lg:left-[var(--page-x)] lg:aspect-auto lg:h-[40%] lg:w-[24%]">
            {combo.steps.map((s, i) => (
              <img key={s.no} src={s.image.src} alt={i === 0 ? s.image.alt : ''} aria-hidden={i > 0} loading="lazy"
                className={`cp-img absolute inset-0 h-full w-full object-cover ${i > 0 ? 'max-lg:hidden' : ''}`} style={{ zIndex: i }} />
            ))}
          </div>

          {/* winding progress path (desktop) — pixel space of the stage */}
          {w > 0 && (
            <svg aria-hidden="true" viewBox={`0 0 ${w} ${h}`} className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block">
              <path d={d} fill="none" stroke="color-mix(in oklab, var(--color-ink) 22%, transparent)" strokeWidth="2" />
              <path className="cp-fill" d={d} fill="none" stroke="var(--color-amber)" strokeWidth="3" strokeLinecap="round" />
            </svg>
          )}

          {/* steps along the path */}
          <ol className="relative grid gap-6 border-l-2 border-amber/60 pl-6 lg:static lg:block lg:border-0 lg:pl-0">
            {combo.steps.map((s, i) => (
              <li
                key={s.no}
                className="cp-step relative lg:absolute lg:z-[2] lg:w-[min(16rem,20%)]"
                data-side={i === PTS.length - 1 ? 'left' : 'above'}
                style={{ '--x': `${PTS[i].x}%`, '--y': `${PTS[i].y}%` } as CSSProperties}
              >
                <span aria-hidden="true" className="cp-dot absolute -left-[2.05rem] top-1.5 block h-5 w-5 rounded-full border-2 border-amber bg-amber lg:hidden" />
                <h3 className="font-display text-[1.45rem] font-semibold leading-tight">{s.name}</h3>
                <p className="mt-1 text-[0.98rem] text-ink/90">{s.text}</p>
              </li>
            ))}
          </ol>
          {/* desktop dots, exactly on the path points */}
          {PTS.map((p, i) => (
            <span key={i} aria-hidden="true" className="cp-ddot absolute z-[1] hidden h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-amber bg-amber lg:block"
              style={{ left: `${p.x}%`, top: `${p.y}%` }} />
          ))}
        </div>
      </div>
    </section>
  )
}
