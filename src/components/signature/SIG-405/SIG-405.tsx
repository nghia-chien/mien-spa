// DUDI Signature SIG-405 v1.0.0 → biến thể dự án: nhãn tầng chữ thường, chữ ≥ 13px, lề trang chung, Flip chỉ trên ô (mượt), tấm chi tiết trượt vào sau
// Cast in-project for the Miên Spa phôi (13/11/2026); not yet in the library.

import { useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(Flip, ScrollTrigger)

export interface Sig405Item {
  id: string
  title: string
  /** Short line always visible on the tile (e.g. "từ 149K"). Never hide prices behind a click. */
  meta?: string
  tag?: string
  image: { src: string; alt: string; isResultPhoto?: boolean }
  /** Shown when the tile is open. */
  details?: ReactNode
}

export interface Sig405Props {
  id?: string
  className?: string
  /** 1 calm · 2 default · 3 bold — Flip duration and entrance travel */
  intensity?: 1 | 2 | 3
  eyebrow?: string
  title: ReactNode
  intro?: ReactNode
  items: Sig405Item[]
  /** Index open on load (default 0). */
  initialOpen?: number
  labels?: { open?: string; close?: string }
}

/**
 * Tiles of mixed sizes. Click (or Enter/Space) a tile: it grows to the large slot and reveals its details,
 * the other tiles slide to their new places (GSAP Flip). Exactly one tile is open at a time.
 * Mobile: one column; the open tile grows taller in place. Reduced motion: instant layout change.
 */
export function Sig405BentoGrid({ id, className = '', intensity = 2, eyebrow, title, intro, items, initialOpen = 0, labels }: Sig405Props) {
  const root = useRef<HTMLElement>(null)
  const flipState = useRef<Flip.FlipState | null>(null)
  const [open, setOpen] = useState(Math.min(initialOpen, items.length - 1))
  const dur = intensity === 1 ? 0.5 : intensity === 3 ? 0.85 : 0.7

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.sig405-tile', {
          y: 30 * (intensity === 3 ? 1.6 : intensity === 1 ? 0.6 : 1),
          opacity: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.sig405-grid', start: 'top 80%', once: true },
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  const choose = (i: number) => {
    if (i === open || !root.current) return
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      flipState.current = Flip.getState(root.current.querySelectorAll('.sig405-tile'))
    }
    setOpen(i)
  }

  useLayoutEffect(() => {
    const state = flipState.current
    if (!state || !root.current) return
    flipState.current = null
    Flip.from(state, {
      duration: dur,
      ease: 'power3.inOut',
      prune: true,
      onComplete: () => ScrollTrigger.refresh(),
    })
    gsap.fromTo(root.current.querySelector('.sig405-tile.is-open .sig405-details'), { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.4, delay: dur * 0.75, ease: 'power2.out' })
  }, [open, dur])

  return (
    <section id={id} ref={root} className={`sig405 ${className}`}>
      <style>{CSS}</style>
      <header className="sig405-top">
        <div>
          {eyebrow && <p className="sig405-eyebrow">{eyebrow}</p>}
          <h2 className="sig405-title">{title}</h2>
        </div>
        {intro && <div className="sig405-intro">{intro}</div>}
      </header>
      <ul className="sig405-grid">
        {items.map((it, i) => {
          const isOpen = i === open
          return (
            <li key={it.id} data-flip-id={it.id} className={`sig405-tile ${isOpen ? 'is-open' : ''}`}>
              <img data-flip-id={`${it.id}-img`} src={it.image.src} alt={it.image.alt} loading="lazy" />
              <div className="sig405-scrim" aria-hidden="true" />
              <button
                type="button"
                className="sig405-head"
                data-flip-id={`${it.id}-head`}
                aria-expanded={isOpen}
                aria-controls={`${it.id}-details`}
                onClick={() => choose(i)}
              >
                {it.tag && <span className="sig405-tag">{it.tag}</span>}
                <span className="sig405-name">{it.title}</span>
                {it.meta && <span className="sig405-meta">{it.meta}</span>}
                {!isOpen && <span className="sig405-plus" aria-hidden="true">+</span>}
                <span className="sr-only">{isOpen ? labels?.close ?? 'Đang mở' : labels?.open ?? 'Xem chi tiết'}</span>
              </button>
              <div id={`${it.id}-details`} className="sig405-details" hidden={!isOpen}>
                {it.details}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

const CSS = `
.sig405 { scroll-margin-top: var(--header-h, 0px); background: var(--sig-bg, #0e0e0e); color: var(--sig-fg, #f4efe8);
  font-family: var(--sig-font-body, system-ui, sans-serif); padding: clamp(5rem, 12vw, 10rem) var(--page-x, clamp(1.25rem, 5vw, 4rem)); }
.sig405 .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.sig405-top { display: flex; flex-wrap: wrap; justify-content: flex-start; align-items: flex-end; gap: 1rem 3rem; max-width: 80rem; margin: 0 auto clamp(2rem, 5vw, 3.5rem); }
.sig405-eyebrow { margin: 0 0 .75rem; font-size: .75rem; letter-spacing: .3em; text-transform: uppercase; color: var(--sig-accent, #e0a25b); }
.sig405-title { margin: 0; font-family: var(--sig-font-display, serif); font-weight: 500; font-size: clamp(2.8rem, 5.4vw, 5rem); line-height: .92; letter-spacing: -.02em; }
.sig405-intro { max-width: 24rem; font-size: 1.0625rem; line-height: 1.6; }
.sig405-grid { list-style: none; margin: 0 auto; padding: 0; max-width: 80rem; display: grid; gap: clamp(.6rem, 1.2vw, 1rem);
  grid-template-columns: repeat(4, minmax(0, 1fr)); grid-auto-rows: clamp(11rem, 19vw, 17rem); grid-auto-flow: dense; }
.sig405-tile { position: relative; border-radius: 1.1rem; overflow: clip; background: color-mix(in oklab, var(--sig-accent, #e0a25b) 30%, transparent); }
/* open tile 2×2 + four 1×1 tiles = a full 4×2 grid, no holes */
.sig405-tile.is-open { grid-column: span 2; grid-row: span 2; }
.sig405-tile img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; max-width: none; }
.sig405-scrim { position: absolute; inset: 0; background: linear-gradient(to top, rgba(20,12,8,.82) 0%, rgba(20,12,8,.25) 48%, transparent 75%); pointer-events: none; } /* taste-skill-ignore: scrim */
.sig405-head { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-start; gap: .25rem;
  padding: clamp(.9rem, 1.8vw, 1.4rem); border: 0; background: none; color: #fff; text-align: left; cursor: pointer; font: inherit; }
.sig405-tile.is-open .sig405-head { cursor: default; position: relative; inset: auto; padding-bottom: .5rem; }
.sig405-tag { font-size: .875rem; }
.sig405-name { font-family: var(--sig-font-display, serif); font-size: clamp(1.25rem, 2vw, 1.75rem); line-height: 1.05; }
.sig405-tile.is-open .sig405-name { font-size: clamp(1.9rem, 3.4vw, 3rem); }
.sig405-meta { font-size: 1rem; font-weight: 600; color: var(--sig405-meta, #ffd79a); }
.sig405-plus { position: absolute; top: .8rem; right: .9rem; width: 2rem; height: 2rem; border-radius: 50%; display: grid; place-items: center;
  background: rgba(255,255,255,.18); font-size: 1.2rem; transition: background .2s; }
.sig405-head:hover .sig405-plus, .sig405-head:focus-visible .sig405-plus { background: var(--sig-accent, #e0a25b); }
.sig405-head:focus-visible { outline: 3px solid #fff; outline-offset: -6px; border-radius: 1rem; }
.sig405-details { position: relative; padding: 0 clamp(.9rem, 1.8vw, 1.4rem) clamp(.9rem, 1.8vw, 1.4rem); color: #fff; font-size: 1rem; line-height: 1.55; }
.sig405-tile.is-open { display: flex; flex-direction: column; justify-content: flex-end; }
@media (max-width: 1023px) { .sig405-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 767px) {
  .sig405-grid { grid-template-columns: 1fr; grid-auto-rows: auto; }
  .sig405-tile { grid-row: auto; min-height: 8.5rem; }
  .sig405-tile.is-open { grid-column: auto; grid-row: auto; min-height: 24rem; }
}
`

export default Sig405BentoGrid
