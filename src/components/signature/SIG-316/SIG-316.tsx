// DUDI Signature SIG-316 v1.0.0 → biến thể dự án: tiêu đề tầng là h3 thường (không nhãn in hoa), mobile không làm mờ đoạn văn
// Cast in-project for the Miên Spa phôi (13/11/2026); not yet in the library.

import { useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export interface Sig316Item {
  no: string
  name: string
  text: ReactNode
  image?: { src: string; alt: string; isResultPhoto?: boolean }
}

export interface Sig316Props {
  id?: string
  className?: string
  /** 1 calm · 2 default · 3 bold — paragraph travel and dim contrast */
  intensity?: 1 | 2 | 3
  heading: ReactNode
  items: Sig316Item[]
  /** Fires when the active paragraph changes (e.g. to retint the page). */
  onActiveChange?: (index: number) => void
}

/**
 * Left: heading + a big "01 / 03" counter and the active item's name stay sticky.
 * Right: one paragraph block per item; as each reaches the middle of the screen it becomes active,
 * the counter rolls to its number and the others dim. Scroll-spy, no pin.
 */
export function Sig316StickyHeading({ id, className = '', intensity = 2, heading, items, onActiveChange }: Sig316Props) {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const total = String(items.length).padStart(2, '0')
  const dim = intensity === 1 ? 0.4 : intensity === 3 ? 0.14 : 0.24

  useGSAP(
    () => {
      const blocks = gsap.utils.toArray<HTMLElement>('.sig316-block')
      const mm = gsap.matchMedia()
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        root.current?.classList.add('sig316--motion')
        blocks.forEach((b, i) => {
          ScrollTrigger.create({
            trigger: b,
            start: 'top 55%',
            end: 'bottom 55%',
            onToggle: (self) => {
              if (!self.isActive) return
              setActive(i)
              onActiveChange?.(i)
              gsap.to(blocks, { opacity: (j: number) => (j === i ? 1 : dim), duration: 0.5, overwrite: 'auto' })
            },
          })
          // project variant: no per-block scrub (scrub is already used twice on this page)
        })
        gsap.set(blocks, { opacity: (j: number) => (j === 0 ? 1 : dim) })
        return () => root.current?.classList.remove('sig316--motion')
      })
      mm.add('(max-width: 767px), (prefers-reduced-motion: reduce)', () => {
        blocks.forEach((b, i) => ScrollTrigger.create({ trigger: b, start: 'top 55%', end: 'bottom 55%', onToggle: (s) => s.isActive && (setActive(i), onActiveChange?.(i)) }))
      })
      return () => mm.revert()
    },
    { scope: root, dependencies: [items.length, intensity] },
  )

  const cur = items[active]

  return (
    <section id={id} ref={root} className={`sig316 ${className}`} style={{ scrollMarginTop: 'var(--header-h, 0px)' } as CSSProperties}>
      <style>{CSS}</style>
      <div className="sig316-grid">
        <div className="sig316-aside">
          <div className="sig316-sticky">
            <h2 className="sig316-heading">{heading}</h2>
            <div className="sig316-counter" aria-hidden="true">
              <span className="sig316-roll">
                <span key={cur.no} className="sig316-num">{cur.no}</span>
              </span>
              <span className="sig316-total">/ {total}</span>
            </div>
            <p key={cur.name} className="sig316-name" aria-live="polite">{cur.name}</p>
          </div>
        </div>
        <ol className="sig316-list">
          {items.map((it) => (
            <li key={it.no} className="sig316-block">
              <div className="sig316-body">
                <h3 className="sig316-label">{it.name}</h3>
                <div className="sig316-text">{it.text}</div>
                {it.image && (
                  <figure className="sig316-pic">
                    <img src={it.image.src} alt={it.image.alt} loading="lazy" />
                  </figure>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

const CSS = `
.sig316 { color: var(--sig-fg, #f4efe8); font-family: var(--sig-font-body, system-ui, sans-serif); padding: clamp(5rem, 12vw, 10rem) var(--page-x, clamp(1.25rem, 5vw, 4rem)); }
.sig316-grid { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); gap: clamp(2rem, 6vw, 6rem); max-width: 80rem; margin: 0 auto; }
.sig316-sticky { position: sticky; top: calc(var(--header-h, 0px) + 12vh); }
.sig316-heading { font-family: var(--sig-font-display, serif); font-weight: 500; font-size: clamp(2.6rem, 5vw, 4.6rem); line-height: .95; letter-spacing: -.02em; margin: 0; }
.sig316-counter { display: flex; align-items: baseline; gap: .6rem; margin-top: clamp(1.5rem, 4vw, 3rem); font-family: var(--sig-font-display, serif); }
.sig316-roll { display: inline-block; overflow: clip; height: 1em; line-height: 1; font-size: clamp(5rem, 12vw, 10rem); }
.sig316-num { display: block; animation: sig316-roll .55s cubic-bezier(.2,.7,.2,1); color: var(--sig-accent, #e0a25b); }
.sig316-total { font-size: clamp(1.2rem, 2vw, 1.6rem); }
.sig316-name { margin: .5rem 0 0; font-family: var(--sig-font-display, serif); font-size: clamp(1.4rem, 2.2vw, 1.9rem); animation: sig316-fade .5s ease; }
@keyframes sig316-roll { from { transform: translateY(100%); } to { transform: translateY(0); } }
@keyframes sig316-fade { from { opacity: 0; transform: translateY(.4em); } to { opacity: 1; transform: none; } }
.sig316-list { list-style: none; margin: 0; padding: 0; }
.sig316-block { min-height: 62vh; display: flex; align-items: center; }
.sig316-label { margin: 0 0 1rem; font-family: var(--sig-font-display, serif); font-weight: 500; font-size: clamp(2.2rem, 3.6vw, 3.2rem); line-height: 1; color: var(--sig-accent, #e0a25b); }
.sig316-text { font-size: clamp(1.15rem, 1.7vw, 1.5rem); line-height: 1.5; max-width: 34rem; }
.sig316-text p { margin: 0; }
.sig316-pic { margin: 2rem 0 0; border-radius: 1.1rem; overflow: clip; aspect-ratio: 4 / 3; max-width: 32rem; }
.sig316-pic img { width: 100%; height: 100%; object-fit: cover; display: block; }
@media (max-width: 767px) {
  .sig316-grid { grid-template-columns: 1fr; gap: 0; }
  .sig316-sticky { top: var(--header-h, 0px); z-index: 2; padding: .9rem 0; background: inherit; display: flex; align-items: baseline; gap: 1rem; flex-wrap: wrap; }
  .sig316-aside { position: sticky; top: var(--header-h, 0px); z-index: 2; background: var(--sig316-bar, var(--sig-bg, #0e0e0e)); margin: 0 calc(-1 * clamp(1.25rem, 5vw, 4rem)); padding: 0 clamp(1.25rem, 5vw, 4rem); }
  .sig316-heading { font-size: 1.6rem; flex-basis: 100%; }
  .sig316-label { font-size: 2rem; }
  .sig316-counter { margin-top: 0; }
  .sig316-roll { font-size: 2.6rem; }
  .sig316-name { margin: 0; font-size: 1.6rem; }
  .sig316-block { min-height: 0; padding: 3rem 0; }
}
@media (prefers-reduced-motion: reduce) { .sig316-num, .sig316-name { animation: none; } }
`

export default Sig316StickyHeading
