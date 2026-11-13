// DUDI Signature SIG-208 v1.0.0 → biến thể dự án: vách chéo (trên-trái → dưới-phải) bám theo chuột, hero = 1 khung màn hình, thông tin + nút nổi trên lớp riêng
// Cast in-project for the Miên Spa phôi (13/11/2026); not yet in the library.

import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent, ReactNode } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export interface Sig208Mood {
  kicker: string
  title: string
  image: { src: string; alt: string; isResultPhoto?: boolean }
}

export interface Sig208Props {
  id?: string
  className?: string
  /** 1 calm · 2 default · 3 bold — intro sweep distance and follow speed */
  intensity?: 1 | 2 | 3
  /** Lower-left mood (left of the diagonal). */
  before: Sig208Mood
  /** Upper-right mood (right of the diagonal). */
  after: Sig208Mood
  /** Independent layer, top-left of the banner (brand h1, lead). Never clipped by the wall. */
  info?: ReactNode
  /** Independent floating layer, bottom-right corner (CTA). Never clipped by the wall. */
  action?: ReactNode
  dragHint?: string
  labels?: { handle?: string }
}

// Horizontal shift of the wall per px of height → the wall runs top-left to bottom-right ("\").
const TILT = 0.42
const clamp = (v: number, a = 0.04, b = 0.96) => Math.min(b, Math.max(a, v))

