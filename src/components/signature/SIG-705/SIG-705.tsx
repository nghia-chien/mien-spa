// DUDI Signature SIG-705 v1.0.0 → biến thể dự án: không đổ bóng, chữ nhỏ ≥ 13px, lề trang chung, thêm prop aside (ảnh khách cạnh review)
// Cast in-project for the Miên Spa phôi (13/11/2026); not yet in the library.

import { useRef } from 'react'
import type { ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export interface Sig705Message {
  name: string
  text: string
  /** Small line under the name, e.g. "★★★★★ · Google". */
  meta?: string
  /** e.g. "Bản dịch tự động của Google" */
  note?: string
  lang?: string
}

export interface Sig705Props {
  id?: string
  className?: string
  /** 1 calm · 2 default · 3 bold — typing pause length and pop strength */
  intensity?: 1 | 2 | 3
  eyebrow?: string
  title: ReactNode
  intro?: ReactNode
  messages: Sig705Message[]
  /** Label above the thread, e.g. source of the reviews. Required for honesty: these are reviews, not private chats. */
  sourceLabel: string
  footer?: ReactNode
  /** Project variant: content shown beside the thread (e.g. guest photos). */
  aside?: ReactNode
  labels?: { typing?: string }
}

/**
 * Reviews appear like a message thread: three "typing" dots, then the bubble pops out; next one follows.
 * All bubbles are in the DOM from the start (screen readers read them at once); the sequence only animates
 * from hidden. Plays once when the thread enters the screen; total ≤ ~1.1s per message.
 */
export function Sig705ChatReviews({ id, className = '', intensity = 2, eyebrow, title, intro, messages, sourceLabel, footer, aside, labels }: Sig705Props) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add({ motion: '(prefers-reduced-motion: no-preference)', mobile: '(max-width: 767px)' }, (ctx) => {
        if (!ctx.conditions?.motion) return
        const k = intensity === 1 ? 0.8 : intensity === 3 ? 1.25 : 1
        const typingDur = (ctx.conditions.mobile ? 0.32 : 0.42) * k
        const rows = gsap.utils.toArray<HTMLElement>('.sig705-row')
        // Each message plays when IT enters the screen, so a fast scroller never meets an empty thread.
        rows.forEach((row, i) => {
          const typing = row.querySelector('.sig705-typing')
          const bubble = row.querySelector('.sig705-bubble')
          const dots = row.querySelectorAll('.sig705-dot')
          gsap.set(bubble, { autoAlpha: 0 })
          const tl = gsap.timeline({ paused: true })
          tl.fromTo(typing, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.15 }, 0)
            .fromTo(dots, { y: 0 }, { y: -4, duration: 0.14, stagger: 0.07, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 0.05)
            .to(typing, { autoAlpha: 0, scale: 0.6, duration: 0.12 }, typingDur)
            .fromTo(bubble, { autoAlpha: 0, y: 14, scale: 0.92, transformOrigin: i % 2 ? '100% 100%' : '0% 100%' },
              { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: `back.out(${1.2 * k})` }, typingDur + 0.03)
          ScrollTrigger.create({ trigger: row, start: 'top 92%', once: true, onEnter: () => tl.delay((i % 2) * 0.12).play() })
        })
      })
      return () => mm.revert()
    },
    { scope: root, dependencies: [messages.length, intensity] },
  )

  return (
    <section id={id} ref={root} className={`sig705 ${className}`}>
      <style>{CSS}</style>
      <div className="sig705-wrap">
        <header className="sig705-top">
          {eyebrow && <p className="sig705-eyebrow">{eyebrow}</p>}
          <h2 className="sig705-title">{title}</h2>
          {intro && <div className="sig705-intro">{intro}</div>}
        </header>
        {aside && <div className="sig705-aside">{aside}</div>}
        <div className="sig705-phone">
          <p className="sig705-source">{sourceLabel}</p>
          <ol className="sig705-thread">
            {messages.map((m, i) => (
              <li key={`${m.name}-${i}`} className={`sig705-row ${i % 2 ? 'is-right' : ''}`}>
                <span className="sig705-typing" aria-hidden="true" title={labels?.typing ?? 'đang nhập'}>
                  <i className="sig705-dot" /><i className="sig705-dot" /><i className="sig705-dot" />
                </span>
                <figure className="sig705-bubble">
                  <blockquote lang={m.lang} className="sig705-text">{m.text}</blockquote>
                  <figcaption className="sig705-cap">
                    <span className="sig705-name">{m.name}</span>
                    {m.meta && <span className="sig705-meta">{m.meta}</span>}
                    {m.note && <span className="sig705-note">{m.note}</span>}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ol>
          {footer && <div className="sig705-footer">{footer}</div>}
        </div>
      </div>
    </section>
  )
}

const CSS = `
.sig705 { scroll-margin-top: var(--header-h, 0px); background: var(--sig-bg, #0e0e0e); color: var(--sig-fg, #f4efe8);
  font-family: var(--sig-font-body, system-ui, sans-serif); padding: clamp(5rem, 12vw, 10rem) var(--page-x, clamp(1.25rem, 5vw, 4rem)); }
.sig705-wrap { max-width: 80rem; margin: 0 auto; display: grid; grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr); gap: clamp(2rem, 6vw, 6rem); align-items: start; }
.sig705-top { position: sticky; top: calc(var(--header-h, 0px) + 10vh); }
.sig705-eyebrow { margin: 0 0 .75rem; font-size: .75rem; letter-spacing: .3em; text-transform: uppercase; color: var(--sig-accent, #e0a25b); }
.sig705-title { margin: 0; font-family: var(--sig-font-display, serif); font-weight: 500; font-size: clamp(2.6rem, 5vw, 4.6rem); line-height: .95; letter-spacing: -.02em; }
.sig705-intro { margin-top: 1.5rem; max-width: 24rem; font-size: 1.0625rem; line-height: 1.6; }
.sig705-phone { border-radius: 1.6rem; padding: clamp(1rem, 2.4vw, 1.75rem); background: color-mix(in oklab, var(--sig-fg, #f4efe8) 6%, var(--sig-bg, #0e0e0e)); }
.sig705-source { margin: 0 0 1rem; text-align: center; font-size: .875rem; }
.sig705-thread { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 1rem; }
.sig705-row { position: relative; display: flex; flex-direction: column; align-items: flex-start; }
.sig705-row.is-right { align-items: flex-end; }
.sig705-typing { position: absolute; top: 0; display: inline-flex; gap: 4px; padding: .7rem .9rem; border-radius: 1.1rem; background: var(--sig705-bubble, #fff); visibility: hidden; }
.sig705-row.is-right .sig705-typing { right: 0; }
.sig705-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; opacity: .45; display: block; }
.sig705-bubble { margin: 0; max-width: min(34rem, 88%); padding: .9rem 1.1rem .75rem; border-radius: 1.2rem 1.2rem 1.2rem .35rem;
  background: var(--sig705-bubble, #fff); color: var(--sig705-bubble-fg, #222); }
.sig705-row.is-right .sig705-bubble { border-radius: 1.2rem 1.2rem .35rem 1.2rem; background: var(--sig705-bubble-alt, var(--sig-accent, #e0a25b)); color: var(--sig705-bubble-alt-fg, #fff); }
.sig705-text { margin: 0; font-size: 1.0625rem; line-height: 1.55; }
.sig705-cap { display: flex; flex-wrap: wrap; gap: .25rem .6rem; margin-top: .6rem; font-size: .8125rem; }
.sig705-name { font-weight: 600; }
.sig705-note { font-style: italic; }
.sig705-footer { margin-top: 1.5rem; }
@media (max-width: 767px) {
  .sig705-wrap { grid-template-columns: 1fr; }
  .sig705-top { position: static; }
  .sig705-bubble { max-width: 92%; }
}
`

export default Sig705ChatReviews
