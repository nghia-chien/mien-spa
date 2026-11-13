// DUDI Signature SIG-510 v1.0.0 → biến thể dự án: lề trang chung, tiêu đề lớn hơn, ảnh góc vuông

import { useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export interface Sig510Image {
  src: string
  alt: string
  caption?: string
  /** Real client result photo: only translated, never scaled/skewed/filtered. */
  isResultPhoto?: boolean
}

export interface Sig510Labels {
  /** aria-label of the gallery region */
  region: string
  /** aria-label prefix of each lane, followed by its number */
  lane: string
}

export interface Sig510Props {
  id?: string
  className?: string
  /** 1 calm · 2 default · 3 bold — travel distance and lane height */
  intensity?: 1 | 2 | 3
  eyebrow?: string
  title: ReactNode
  intro?: ReactNode
  /** Up to 3 lanes. Lanes 1 and 3 travel left, lane 2 travels right. */
  lanes: Sig510Image[][]
  labels?: Partial<Sig510Labels>
}

const DEFAULT_LABELS: Sig510Labels = { region: 'Thư viện ảnh', lane: 'Hàng ảnh' }
const HEIGHTS = ['clamp(10rem, 28vh, 20rem)', 'clamp(12rem, 34vh, 24rem)', 'clamp(10rem, 28vh, 20rem)']

export function Sig510ImageLanes({ id, className = '', intensity = 2, eyebrow, title, intro, lanes, labels }: Sig510Props) {
  const root = useRef<HTMLElement>(null)
  const L = { ...DEFAULT_LABELS, ...labels }
  const rows = lanes.slice(0, 3).filter((l) => l.length > 0)
  const amp = intensity === 1 ? 0.7 : intensity === 3 ? 1.4 : 1

  useGSAP(
    () => {
      const el = root.current
      if (!el) return

      // Refresh once the lane images know their widths (widths come from natural aspect ratios).
      const imgs = Array.from(el.querySelectorAll<HTMLImageElement>('img'))
      let pending = imgs.filter((i) => !i.complete).length
      const onLoad = () => { if (--pending <= 0) ScrollTrigger.refresh() }
      imgs.forEach((i) => { if (!i.complete) i.addEventListener('load', onLoad, { once: true }) })

      const mm = gsap.matchMedia()
      mm.add(
        {
          desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
          mobile: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
        },
        (ctx) => {
          const { mobile } = ctx.conditions as { desktop: boolean; mobile: boolean }
          el.classList.add('sig510--motion')
          const tracks = gsap.utils.toArray<HTMLElement>('.sig510-track', el)
          tracks.forEach((track, i) => {
            const leftward = i % 2 === 0
            // Travel = the track's overflow beyond the stage, capped so lanes never empty out.
            const travel = () => {
              const over = track.scrollWidth - el.clientWidth
              const cap = el.clientWidth * (mobile ? 0.55 : 0.75) * amp
              return Math.max(0, Math.min(over, cap))
            }
            gsap.fromTo(
              track,
              { x: () => (leftward ? 0 : -travel()) },
              {
                x: () => (leftward ? -travel() : 0),
                ease: 'none',
                scrollTrigger: {
                  trigger: el,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: mobile ? 0.3 : 0.5,
                  invalidateOnRefresh: true,
                },
              },
            )
          })
          return () => el.classList.remove('sig510--motion')
        },
      )
      return () => {
        imgs.forEach((i) => i.removeEventListener('load', onLoad))
        mm.revert()
      }
    },
    { scope: root, dependencies: [lanes, intensity] },
  )

  const rootStyle: CSSProperties = {
    scrollMarginTop: 'var(--header-h, 0px)',
    background: 'var(--sig-bg, #0e0e0e)',
    color: 'var(--sig-fg, #f4efe8)',
    fontFamily: 'var(--sig-font-body, system-ui, sans-serif)',
    overflow: 'clip',
  }

  return (
    <section id={id} ref={root} className={`sig510 ${className}`} style={rootStyle} aria-label={typeof title === 'string' ? title : L.region}>
      <style>{CSS}</style>
      <header className="sig510-head">
        <div>
          {eyebrow && <p className="sig510-eyebrow">{eyebrow}</p>}
          <h2 className="sig510-title">{title}</h2>
        </div>
        {intro && <div className="sig510-intro">{intro}</div>}
      </header>

      <div className="sig510-lanes" role="region" aria-label={L.region}>
        {rows.map((lane, i) => (
          <div key={i} className="sig510-lane" aria-label={`${L.lane} ${i + 1}`} role="group" style={{ ['--sig510-h' as string]: HEIGHTS[i] } as CSSProperties}>
            <ul className="sig510-track">
              {lane.map((img, j) => (
                <li key={`${img.src}-${j}`} className="sig510-item">
                  <img src={img.src} alt={img.alt} loading="lazy" decoding="async" draggable={false} />
                  {img.caption && <span className="sig510-cap">{img.caption}</span>}
                </li>
              ))}
              {/* visual repeat so a lane never runs out while travelling */}
              {lane.map((img, j) => (
                <li key={`clone-${img.src}-${j}`} className="sig510-item sig510-clone" aria-hidden="true">
                  <img src={img.src} alt="" loading="lazy" decoding="async" draggable={false} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

const CSS = `
.sig510 { padding: clamp(5rem, 12vw, 10rem) 0; }
.sig510-head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 1.25rem 3rem;
  padding: 0 var(--page-x, clamp(1.25rem, 5vw, 4rem)); margin-bottom: clamp(2.5rem, 5vw, 4rem); }
.sig510-eyebrow { font-size: .75rem; letter-spacing: .3em; text-transform: uppercase; color: var(--sig-accent, #e0a25b); margin: 0 0 .75rem; }
.sig510-title { font-family: var(--sig-font-display, serif); font-size: clamp(2.8rem, 5.4vw, 5rem); line-height: .92; letter-spacing: -.02em; margin: 0; font-weight: 500; }
.sig510-intro { max-width: 24rem; font-size: .9rem; line-height: 1.6; color: var(--sig-muted, color-mix(in oklab, var(--sig-fg, #f4efe8) 60%, transparent)); }
.sig510-lanes { display: flex; flex-direction: column; gap: clamp(.6rem, 1.4vw, 1.1rem); }
.sig510-lane { overflow: clip; }
.sig510-track { display: flex; gap: clamp(.6rem, 1.4vw, 1.1rem); list-style: none; margin: 0; padding: 0 var(--page-x, clamp(1.25rem, 5vw, 4rem)); width: max-content; }
.sig510-item { position: relative; flex: none; height: var(--sig510-h); border-radius: 0; overflow: clip;
  background: color-mix(in oklab, var(--sig-accent, #e0a25b) 25%, transparent); }
.sig510-item img { display: block; height: 100%; width: auto; max-width: none; object-fit: cover; user-select: none; }
.sig510-cap { position: absolute; left: 0; bottom: 0; padding: .3rem .6rem; font-size: .8125rem; color: #fff; background: rgba(30,18,12,.72); }
/* Clones only matter while lanes travel */
.sig510-clone { display: none; }
.sig510--motion .sig510-clone { display: block; }
.sig510--motion .sig510-track { will-change: transform; }
/* Reduced motion / no JS: each lane is a native horizontal rail */
.sig510:not(.sig510--motion) .sig510-lane { overflow-x: auto; scroll-snap-type: x proximity; -webkit-overflow-scrolling: touch; }
.sig510:not(.sig510--motion) .sig510-item { scroll-snap-align: start; }
@media (max-width: 767px) {
  .sig510-item { height: calc(var(--sig510-h) * .62); }
  .sig510-cap { display: none; }
}
`

export default Sig510ImageLanes