export function Sig208TwoMoodHero({ id, className = '', intensity = 2, before, after, info, action, dragHint, labels }: Sig208Props) {
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0.5, y: 0.5 }) // wall anchor point, as fractions of the stage
  const [value, setValue] = useState(50)
  const dragging = useRef(false)
  const follow = useRef<{ x: (v: number) => void; y: (v: number) => void } | null>(null)

  /** Write the geometry: the wall passes through (x, y) with a fixed "\" tilt. */
  const render = useCallback(() => {
    const st = stage.current
    const el = root.current
    if (!st || !el) return
    const W = st.clientWidth
    const H = st.clientHeight
    const cx = pos.current.x * W
    const cy = pos.current.y * H
    const xt = cx - cy * TILT // where the wall meets the top edge
    const xb = cx + (H - cy) * TILT // ... and the bottom edge
    el.style.setProperty('--sig208-xt', `${xt}px`)
    el.style.setProperty('--sig208-xb', `${xb}px`)
    el.style.setProperty('--sig208-cx', `${cx}px`)
    el.style.setProperty('--sig208-cy', `${cy}px`)
    const line = el.querySelector<SVGLineElement>('.sig208-wall line')
    if (line) {
      line.setAttribute('x1', String(xt))
      line.setAttribute('x2', String(xb))
      line.setAttribute('y2', String(H))
    }
    setValue(Math.round(pos.current.x * 100))
  }, [])

  useLayoutEffect(() => {
    render()
    const ro = new ResizeObserver(render)
    if (stage.current) ro.observe(stage.current)
    return () => ro.disconnect()
  }, [render])

  const { contextSafe } = useGSAP(
    () => {
      const p = pos.current
      const mm = gsap.matchMedia()
      mm.add({ motion: '(prefers-reduced-motion: no-preference)', fine: '(pointer: fine)' }, (ctx) => {
        if (!ctx.conditions?.motion) {
          p.x = 0.5
          p.y = 0.5
          render()
          follow.current = null
          return
        }
        const k = intensity === 1 ? 0.75 : intensity === 3 ? 1.25 : 1
        const speed = intensity === 1 ? 0.8 : intensity === 3 ? 0.35 : 0.55
        follow.current = {
          x: gsap.quickTo(p, 'x', { duration: speed, ease: 'power3.out', onUpdate: render }),
          y: gsap.quickTo(p, 'y', { duration: speed, ease: 'power3.out', onUpdate: render }),
        }
        // Intro: the wall sweeps across showing both moods, then rests in the middle.
        gsap.timeline({ delay: 0.4, onUpdate: render })
          .fromTo(p, { x: 0.98 }, { x: 0.5 - 0.2 * k, duration: 1.1 / k, ease: 'power3.inOut' })
          .to(p, { x: 0.5, duration: 0.7, ease: 'power2.out' })
          .fromTo('.sig208-hint', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, '-=0.3')
        gsap.from('.sig208-copy, .sig208-info, .sig208-action', { autoAlpha: 0, y: 24, duration: 0.8, stagger: 0.12, delay: 0.5, ease: 'power3.out' })
      })
      return () => mm.revert()
    },
    { scope: root, dependencies: [intensity] },
  )

  const toPoint = (clientX: number, clientY: number) => {
    const r = stage.current?.getBoundingClientRect()
    if (!r) return null
    return { x: clamp((clientX - r.left) / r.width), y: clamp((clientY - r.top) / r.height, 0.08, 0.92) }
  }

  const moveTo = contextSafe((x: number, y: number, instant = false) => {
    if (follow.current && !instant) {
      follow.current.x(x)
      follow.current.y(y)
    } else {
      gsap.killTweensOf(pos.current)
      pos.current.x = x
      pos.current.y = y
      render()
    }
  })

  const hideHint = contextSafe(() => gsap.to('.sig208-hint', { autoAlpha: 0, duration: 0.2 }))

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    // Mouse: the wall follows the pointer without pressing. Touch/pen: only while dragging.
    if (e.pointerType !== 'mouse' && !dragging.current) return
    const pt = toPoint(e.clientX, e.clientY)
    if (!pt) return
    hideHint()
    moveTo(pt.x, pt.y, e.pointerType !== 'mouse')
  }
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse') return
    if ((e.target as HTMLElement).closest('a, button:not(.sig208-handle)')) return
    dragging.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    onMove(e)
  }
  const onUp = () => { dragging.current = false }
  const onLeave = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse') moveTo(0.5, 0.5)
  }

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const step = e.shiftKey ? 0.2 : 0.05
    const map: Record<string, number> = { ArrowLeft: -step, ArrowRight: step, Home: -1, End: 1 }
    if (!(e.key in map)) return
    e.preventDefault()
    moveTo(clamp(pos.current.x + map[e.key]), pos.current.y, true)
  }

  return (
    <section id={id} ref={root} className={`sig208 ${className}`}>
      <style>{CSS}</style>
      <div
        ref={stage}
        className="sig208-stage"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onPointerLeave={onLeave}
      >
        {/* each mood carries its own copy, so the wall clips image + words together */}
        <div className="sig208-mood sig208-after" aria-hidden={value > 90}>
          <img src={after.image.src} alt={after.image.alt} draggable={false} />
          <div className="sig208-scrim" aria-hidden="true" />
          <div className="sig208-copy sig208-copy--after">
            {after.kicker && <p className="sig208-kicker">{after.kicker}</p>}
            <p className="sig208-title">{after.title}</p>
          </div>
        </div>
        <div className="sig208-mood sig208-before" aria-hidden={value < 10}>
          <img src={before.image.src} alt={before.image.alt} draggable={false} />
          <div className="sig208-scrim" aria-hidden="true" />
          <div className="sig208-copy sig208-copy--before">
            {before.kicker && <p className="sig208-kicker">{before.kicker}</p>}
            <p className="sig208-title">{before.title}</p>
          </div>
        </div>

        <svg className="sig208-wall" aria-hidden="true">
          <line x1="0" y1="0" x2="0" y2="0" />
        </svg>
        <button
          type="button"
          className="sig208-handle"
          role="slider"
          aria-label={labels?.handle ?? 'Vách giữa hai khung cảnh'}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={value}
          aria-valuetext={`${before.kicker || before.title} ${value}%, ${after.kicker || after.title} ${100 - value}%`}
          onKeyDown={onKey}
        >
          <span aria-hidden="true">‹ ›</span>
        </button>
        {dragHint && <p className="sig208-hint" aria-hidden="true">{dragHint}</p>}

        {info && <div className="sig208-info">{info}</div>}
        {action && <div className="sig208-action">{action}</div>}
      </div>
    </section>
  )
}

const CSS = `
.sig208 { position: relative; scroll-margin-top: var(--header-h, 0px); background: var(--sig-bg, #0e0e0e); color: #fff;
  font-family: var(--sig-font-body, system-ui, sans-serif); --sig208-xt: 50%; --sig208-xb: 50%; --sig208-cx: 50%; --sig208-cy: 50%; }
.sig208-stage { position: relative; height: calc(100dvh - var(--header-h, 0px)); min-height: 30rem; overflow: clip; touch-action: pan-y; user-select: none; }
@media (pointer: fine) { .sig208-stage { cursor: none; } .sig208-stage a, .sig208-stage button { cursor: pointer; } }
.sig208-mood { position: absolute; inset: 0; }
.sig208-before { clip-path: polygon(0 0, var(--sig208-xt) 0, var(--sig208-xb) 100%, 0 100%); }
.sig208-mood img { width: 100%; height: 100%; object-fit: cover; display: block; max-width: none; pointer-events: none; }
.sig208-scrim { position: absolute; inset: 0; pointer-events: none;
  /* neutral legibility scrim over the photos (the one allowed gradient) taste-skill-ignore */
  background: linear-gradient(to bottom, rgba(30,18,12,.72) 0%, rgba(30,18,12,.28) 34%, rgba(30,18,12,.08) 52%, rgba(30,18,12,.3) 70%, rgba(30,18,12,.78) 100%); } /* taste-skill-ignore: scrim */
.sig208-wall { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; }
.sig208-wall line { stroke: var(--sig-bg, #fff); stroke-width: 2; }
.sig208-copy { position: absolute; max-width: min(26rem, 38%); pointer-events: none; }
.sig208-copy--before { left: var(--page-x, clamp(1.25rem, 5vw, 4rem)); bottom: clamp(1.5rem, 6vh, 3.5rem); }
.sig208-copy--after { right: var(--page-x, clamp(1.25rem, 5vw, 4rem)); top: 46%; text-align: right; }
.sig208-kicker { margin: 0 0 .5rem; font-size: .75rem; letter-spacing: .3em; text-transform: uppercase; opacity: .9; }
.sig208-title { margin: 0; font-family: var(--sig-font-display, serif); font-size: clamp(1.5rem, 2.5vw, 2.25rem); line-height: 1.12; font-weight: 500; }
.sig208-handle { position: absolute; left: var(--sig208-cx); top: var(--sig208-cy); transform: translate(-50%, -50%); width: 3.25rem; height: 3.25rem;
  border-radius: 50%; border: 2px solid #fff; background: var(--sig-accent, #e0a25b); color: #fff; font-size: 1.05rem; letter-spacing: .1em;
  touch-action: none; z-index: 2; }
/* project variant: no visible handle icon (owner request) — still a keyboard slider, shown only on keyboard focus */
.sig208-handle { opacity: 0; }
.sig208-handle:focus-visible { opacity: 1; outline: 3px solid #fff; outline-offset: 3px; }
.sig208-hint { position: absolute; left: var(--sig208-cx); top: calc(var(--sig208-cy) + 2.4rem); transform: translateX(-50%); margin: 0; white-space: nowrap;
  font-size: .875rem; background: rgba(30,18,12,.72); padding: .4rem .9rem; border-radius: 99px; pointer-events: none; z-index: 2; }
.sig208-info { position: absolute; left: var(--page-x, clamp(1.25rem, 5vw, 4rem)); top: clamp(1.5rem, 6vh, 3.5rem); max-width: min(62rem, 84%); z-index: 3; }
.sig208-action { position: absolute; right: var(--page-x, clamp(1.25rem, 4vw, 3rem)); bottom: clamp(1.25rem, 5vh, 2.75rem); z-index: 4; }
@media (max-width: 767px) {
  .sig208-stage { min-height: 32rem; }
  .sig208-info { max-width: calc(100% - 2.5rem); }
  .sig208-copy { max-width: 58%; }
  .sig208-copy--before { bottom: 6.5rem; }
  .sig208-copy--after { top: 50%; }
  .sig208-title { font-size: 1.3rem; }
  .sig208-kicker { font-size: .62rem; letter-spacing: .2em; }
  .sig208-handle { width: 2.9rem; height: 2.9rem; }
}
`

export default Sig208TwoMoodHero
